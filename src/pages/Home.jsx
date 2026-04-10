import React, { useContext, useState } from "react";
import Composer from "../components/Composer";
import Post from "../components/Post";
import { ShellContext } from "../layouts/Shell";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("for-you");
  const {
    composerRef,
    filteredPosts,
    composerText,
    setComposerText,
    canPost,
    submitPost,
    bumpStat,
    toggleShit,
    ensureShit,
  } = useContext(ShellContext);

  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Home</div>
        <div className="feedTabs" aria-label="Feed tabs">
          <button
            className={`feedTab ${activeTab === "for-you" ? "feedTab--active" : ""}`}
            type="button"
            onClick={() => setActiveTab("for-you")}
          >
            For you
          </button>
          <button
            className={`feedTab ${activeTab === "following" ? "feedTab--active" : ""}`}
            type="button"
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>
      </header>

      <Composer
        composerRef={composerRef}
        value={composerText}
        onChange={setComposerText}
        onSubmit={submitPost}
        canPost={canPost}
      />

      <div className="timeline">
        {filteredPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onAction={bumpStat}
            onToggleShit={toggleShit}
            onEnsureShit={ensureShit}
          />
        ))}
      </div>
    </>
  );
}
