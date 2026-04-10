import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Repeat, Share, ThumbsDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime, postTintFromId } from "../lib/utils";
import shitOnlyLogo from "./Logo/shit_only_logo_black.png";
import shitOnlyLogoOutline from "./Logo/shit_only_logo_outline_white.png";
import ShitSymbol from "./ShitSymbol";
import { tokenizeHashtags } from "../lib/hashtags";

export default function Post({
  post,
  onAction,
  onToggleShit,
  onToggleLike,
  onEnsureShit,
  variant,
  disableNavigate,
}) {
  const navigate = useNavigate();
  const tint = useMemo(() => postTintFromId(post?.id, 0.06), [post?.id]);
  const [burstVisible, setBurstVisible] = useState(false);
  const lastTapMsRef = useRef(0);
  const burstTimerRef = useRef(null);
  const navTimerRef = useRef(null);
  const suppressNavUntilRef = useRef(0);

  const authorInitial = post?.authorInitial || "U";
  const didShit = Boolean(post?.didShit);
  const didLike = Boolean(post?.didLike);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
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

  function cancelPendingNav() {
    if (!navTimerRef.current) return;
    window.clearTimeout(navTimerRef.current);
    navTimerRef.current = null;
  }

  function handleDoubleClick(e) {
    if (isFromActionButton(e.target)) return;
    cancelPendingNav();
    ensureShitBurst();
  }

  function handlePointerDown(e) {
    // Mobile double-tap (React onDoubleClick is inconsistent on touch browsers)
    if (e.pointerType !== "touch") return;
    if (isFromActionButton(e.target)) return;
    const now = Date.now();
    if (now - lastTapMsRef.current < 280) {
      lastTapMsRef.current = 0;
      cancelPendingNav();
      suppressNavUntilRef.current = Date.now() + 360;
      ensureShitBurst();
      return;
    }
    lastTapMsRef.current = now;
  }

  function handleClick(e) {
    if (disableNavigate) return;
    if (isFromActionButton(e.target)) return;
    if (Date.now() < suppressNavUntilRef.current) return;
    cancelPendingNav();
    // Delay navigation slightly so a double-click can be interpreted as "Shit".
    navTimerRef.current = window.setTimeout(() => {
      navTimerRef.current = null;
      navigate(`/post/${post.id}`);
    }, 240);
  }

  function renderWithTags(text, kind) {
    const tokens = tokenizeHashtags(text || "");
    return tokens.map((tok, idx) => {
      if (tok.type === "tag") {
        return (
          <span key={`${kind}_t_${idx}`} className="shitTag" title={`Shit${tok.value}`}>
            <ShitSymbol size={14} className="shitTagIcon" />
            <span className="shitTagText">{tok.value}</span>
          </span>
        );
      }
      return <React.Fragment key={`${kind}_x_${idx}`}>{tok.value}</React.Fragment>;
    });
  }

  return (
    <article
      className={`post ${variant ? `post--${variant}` : ""} ${disableNavigate ? "post--static" : ""}`}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
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

        <div className="postTitle">{renderWithTags(post?.title || "Untitled", "title")}</div>
        {String(post?.text || "").trim().length ? (
          <div className="postText">{renderWithTags(post.text, "body")}</div>
        ) : null}

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
              className={`shitIcon ${didShit ? "shitIcon--filled" : "shitIcon--outline"}`}
              src={didShit ? shitOnlyLogo : shitOnlyLogoOutline}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          </button>

          <button
            className={`action action--like ${didLike ? "isActive" : ""}`}
            type="button"
            onClick={() => onToggleLike?.(post.id)}
            aria-label="Like (bad)"
            title="Like"
            data-tip="Like"
            aria-pressed={didLike}
          >
            <ThumbsDown size={18} />
          </button>

          <button
            className="action action--comment"
            type="button"
            onClick={() => {
              cancelPendingNav();
              navigate(`/post/${post.id}`);
            }}
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
