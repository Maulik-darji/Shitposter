import React from "react";

export default function NavItem({ icon, text, active = false, disabled = false }) {
  return (
    <button
      className={`navItem ${active ? "navItem--active" : ""}`}
      type="button"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="navText">{text}</span>
    </button>
  );
}

