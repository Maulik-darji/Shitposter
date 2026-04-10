import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Home, Mail, MessageCircle, Plus, Search, Settings, User } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import brandLogo from "../components/Logo/shit_poster_logo.png";
import { clearPosts, loadPosts, savePosts, seedIfEmpty } from "../lib/postsStorage";
import { uid } from "../lib/utils";
import { localDateKey } from "../lib/dates";
import { topPostForDay, topPostOverall } from "../lib/ranking";
import { extractHashtags, normalizeHashToShit } from "../lib/hashtags";
import { getFirebase, isFirebaseConfigured, ensureSignedIn } from "../firebase/client";
import { createPost, incPostStat, listenToPosts } from "../firebase/posts";
import {
  loadDailyLeader,
  loadNotifications,
  saveDailyLeader,
  saveNotifications,
} from "../lib/notificationsStorage";

export const ShellContext = React.createContext(null);

const MAX_LEN = 700;

export default function Shell() {
  const location = useLocation();
  const composerRef = useRef(null);
  const useFirestore = useMemo(() => isFirebaseConfigured(), []);
  const firebase = useMemo(() => (useFirestore ? getFirebase() : null), [useFirestore]);

  const [posts, setPosts] = useState(() => (useFirestore ? [] : seedIfEmpty(loadPosts())));
  const [composerText, setComposerText] = useState("");
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(() => loadNotifications());

  const todayKey = useMemo(() => localDateKey(new Date()), []);

  useEffect(() => {
    if (!useFirestore) savePosts(posts);
  }, [posts, useFirestore]);

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
            setPosts(remote);
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
  const viralOverall = useMemo(() => topPostOverall(posts), [posts]);
  const viralPost = viralToday || viralOverall;

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
    if (!q) return posts;
    return posts.filter((p) => String(p.text || "").toLowerCase().includes(q));
  }, [posts, query]);

  const canPost = composerText.trim().length > 0 && composerText.length <= MAX_LEN;

  function submitPost(e) {
    e.preventDefault();
    if (!canPost) return;

    const newPost = {
      id: uid(),
      authorInitial: "U",
      authorName: "You",
      authorHandle: "@user",
      didShit: false,
      text: normalizeHashToShit(composerText.trim()),
      createdAt: new Date().toISOString(),
      stats: { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    };

    if (useFirestore && firebase?.db) {
      createPost(firebase.db, newPost).catch(() => {});
    } else {
      setPosts((prev) => [newPost, ...prev]);
    }
    setComposerText("");
  }

  function ensureShit(postId) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.didShit) return p;
        const stats = p.stats || { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
        if (useFirestore && firebase?.db) incPostStat(firebase.db, postId, "shit", 1).catch(() => {});
        return { ...p, didShit: true, stats: { ...stats, shit: (stats.shit || 0) + 1 } };
      })
    );
  }

  function toggleShit(postId) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const stats = p.stats || { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
        const nextDidShit = !p.didShit;
        const delta = nextDidShit ? 1 : -1;
        const nextShit = Math.max(0, (stats.shit || 0) + delta);
        if (useFirestore && firebase?.db) incPostStat(firebase.db, postId, "shit", delta).catch(() => {});
        return { ...p, didShit: nextDidShit, stats: { ...stats, shit: nextShit } };
      })
    );
  }

  function bumpStat(postId, key) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const stats = p.stats || { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 };
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
      composerRef,
      posts,
      filteredPosts,
      viralPost,
      viralToday,
      composerText,
      setComposerText,
      canPost,
      submitPost,
      query,
      setQuery,
      notifications,
      setNotifications,
      bumpStat,
      toggleShit,
      ensureShit,
      wipeLocal,
    }),
    [posts, filteredPosts, viralPost, viralToday, composerText, canPost, query, notifications]
  );

  const topTags = useMemo(() => {
    const counts = new Map();
    for (const p of posts || []) {
      const tags = extractHashtags(p?.text);
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
    return "Home";
  }, [location.pathname]);

  return (
    <ShellContext.Provider value={ctxValue}>
      <GlobalStyles />
      <div className="app">
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

          <button className="primaryCta" type="button" onClick={() => composerRef.current?.focus()}>
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

          {viralPost ? (
            <div className="widget">
              <h2 className="widgetHeader">Viral</h2>
              <div className="widgetBody">
                <div className="viralMini">
                  <div className="viralMiniTitle">{viralToday ? "#1 today" : "Top post"}</div>
                  <div className="viralMiniText">{String(viralPost.text || "").slice(0, 90)}</div>
                </div>
                <NavLink className="widgetMore" to="/viral">
                  View Viral
                </NavLink>
              </div>
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
