import React, { useContext, useMemo } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { MoreHorizontal, Search, Settings } from "lucide-react";
import { ShellContext } from "../layouts/Shell";
import { extractHashtags, SHIT_TAG_MARK } from "../lib/hashtags";
import { formatRelativeTime } from "../lib/utils";

const TABS = [
  { key: "for-you", label: "For You" },
  { key: "trending", label: "Trending" },
  { key: "news", label: "News" },
  { key: "sports", label: "Sports" },
  { key: "entertainment", label: "Entertainment" },
];

const CATEGORY = {
  news: {
    label: "News",
    tags: ["news", "world", "politics", "tech", "business"],
    keywords: ["news", "breaking", "election", "minister", "ceasefire", "stocks", "market"],
  },
  sports: {
    label: "Sports",
    tags: ["sports", "cricket", "football", "soccer", "nba", "ipl"],
    keywords: ["match", "score", "goal", "league", "final", "tournament", "cricket", "football"],
  },
  entertainment: {
    label: "Entertainment",
    tags: ["entertainment", "movies", "music", "bollywood", "hollywood", "tv"],
    keywords: ["movie", "film", "song", "music", "actor", "actress", "trailer", "episode"],
  },
};

function cleanHeadline(post) {
  const raw = String(post?.title || post?.text || "");
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const withoutTags = t
    .replaceAll(SHIT_TAG_MARK, "#")
    .replace(/(^|\s)#[A-Za-z0-9_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return withoutTags || t;
}

function getTopTags(posts, limit = 10) {
  const counts = new Map();
  for (const p of posts || []) {
    const tags = extractHashtags(`${p?.title || ""} ${p?.text || ""}`);
    for (const t of tags) {
      const key = String(t).toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

function matchesCategory(post, catKey) {
  const cfg = CATEGORY[catKey];
  if (!cfg) return false;
  const text = `${post?.title || ""} ${post?.text || ""}`;
  const lower = text.toLowerCase();
  const tags = extractHashtags(text).map((t) => String(t).toLowerCase());
  if (tags.some((t) => cfg.tags.includes(t))) return true;
  return cfg.keywords.some((k) => lower.includes(k));
}

function ExploreStoryItem({ title, meta, onClick }) {
  return (
    <button className="exploreStory" type="button" onClick={onClick}>
      <div className="exploreStoryTitle">{title}</div>
      <div className="exploreStoryMeta">{meta}</div>
    </button>
  );
}

function ExploreTrendItem({ rank, tag, count, onPick }) {
  return (
    <button className="exploreTrend" type="button" onClick={onPick}>
      <div className="exploreTrendLeft">
        <div className="exploreTrendMeta">
          {rank} · Trending
        </div>
        <div className="exploreTrendTag">💩{tag}</div>
        <div className="exploreTrendCount">{count} posts</div>
      </div>
      <MoreHorizontal className="exploreTrendMore" size={18} aria-hidden="true" />
    </button>
  );
}

export default function ExplorePage() {
  const { posts, query, setQuery } = useContext(ShellContext);
  const [params, setParams] = useSearchParams();

  const activeTab = useMemo(() => {
    const t = String(params.get("tab") || "for-you");
    return TABS.some((x) => x.key === t) ? t : "for-you";
  }, [params]);

  const topTags = useMemo(() => getTopTags(posts, 12), [posts]);

  const categoryPosts = useMemo(() => {
    const byCat = { news: [], sports: [], entertainment: [] };
    for (const p of posts || []) {
      if (matchesCategory(p, "news")) byCat.news.push(p);
      if (matchesCategory(p, "sports")) byCat.sports.push(p);
      if (matchesCategory(p, "entertainment")) byCat.entertainment.push(p);
    }
    for (const k of Object.keys(byCat)) {
      byCat[k].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return byCat;
  }, [posts]);

  const forYouStories = useMemo(() => categoryPosts.news.slice(0, 5), [categoryPosts.news]);

  const heroTag = useMemo(() => topTags[0]?.tag || "welcome", [topTags]);

  function setTab(key) {
    const next = new URLSearchParams(params);
    next.set("tab", key);
    setParams(next, { replace: true });
  }

  const isCategoryTab = activeTab === "news" || activeTab === "sports" || activeTab === "entertainment";
  const activeCategoryLabel = isCategoryTab ? CATEGORY[activeTab]?.label : null;
  const activeCategoryPosts = isCategoryTab ? categoryPosts[activeTab] : [];

  return (
    <>
      <header className="exploreHeader">
        <div className="exploreSearchRow">
          <div className="searchField exploreSearchField" role="search">
            <Search size={18} className="searchIcon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search posts"
            />
          </div>
          <NavLink className="exploreGear" to="/settings" aria-label="Settings">
            <Settings size={20} aria-hidden="true" />
          </NavLink>
        </div>

        <div className="exploreTabs" aria-label="Explore tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`exploreTab ${activeTab === t.key ? "exploreTab--active" : ""}`}
              type="button"
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="exploreBody">
        {activeTab === "for-you" ? (
          <>
            <section className="exploreHero exploreHero--forYou" aria-label="Featured">
              <div className="exploreHeroShade" />
              <div className="exploreHeroInner">
                <div className="exploreHeroKicker">For you</div>
                <div className="exploreHeroTitle">💩{heroTag}</div>
                <div className="exploreHeroSub">What people are shitting about</div>
              </div>
            </section>

            <div className="exploreSectionHeader">Today&apos;s News</div>
            <div className="exploreList" role="list">
              {forYouStories.length === 0 ? (
                <div className="exploreEmpty">
                  Post with <span className="exploreInlineTag">#news</span> (it becomes 💩news) to show stories here.
                </div>
              ) : (
                forYouStories.map((p) => (
                  <ExploreStoryItem
                    key={p.id}
                    title={cleanHeadline(p).slice(0, 140)}
                    meta={`${formatRelativeTime(p.createdAt)} · News`}
                    onClick={() => setQuery(cleanHeadline(p).slice(0, 40))}
                  />
                ))
              )}
            </div>
          </>
        ) : null}

        {activeTab === "trending" ? (
          <>
            <section className="exploreHero exploreHero--trending" aria-label="Global Trending">
              <div className="exploreHeroInner">
                <div className="exploreHeroKicker">Global Trending</div>
                <div className="exploreHeroSub">The most used 💩tags across Shitposter.</div>
                <button className="exploreHeroBtn" type="button" onClick={() => setTab("for-you")}>
                  Explore
                </button>
              </div>
            </section>

            <div className="exploreList" role="list" aria-label="Trending list">
              {topTags.length === 0 ? (
                <div className="exploreEmpty">
                  No trends yet. Start a post with <span className="exploreInlineTag">#tag</span> (💩tag).
                </div>
              ) : (
                topTags.slice(0, 10).map((t, idx) => (
                  <ExploreTrendItem
                    key={t.tag}
                    rank={idx + 1}
                    tag={t.tag}
                    count={t.count}
                    onPick={() => setQuery(t.tag)}
                  />
                ))
              )}
            </div>
          </>
        ) : null}

        {isCategoryTab ? (
          <>
            <div className="exploreSectionHeader">{activeCategoryLabel}</div>
            <div className="exploreList" role="list" aria-label={`${activeCategoryLabel} posts`}>
              {activeCategoryPosts.length === 0 ? (
                <div className="exploreEmpty">
                  No {activeCategoryLabel.toLowerCase()} posts yet. Use{" "}
                  <span className="exploreInlineTag">#{activeTab}</span> in a post to show it here.
                </div>
              ) : (
                activeCategoryPosts.slice(0, 18).map((p) => (
                  <ExploreStoryItem
                    key={p.id}
                    title={cleanHeadline(p).slice(0, 160)}
                    meta={`${formatRelativeTime(p.createdAt)} · ${activeCategoryLabel}`}
                    onClick={() => setQuery(cleanHeadline(p).slice(0, 40))}
                  />
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
