import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Repeat, Share } from "lucide-react";
import { formatRelativeTime, postTintFromId } from "../lib/utils";
import shitOnlyLogo from "./Logo/shit_only_logo_black.png";
import shitOnlyLogoOutline from "./Logo/shit_only_logo_outline_white.png";
import ShitSymbol from "./ShitSymbol";
import { tokenizeHashtags } from "../lib/hashtags";

export default function Post({ post, onAction, onToggleShit, onEnsureShit, variant }) {
  const tint = useMemo(() => postTintFromId(post?.id, 0.1), [post?.id]);
  const [burstVisible, setBurstVisible] = useState(false);
  const lastTapMsRef = useRef(0);
  const burstTimerRef = useRef(null);

  const authorInitial = post?.authorInitial || "U";
  const didShit = Boolean(post?.didShit);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  function showBurst() {
    setBurstVisible(true);
    if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
    burstTimerRef.current = window.setTimeout(() => setBurstVisible(false), 650);
  }

  function ensureShitBurst() {
    onEnsureShit(post.id);
    showBurst();
  }

  function isFromActionButton(target) {
    return Boolean(target?.closest?.("button.action"));
  }

  function handleDoubleClick(e) {
    if (isFromActionButton(e.target)) return;
    ensureShitBurst();
  }

  function handlePointerDown(e) {
    // Mobile double-tap (React onDoubleClick is inconsistent on touch browsers)
    if (e.pointerType !== "touch") return;
    if (isFromActionButton(e.target)) return;
    const now = Date.now();
    if (now - lastTapMsRef.current < 280) {
      lastTapMsRef.current = 0;
      ensureShitBurst();
      return;
    }
    lastTapMsRef.current = now;
  }

  return (
    <article
      className={`post ${variant ? `post--${variant}` : ""}`}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      style={{
        "--postTintBg": tint.bg,
        "--postTintBorder": tint.border,
      }}
    >
      {burstVisible ? (
        <div className="postBurst" aria-hidden="true">
          <img className="postBurstIcon" src={shitOnlyLogo} alt="" aria-hidden="true" draggable="false" />
        </div>
      ) : null}

      <div className="avatar">{authorInitial}</div>
      <div className="postContent">
        <div className="postHeader">
          <span className="postName">{post?.authorName || "User"}</span>
          <span className="postHandle">{post?.authorHandle || "@user"}</span>
          <span className="postTime">· {formatRelativeTime(post.createdAt)}</span>
        </div>

        <div className="postText">
          {tokenizeHashtags(post.text).map((tok, idx) => {
            if (tok.type === "tag") {
              return (
                <span key={`t_${idx}`} className="shitTag" title={`Shit${tok.value}`}>
                  <ShitSymbol size={14} className="shitTagIcon" />
                  <span className="shitTagText">{tok.value}</span>
                </span>
              );
            }
            return <React.Fragment key={`x_${idx}`}>{tok.value}</React.Fragment>;
          })}
        </div>

        <div className="postActions" aria-label="Post actions">
          <button
            className={`action action--shit ${didShit ? "isActive" : ""}`}
            type="button"
            onClick={() => onToggleShit(post.id)}
            aria-label="Shit"
            title="Shit"
            data-tip="Shit"
            aria-pressed={didShit}
          >
            <img
              className="shitIcon"
              src={didShit ? shitOnlyLogo : shitOnlyLogoOutline}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          </button>

          <button
            className="action action--comment"
            type="button"
            onClick={() => onAction(post.id, "shitcomment")}
            aria-label="Shitcomment"
            title="Shitcomment"
            data-tip="Shitcomment"
          >
            <MessageCircle size={18} />
          </button>

          <button
            className="action action--repost"
            type="button"
            onClick={() => onAction(post.id, "repostshit")}
            aria-label="Repost shit"
            title="Repost shit"
            data-tip="Repost shit"
          >
            <Repeat size={18} />
          </button>

          <button
            className="action action--share"
            type="button"
            onClick={() => onAction(post.id, "shareshit")}
            aria-label="Share shit"
            title="Share shit"
            data-tip="Share shit"
          >
            <Share size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
