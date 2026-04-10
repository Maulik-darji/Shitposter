import React from "react";

export function WidgetItem({ subtitle, title, meta }) {
  return (
    <div className="widgetItem">
      <div className="widgetSubtitle">{subtitle}</div>
      <div className="widgetTitle">{title}</div>
      <div className="widgetMeta">{meta}</div>
    </div>
  );
}

export function FollowItem({ name, handle }) {
  return (
    <div className="widgetItem" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div className="widgetTitle">{name}</div>
        <div className="widgetSubtitle">{handle}</div>
      </div>
      <button className="postBtn" style={{ background: "white", color: "black", padding: "6px 16px" }}>
        Follow
      </button>
    </div>
  );
}
