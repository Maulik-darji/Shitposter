import React from "react";
import filled from "./Logo/shit_only_logo_black.png";

export default function ShitSymbol({ size = 16, className }) {
  return (
    <img
      src={filled}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

