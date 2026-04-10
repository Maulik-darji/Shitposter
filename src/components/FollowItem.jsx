import React from "react";

export default function FollowItem({ name, handle }) {
  return (
    <div className="followItem">
      <button className="followMeta" type="button">
        <div className="widgetTitle">{name}</div>
        <div className="widgetSubtitle">{handle}</div>
      </button>
      <button className="followBtn" type="button">
        Follow
      </button>
    </div>
  );
}

