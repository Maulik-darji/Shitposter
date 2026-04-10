import React from "react";

export default function WidgetItem({ subtitle, title, meta }) {
  return (
    <button className="widgetItem" type="button">
      <div className="widgetSubtitle">{subtitle}</div>
      <div className="widgetTitle">{title}</div>
      <div className="widgetMeta">{meta}</div>
    </button>
  );
}

