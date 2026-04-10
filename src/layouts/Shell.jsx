import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Home, Mail, MessageCircle, Plus, Search, Settings, User } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import brandLogo from "../components/Logo/shit_poster_logo.png";
import { clearPosts, loadPosts, savePosts, seedIfEmpty } from "../lib/postsStorage";
import { uid } from "../lib/utils";
import { localDateKey, localMonthKey } from "../lib/dates";
import { topPostForDay, viralOfMonth } from "../lib/ranking";
import { extractHashtags, normalizeHashToShit } from "../lib/hashtags";
import { getPostReaction, setPostReaction } from "../lib/reactionsStorage";
import { getFirebase, isFirebaseConfigured, ensureSignedIn } from "../firebase/client";
import { createPost, incPostStat, listenToPosts } from "../firebase/posts";
import {
  loadDailyLeader,
  loadNotifications,
  saveDailyLeader,
  saveNotifications,
} from "../lib/notificationsStorage";
import { ensureAccount, saveAccount } from "../lib/accountStorage";

export const ShellContext = React.createContext(null);

const MAX_LEN = 700;
const MAX_TITLE = 300;

export default function Shell() {
  const location = useLocation();
  const composerTitleRef = useRef(null);
  const composerBodyRef = useRef(null);
  const useFirestore = useMemo(() => isFirebaseConfigured(), []);
  const firebase = useMemo(() => (useFirestore ? getFirebase() : null), [useFirestore]);

  const [account, setAccount] = useState(() => ensureAccount());
  const [prefersDark, setPrefersDark] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [posts, setPosts] = useState(() => (useFirestore ? [] : seedIfEmpty(loadPosts())));
  const [composerTitle, setComposerTitle] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [composerLanguage, setComposerLanguage] = useState(() => ensureAccount().languages?.[0] || "English");
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(() => loadNotifications());

  const todayKey = useMemo(() => localDateKey(new Date()), []);
  const monthKey = useMemo(() => localMonthKey(new Date()), []);

  useEffect(() => {
    if (!useFirestore) savePosts(posts);
  }, [posts, useFirestore]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setPrefersDark(Boolean(e.matches));
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onAccountEvent = (e) => {
      if (e?.detail && typeof e.detail === "object") setAccount(e.detail);
    };
    window.addEventListener("shitposter:account", onAccountEvent);
    return () => window.removeEventListener("shitposter:account", onAccountEvent);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const display = account?.display || {};
    const themeMode = String(display.themeMode || "light"); // force light by default
    const effectiveTheme = themeMode === "system" ? (prefersDark ? "dark" : "light") : themeMode;

    if (effectiveTheme === "dark") document.documentElement.dataset.theme = "dark";
    else document.documentElement.removeAttribute("data-theme");

    const accent = String(display.accent || "default"); // default | blue | yellow | pink | purple | orange | green
    const accents = {
      blue: { hex: "#1d9bf0", hover: "#1a8cd8" },
      yellow: { hex: "#ffd400", hover: "#f5c800" },
      pink: { hex: "#f91880", hover: "#e11672" },
      purple: { hex: "#7856ff", hover: "#6a4cf5" },
      orange: { hex: "#ff7a00", hover: "#f26f00" },
      green: { hex: "#00ba7c", hover: "#00a86f" },
    };

    if (accent !== "default" && accents[accent]) {
      document.documentElement.style.setProperty("--accent", accents[accent].hex);
      document.documentElement.style.setProperty("--accent-hover", accents[accent].hover);
    } else {
      document.documentElement.style.removeProperty("--accent");
      document.documentElement.style.removeProperty("--accent-hover");
    }

    const uiScaleRaw = Number(display.uiScale);
    const uiScale = Number.isFinite(uiScaleRaw) ? Math.max(0.9, Math.min(1.1, uiScaleRaw)) : 1;
    document.documentElement.style.setProperty("--ui-scale", String(uiScale));
  }, [account, prefersDark]);

  function updateAccount(patch) {
    setAccount((prev) => {
      const next = { ...prev, ...(patch || {}) };
      if (typeof next.username === "string") {
        const u = next.username.trim() || "user";
        next.username = u;
        next.handle = `@${u.replace(/^@/, "")}`;
      }
      saveAccount(next);
      return next;
    });
  }

  useEffect(() => {
    if (!useFirestore || !firebase?.db || !firebase?.auth) return undefined;
    let unsub = null;
    let cancelled = false;

    ensureSignedIn(firebase.auth)
      .then(() => {
        if (cancelled) return;
        unsub = listenToPosts(
          firebase.db,
          (remote) => {
            setPosts(
              remote.map((p) => {
                const r = getPostReaction(p.id);
                return { ...p, didShit: r.didShit, didLike: r.didLike };
              })
            );
          },
          () => {}
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [firebase, useFirestore]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const viralToday = useMemo(() => topPostForDay(posts, todayKey), [posts, todayKey]);
  const viralMonth = useMemo(() => viralOfMonth(posts, monthKey, 10, 50), [posts, monthKey]);

  useEffect(() => {
    // Notify only when #1 today changes.
    const leader = viralToday;
    if (!leader) return;

    const leaders = loadDailyLeader();
    const prevLeaderId = leaders[todayKey];
    if (prevLeaderId === leader.id) return;

    leaders[todayKey] = leader.id;
    saveDailyLeader(leaders);

    // Only notify the author of the post. In this prototype, current user is "U".
    const isCurrentUser = (leader.authorInitial || "U") === "U";
    if (!isCurrentUser) return;

    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        type: "leader",
        dateKey: todayKey,
        postId: leader.id,
        createdAt: new Date().toISOString(),
        title: "Your post is #1 today",
        body: "You’re the top post on Viral today (based on Shits + Comments).",
      },
      ...prev,
    ]);
  }, [posts, todayKey, viralToday]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const langFilter = Array.isArray(account?.feedLanguages) && account.feedLanguages.length > 0
      ? new Set(account.feedLanguages.map((l) => String(l).toLowerCase()))
      : null;

    return (posts || []).filter((p) => {
      const lang = String(p?.language || "English").toLowerCase();
      if (langFilter && !langFilter.has(lang)) return false;
      if (!q) return true;
      const hay = `${p?.title || ""}\n${p?.text || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [account?.feedLanguages, posts, query]);

  const canPost =
    composerTitle.trim().length > 0 &&
    composerTitle.length <= MAX_TITLE &&
    composerBody.length <= MAX_LEN;

  function submitPost(e) {
    e.preventDefault();
    if (!canPost) return;

    const newPost = {
      id: uid(),
      authorInitial: "U",
      authorName: account?.username ? account.username : "You",
      authorHandle: account?.handle ? account.handle : "@user",
      didShit: false,
      didLike: false,
      title: normalizeHashToShit(composerTitle.trim()),
      text: normalizeHashToShit(composerBody.trim()),
      language: String(composerLanguage || account?.languages?.[0] || "English"),
      createdAt: new Date().toISOString(),
      stats: { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    };

    if (useFirestore && firebase?.db) {
      createPost(firebase.db, newPost).catch(() => {});
    } else {
      setPosts((prev) => [newPost, ...prev]);
    }
    setComposerTitle("");
    setComposerBody("");
  }

  function ensureShit(postId) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.didShit) return p;
        const stats = p.stats || { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
        const nextStats = { ...stats, shit: (stats.shit || 0) + 1 };
        let nextDidLike = Boolean(p.didLike);

        if (nextDidLike) {
          nextDidLike = false;
          const likeWas = Number(nextStats.like || 0) || 0;
          nextStats.like = Math.max(0, likeWas - 1);
          if (useFirestore && firebase?.db && likeWas > 0) incPostStat(firebase.db, postId, "like", -1).catch(() => {});
        }

        if (useFirestore && firebase?.db) incPostStat(firebase.db, postId, "shit", 1).catch(() => {});
        setPostReaction(postId, { didShit: true, didLike: nextDidLike });
        return { ...p, didShit: true, didLike: nextDidLike, stats: nextStats };
      })
    );
  }

  function toggleShit(postId) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const stats = p.stats || { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
        let didShit = Boolean(p.didShit);
        let didLike = Boolean(p.didLike);
        const nextStats = { ...stats };

        if (didShit) {
          didShit = false;
          const shitWas = Number(nextStats.shit || 0) || 0;
          nextStats.shit = Math.max(0, shitWas - 1);
          if (useFirestore && firebase?.db && shitWas > 0) incPostStat(firebase.db, postId, "shit", -1).catch(() => {});
        } else {
          didShit = true;
          nextStats.shit = (nextStats.shit || 0) + 1;
          if (useFirestore && firebase?.db) incPostStat(firebase.db, postId, "shit", 1).catch(() => {});
          if (didLike) {
            didLike = false;
            const likeWas = Number(nextStats.like || 0) || 0;
            nextStats.like = Math.max(0, likeWas - 1);
            if (useFirestore && firebase?.db && likeWas > 0) incPostStat(firebase.db, postId, "like", -1).catch(() => {});
          }
        }

        setPostReaction(postId, { didShit, didLike });
        return { ...p, didShit, didLike, stats: nextStats };
      })
    );
  }

  function toggleLike(postId) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const stats = p.stats || { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
        let didShit = Boolean(p.didShit);
        let didLike = Boolean(p.didLike);
        const nextStats = { ...stats };

        if (didLike) {
          didLike = false;
          const likeWas = Number(nextStats.like || 0) || 0;
          nextStats.like = Math.max(0, likeWas - 1);
          if (useFirestore && firebase?.db && likeWas > 0) incPostStat(firebase.db, postId, "like", -1).catch(() => {});
        } else {
          didLike = true;
          nextStats.like = (nextStats.like || 0) + 1;
          if (useFirestore && firebase?.db) incPostStat(firebase.db, postId, "like", 1).catch(() => {});
          if (didShit) {
            didShit = false;
            const shitWas = Number(nextStats.shit || 0) || 0;
            nextStats.shit = Math.max(0, shitWas - 1);
            if (useFirestore && firebase?.db && shitWas > 0) incPostStat(firebase.db, postId, "shit", -1).catch(() => {});
          }
        }

        setPostReaction(postId, { didShit, didLike });
        return { ...p, didShit, didLike, stats: nextStats };
      })
    );
  }

  function bumpStat(postId, key) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const stats = p.stats || { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
        if (useFirestore && firebase?.db) incPostStat(firebase.db, postId, key, 1).catch(() => {});
        return { ...p, stats: { ...stats, [key]: (stats[key] || 0) + 1 } };
      })
    );
  }

  function wipeLocal() {
    clearPosts();
    setPosts(seedIfEmpty([]));
  }

  const ctxValue = useMemo(
    () => ({
      composerTitleRef,
      composerBodyRef,
      posts,
      filteredPosts,
      viralToday,
      viralMonth,
      monthKey,
      account,
      updateAccount,
      composerTitle,
      setComposerTitle,
      composerBody,
      setComposerBody,
      composerLanguage,
      setComposerLanguage,
      canPost,
      submitPost,
      query,
      setQuery,
      notifications,
      setNotifications,
      bumpStat,
      toggleShit,
      toggleLike,
      ensureShit,
      wipeLocal,
      useFirestore,
      firebaseDb: firebase?.db || null,
    }),
    [
      posts,
      filteredPosts,
      viralToday,
      viralMonth,
      monthKey,
      account,
      composerTitle,
      composerBody,
      composerLanguage,
      canPost,
      query,
      notifications,
      useFirestore,
      firebase?.db,
    ]
  );

  const topTags = useMemo(() => {
    const counts = new Map();
    for (const p of posts || []) {
      const tags = extractHashtags(`${p?.title || ""} ${p?.text || ""}`);
      for (const t of tags) {
        const key = String(t).toLowerCase();
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return sorted.map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/explore")) return "Explore";
    if (path.startsWith("/notifications")) return "Notifications";
    if (path.startsWith("/messages")) return "Messages";
    if (path.startsWith("/chat")) return "Chat";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/settings")) return "Settings";
    if (path.startsWith("/viral")) return "Viral";
    return "Home";
  }, [location.pathname]);

  return (
    <ShellContext.Provider value={ctxValue}>
      <GlobalStyles />
      <div className="app" data-page={pageTitle.toLowerCase()}>
        <aside className="nav" aria-label="Primary">
          <NavLink className="brand" to="/" aria-label="Home">
            <img className="brandLogoImg" src={brandLogo} alt="" aria-hidden="true" />
          </NavLink>

          <nav className="navItems" aria-label="Navigation">
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/" end>
              <Home size={26} />
              <span className="navText">Home</span>
            </NavLink>
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/explore">
              <Search size={26} />
              <span className="navText">Explore</span>
            </NavLink>
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/notifications">
              <Bell size={26} />
              <span className="navText">Notifications</span>
            </NavLink>
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/messages">
              <Mail size={26} />
              <span className="navText">Messages</span>
            </NavLink>
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/chat">
              <MessageCircle size={26} />
              <span className="navText">Chat</span>
            </NavLink>
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/profile">
              <User size={26} />
              <span className="navText">Profile</span>
            </NavLink>
            <NavLink className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`} to="/settings">
              <Settings size={26} />
              <span className="navText">Settings</span>
            </NavLink>
          </nav>

          <button className="primaryCta" type="button" onClick={() => composerTitleRef.current?.focus()}>
            <span>Post</span>
            <Plus className="mobileOnly" size={24} />
          </button>

          <div className="navFooter">
            <div className="pill" title="Prototype storage">
              Saved locally
            </div>
          </div>
        </aside>

        <main className="feed" aria-label={`${pageTitle} content`}>
          <Outlet />
        </main>

        <aside className="sidebar" aria-label="Sidebar">
          <div className="searchWrapper">
            <div className="searchField">
              <Search size={18} className="searchIcon" aria-hidden="true" />
              <input type="text" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          {viralMonth.length > 0 ? (
            <div className="widget">
              <h2 className="widgetHeader">Viral of the Month</h2>
              {viralMonth.map((p) => (
                <button
                  key={p.id}
                  className="widgetItem"
                  type="button"
                  onClick={() => setQuery(String(p.title || p.text || "").slice(0, 32))}
                  title="Search similar posts"
                >
                  <div className="widgetSubtitle">{monthKey} · Viral</div>
                  <div className="widgetTitle">
                    {String(p.title || p.text || "").replace(/\s+/g, " ").slice(0, 70)}
                  </div>
                  <div className="widgetMeta">
                    {(p?.stats?.shit || 0)} Shits · {(p?.stats?.shitcomment || 0)} Comments
                  </div>
                </button>
              ))}
              <NavLink className="widgetMore" to="/viral">
                View Viral of Month
              </NavLink>
            </div>
          ) : null}

          <div className="widget">
            <h2 className="widgetHeader">What's happening</h2>
            {topTags.length === 0 ? (
              <button className="widgetItem" type="button" disabled>
                <div className="widgetSubtitle">No trends yet</div>
                <div className="widgetTitle">Post with #hashtags</div>
                <div className="widgetMeta">We’ll show the most used ones here.</div>
              </button>
            ) : (
              topTags.map((t) => (
                <button
                  key={t.tag}
                  className="widgetItem"
                  type="button"
                  onClick={() => setQuery(t.tag)}
                  title={`Search: ${t.tag}`}
                >
                  <div className="widgetSubtitle">Trending</div>
                  <div className="widgetTitle">💩{t.tag}</div>
                  <div className="widgetMeta">{t.count} posts</div>
                </button>
              ))
            )}
            <button className="widgetMore" type="button">
              Show more
            </button>
          </div>

          <div className="widget">
            <h2 className="widgetHeader">Who to follow</h2>
            <div className="followItem">
              <button className="followMeta" type="button">
                <div className="widgetTitle">Maulik Darji</div>
                <div className="widgetSubtitle">@maulik</div>
              </button>
              <button className="followBtn" type="button">
                Follow
              </button>
            </div>
            <div className="followItem">
              <button className="followMeta" type="button">
                <div className="widgetTitle">TextPulse</div>
                <div className="widgetSubtitle">@textpulse</div>
              </button>
              <button className="followBtn" type="button">
                Follow
              </button>
            </div>
            <button className="widgetMore" type="button">
              Show more
            </button>
          </div>

          <div className="widget">
            <h2 className="widgetHeader">Local data</h2>
            <div className="widgetBody">
              <button className="dangerBtn" type="button" onClick={wipeLocal}>
                Delete all local posts
              </button>
              <div className="finePrint">Prototype only. Posts are saved in your browser.</div>
            </div>
          </div>
        </aside>

        <nav className="mobileNav" aria-label="Mobile navigation">
          <NavLink className="mobileNavItem" to="/" end aria-label="Home">
            <Home size={26} />
          </NavLink>
          <NavLink className="mobileNavItem" to="/explore" aria-label="Explore">
            <Search size={26} />
          </NavLink>
          <NavLink className="mobileNavItem" to="/notifications" aria-label="Notifications">
            <Bell size={26} />
          </NavLink>
          <NavLink className="mobileNavItem" to="/messages" aria-label="Messages">
            <Mail size={26} />
          </NavLink>
        </nav>
      </div>
    </ShellContext.Provider>
  );
}
