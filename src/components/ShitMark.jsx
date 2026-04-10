import React from "react";
import logo from "./Logo/shit_poster_logo.png";

export default function ShitMark({ size = 20, className }) {
  return (
    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className={className}
      draggable="false"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
