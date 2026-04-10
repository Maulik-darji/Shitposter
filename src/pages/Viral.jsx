import React, { useContext, useMemo } from "react";
import Post from "../components/Post";
import { ShellContext } from "../layouts/Shell";
import { localDateKey } from "../lib/dates";
import { topPostsForDay } from "../lib/ranking";

export default function ViralPage() {
  const { posts, viralToday, viralMonth, monthKey, bumpStat, toggleShit, toggleLike, ensureShit } =
    useContext(ShellContext);
  const todayKey = useMemo(() => localDateKey(new Date()), []);
  const list = useMemo(() => topPostsForDay(posts, todayKey, 10), [posts, todayKey]);

  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Viral of the Month</div>
      </header>

      {viralMonth?.length ? (
        <div className="viralHeader" aria-label="Viral of the month header">
          <div className="viralTitle">{monthKey}</div>
          <div className="viralMeta">Random top 10 (high Shits + Comments)</div>
        </div>
      ) : null}

      <div className="timeline">
        {(viralMonth || []).map((p, idx) => (
          <Post
            key={p.id}
            post={p}
            onAction={bumpStat}
            onToggleShit={toggleShit}
            onToggleLike={toggleLike}
            onEnsureShit={ensureShit}
            variant={idx === 0 ? "viral" : undefined}
          />
        ))}
      </div>

      {viralToday ? (
        <>
          <div className="viralHeader" aria-label="Viral today header">
            <div className="viralTitle">#1 today</div>
            <div className="viralMeta">{todayKey}</div>
          </div>
          <div className="timeline">
            {list.map((p, idx) => (
              <Post
                key={`t_${p.id}`}
                post={p}
                onAction={bumpStat}
                onToggleShit={toggleShit}
                onToggleLike={toggleLike}
                onEnsureShit={ensureShit}
                variant={idx === 0 ? "viral" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}

      {!viralToday && !(viralMonth || []).length ? (
        <div className="emptyState">
          <div className="emptyTitle">No viral posts yet</div>
          <div className="emptySub">Get some Shits + Comments on a post to rank.</div>
        </div>
      ) : null}
    </>
  );
}
