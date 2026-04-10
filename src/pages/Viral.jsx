import React, { useContext, useMemo } from "react";
import Post from "../components/Post";
import { ShellContext } from "../layouts/Shell";
import { localDateKey } from "../lib/dates";
import { topPostsForDay } from "../lib/ranking";

export default function ViralPage() {
  const { posts, viralToday, bumpStat, toggleShit, ensureShit } = useContext(ShellContext);
  const todayKey = useMemo(() => localDateKey(new Date()), []);
  const list = useMemo(() => topPostsForDay(posts, todayKey, 10), [posts, todayKey]);

  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Viral</div>
      </header>

      {viralToday ? (
        <div className="viralHeader" aria-label="Viral header">
          <div className="viralTitle">#1 today</div>
          <div className="viralMeta">{todayKey}</div>
        </div>
      ) : (
        <div className="emptyState">
          <div className="emptyTitle">No viral posts yet</div>
          <div className="emptySub">Get some Shits + Comments on a post to rank.</div>
        </div>
      )}

      <div className="timeline">
        {list.map((p, idx) => (
          <Post
            key={p.id}
            post={p}
            onAction={bumpStat}
            onToggleShit={toggleShit}
            onEnsureShit={ensureShit}
            variant={idx === 0 ? "viral" : undefined}
          />
        ))}
      </div>
    </>
  );
}

