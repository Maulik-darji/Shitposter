import React, { useContext, useState } from "react";
import Composer from "../components/Composer";
import Post from "../components/Post";
import { ShellContext } from "../layouts/Shell";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("for-you");
  const {
    composerTitleRef,
    composerBodyRef,
    filteredPosts,
    composerTitle,
    setComposerTitle,
    composerBody,
    setComposerBody,
    composerLanguage,
    setComposerLanguage,
    account,
    canPost,
    submitPost,
    bumpStat,
    toggleShit,
    toggleLike,
    ensureShit,
  } = useContext(ShellContext);

  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Get your Hands Dirty</div>
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
        composerTitleRef={composerTitleRef}
        composerBodyRef={composerBodyRef}
        title={composerTitle}
        body={composerBody}
        onTitleChange={setComposerTitle}
        onBodyChange={setComposerBody}
        language={composerLanguage}
        languages={account?.languages || ["English"]}
        onLanguageChange={setComposerLanguage}
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
            onToggleLike={toggleLike}
            onEnsureShit={ensureShit}
          />
        ))}
      </div>
    </>
  );
}
