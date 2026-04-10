import React from "react";

export default function MessagesPage() {
  return (
    <>
      <header className="feedHeader">
        <div className="feedTitle">Messages</div>
      </header>
      <div className="emptyState">
        <div className="emptyTitle">Empty inbox</div>
        <div className="emptySub">Start a conversation.</div>
        <button className="postBtn" type="button">
          New message
        </button>
      </div>
    </>
  );
}

