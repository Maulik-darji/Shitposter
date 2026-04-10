import React from "react";

export default function ChatPage() {
  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Chat</div>
      </header>
      <div className="emptyState">
        <div className="emptyTitle">Start Conversation</div>
        <div className="emptySub">Choose from your existing conversations, or start a new one.</div>
        <button className="postBtn" type="button">
          New chat
        </button>
      </div>
    </>
  );
}

