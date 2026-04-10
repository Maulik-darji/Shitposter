import React, { useContext, useMemo, useState } from "react";
import { ShellContext } from "../layouts/Shell";

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const { notifications, posts } = useContext(ShellContext);

  const items = useMemo(() => {
    if (tab === "mentions") return [];
    return notifications || [];
  }, [notifications, tab]);

  function findPost(postId) {
    return (posts || []).find((p) => p.id === postId) || null;
  }
  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Notifications</div>
        <div className="feedTabs" aria-label="Notification tabs">
          <button className={`feedTab ${tab === "all" ? "feedTab--active" : ""}`} type="button" onClick={() => setTab("all")}>
            All
          </button>
          <button
            className={`feedTab ${tab === "mentions" ? "feedTab--active" : ""}`}
            type="button"
            onClick={() => setTab("mentions")}
          >
            Mentions
          </button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="emptyState">
          <div className="emptyTitle">You're all caught up</div>
          <div className="emptySub">No new notifications.</div>
        </div>
      ) : (
        <div className="notifList" aria-label="Notifications list">
          {items.map((n) => {
            const p = n.postId ? findPost(n.postId) : null;
            return (
              <div key={n.id} className="notifItem">
                <div className="notifTitle">{n.title}</div>
                <div className="notifBody">{n.body}</div>
                {p ? <div className="notifPostPreview">“{String(p.text || "").slice(0, 90)}”</div> : null}
                <div className="notifMeta">{n.dateKey}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
