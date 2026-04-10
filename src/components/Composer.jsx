import React, { useLayoutEffect } from "react";
import { SHIT_TAG_MARK } from "../lib/hashtags";

const MAX_LEN = 700;

export default function Composer({ composerRef, value, onChange, onSubmit, canPost }) {
  function autosize() {
    const el = composerRef?.current;
    if (!el) return;
    // Reset first so scrollHeight is accurate when shrinking.
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useLayoutEffect(() => {
    autosize();
  }, [value]);

  return (
    <section className="composer" aria-label="Create post">
      <div className="avatar">U</div>
      <form className="composerMain" onSubmit={onSubmit}>
        <textarea
          ref={composerRef}
          placeholder="What is happening?!"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "#") return;
            const el = composerRef?.current;
            if (!el) return;
            e.preventDefault();
            const start = el.selectionStart ?? value.length;
            const end = el.selectionEnd ?? value.length;
            const next = `${value.slice(0, start)}${SHIT_TAG_MARK}${value.slice(end)}`;
            onChange(next);
            requestAnimationFrame(() => {
              el.focus();
              const pos = start + SHIT_TAG_MARK.length;
              el.setSelectionRange(pos, pos);
            });
          }}
          maxLength={MAX_LEN}
        />
        <div className="composerBottom">
          <div className="composerMeta" aria-live="polite">
            {value.length}/{MAX_LEN}
          </div>
          <button className="postBtn" type="submit" disabled={!canPost}>
            Post
          </button>
        </div>
      </form>
    </section>
  );
}
