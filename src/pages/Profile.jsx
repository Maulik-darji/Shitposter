import React, { useContext, useState } from "react";
import { ShellContext } from "../layouts/Shell";
import Post from "../components/Post";

export default function ProfilePage() {
  const { posts, bumpStat, toggleShit, toggleLike, ensureShit } = useContext(ShellContext);
  const [tab, setTab] = useState("posts");

  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Profile</div>
      </header>

      <div className="profileHeader">
        <div className="profileBanner" />
        <div className="profileInfo">
          <div className="profileAvatar">U</div>
          <div className="profileNameRow">
            <div className="profileName">You</div>
            <button className="ghostBtn" type="button">
              Edit profile
            </button>
          </div>
          <div className="profileHandle">@user</div>
          <div className="profileMeta">Joined • Prototype</div>
        </div>
      </div>

      <div className="profileTabs" role="tablist" aria-label="Profile sections">
        <button
          className={`profileTab ${tab === "posts" ? "profileTab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={tab === "posts"}
          onClick={() => setTab("posts")}
          title="Posts"
        >
          Posts
        </button>
        <button
          className={`profileTab ${tab === "spills" ? "profileTab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={tab === "spills"}
          onClick={() => setTab("spills")}
          title="Replies"
        >
          Spills
        </button>
        <button
          className={`profileTab ${tab === "aura" ? "profileTab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={tab === "aura"}
          onClick={() => setTab("aura")}
          title="Highlights"
        >
          Aura
        </button>
        <button
          className={`profileTab ${tab === "thesis" ? "profileTab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={tab === "thesis"}
          onClick={() => setTab("thesis")}
          title="Articles"
        >
          Thesis
        </button>
        <button
          className={`profileTab ${tab === "pixels" ? "profileTab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={tab === "pixels"}
          onClick={() => setTab("pixels")}
          title="Media"
        >
          Pixels
        </button>
        <button
          className={`profileTab ${tab === "shit" ? "profileTab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={tab === "shit"}
          onClick={() => setTab("shit")}
          title="Likes"
        >
          Shit
        </button>
      </div>

      {tab === "posts" ? (
        <div className="timeline" role="tabpanel" aria-label="Posts">
          {posts.map((post) => (
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
      ) : (
        <div className="emptyState" role="tabpanel" aria-label="Empty section">
          <div className="emptyTitle">Nothing here yet</div>
          <div className="emptySub">This is a UI prototype tab.</div>
        </div>
      )}
    </>
  );
}
