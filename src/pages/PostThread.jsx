import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, ThumbsDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";
import { ShellContext } from "../layouts/Shell";
import { uid } from "../lib/utils";
import { addComment as addCommentLocal, loadComments, saveComments } from "../lib/commentsStorage";
import { listenToComments, createComment, incCommentStat } from "../firebase/comments";
import { normalizeHashToShit, SHIT_TAG_MARK } from "../lib/hashtags";
import { getCommentReaction, setCommentReaction } from "../lib/reactionsStorage";
import shitOnlyLogo from "../components/Logo/shit_only_logo_black.png";
import shitOnlyLogoOutline from "../components/Logo/shit_only_logo_outline_white.png";

const MAX_COMMENT_LEN = 700;

function buildTree(list) {
  const byId = new Map();
  const roots = [];

  for (const c of list || []) byId.set(c.id, { ...c, replies: [] });

  for (const c of byId.values()) {
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId).replies.push(c);
    } else {
      roots.push(c);
    }
  }

  for (const c of byId.values()) {
    c.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  return roots;
}

export default function PostThreadPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    posts,
    bumpStat,
    toggleShit,
    toggleLike,
    ensureShit,
    useFirestore,
    firebaseDb,
  } = useContext(ShellContext);

  const post = useMemo(() => (posts || []).find((p) => String(p.id) === String(id)), [posts, id]);

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [sort, setSort] = useState("best");
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState(() => loadComments(id));

  const textareaRef = useRef(null);

  useEffect(() => {
    if (!id) return undefined;
    if (!useFirestore || !firebaseDb) {
      setComments(loadComments(id));
      return undefined;
    }
    const unsub = listenToComments(
      firebaseDb,
      id,
      (items) => {
        setComments(
          items.map((c) => {
            const r = getCommentReaction(id, c.id);
            return { ...c, didShit: r.didShit, didLike: r.didLike };
          })
        );
      },
      () => {}
    );
    return () => unsub();
  }, [firebaseDb, id, useFirestore]);

  useEffect(() => {
    if (!id) return;
    if (useFirestore) return;
    saveComments(id, comments);
  }, [comments, id, useFirestore]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? (comments || []).filter((c) => String(c.text || "").toLowerCase().includes(q))
      : comments || [];

    if (sort === "new") {
      return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sort === "old") {
      return [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    // "best" is a placeholder in this prototype; keep newest first.
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [comments, search, sort]);

  const tree = useMemo(() => buildTree(filtered), [filtered]);

  function autosize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    autosize();
  }, [commentText]);

  async function submitComment(e) {
    e.preventDefault();
    const text = normalizeHashToShit(commentText.trim());
    if (!post || !text) return;
    if (text.length > MAX_COMMENT_LEN) return;

    const comment = {
      id: uid(),
      postId: post.id,
      parentId: replyTo?.id || null,
      authorInitial: "U",
      authorName: "You",
      authorHandle: "@user",
      text,
      createdAt: new Date().toISOString(),
      didShit: false,
      didLike: false,
      stats: { shit: 0, like: 0 },
    };

    setCommentText("");
    setReplyTo(null);

    bumpStat(post.id, "shitcomment");

    if (useFirestore && firebaseDb) {
      try {
        await createComment(firebaseDb, post.id, comment);
      } catch {
        // fall back to local if firestore write fails
        setComments((prev) => addCommentLocal(post.id, comment));
      }
      return;
    }

    setComments((prev) => [comment, ...(prev || [])]);
  }

  function beginReply(comment) {
    setReplyTo({ id: comment.id, author: comment.authorHandle || "@user" });
    textareaRef.current?.focus();
  }

  function applyVote(next, kind) {
    const stats = next.stats || { shit: 0, like: 0 };
    let didShit = Boolean(next.didShit);
    let didLike = Boolean(next.didLike);
    const nextStats = { ...stats };
    const delta = { shit: 0, like: 0 };

    if (kind === "shit") {
      if (didShit) {
        didShit = false;
        const shitWas = Number(nextStats.shit || 0) || 0;
        nextStats.shit = Math.max(0, shitWas - 1);
        if (shitWas > 0) delta.shit -= 1;
      } else {
        didShit = true;
        nextStats.shit = (nextStats.shit || 0) + 1;
        delta.shit += 1;
        if (didLike) {
          didLike = false;
          const likeWas = Number(nextStats.like || 0) || 0;
          nextStats.like = Math.max(0, likeWas - 1);
          if (likeWas > 0) delta.like -= 1;
        }
      }
    } else if (kind === "like") {
      if (didLike) {
        didLike = false;
        const likeWas = Number(nextStats.like || 0) || 0;
        nextStats.like = Math.max(0, likeWas - 1);
        if (likeWas > 0) delta.like -= 1;
      } else {
        didLike = true;
        nextStats.like = (nextStats.like || 0) + 1;
        delta.like += 1;
        if (didShit) {
          didShit = false;
          const shitWas = Number(nextStats.shit || 0) || 0;
          nextStats.shit = Math.max(0, shitWas - 1);
          if (shitWas > 0) delta.shit -= 1;
        }
      }
    }

    return { next: { ...next, didShit, didLike, stats: nextStats }, delta };
  }

  async function toggleCommentVote(commentId, kind) {
    let deltas = { shit: 0, like: 0 };
    setComments((prev) =>
      (prev || []).map((c) => {
        if (c.id !== commentId) return c;
        const res = applyVote(c, kind);
        deltas = res.delta;
        setCommentReaction(id, commentId, { didShit: res.next.didShit, didLike: res.next.didLike });
        return res.next;
      })
    );

    if (!useFirestore || !firebaseDb) return;
    try {
      if (deltas.shit) await incCommentStat(firebaseDb, id, commentId, "shit", deltas.shit);
      if (deltas.like) await incCommentStat(firebaseDb, id, commentId, "like", deltas.like);
    } catch {
      // ignore
    }
  }

  function CommentItem({ c, depth = 0 }) {
    const indent = Math.min(3, depth);
    return (
      <div className={`comment ${indent ? "comment--nested" : ""}`} style={{ "--indent": indent }}>
        <div className="commentAvatar">{c.authorInitial || "U"}</div>
        <div className="commentMain">
          <div className="commentHeader">
            <span className="commentName">{c.authorName || "User"}</span>
            <span className="commentHandle">{c.authorHandle || "@user"}</span>
            <span className="commentTime">· {new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <div className="commentText">{c.text}</div>
          <div className="commentActions">
            <button
              className={`commentVote commentVote--shit ${c.didShit ? "isActive" : ""}`}
              type="button"
              onClick={() => toggleCommentVote(c.id, "shit")}
              title="Shit (good)"
            >
              <img
                className={`commentVoteIcon ${c.didShit ? "commentVoteIcon--filled" : "commentVoteIcon--outline"}`}
                src={c.didShit ? shitOnlyLogo : shitOnlyLogoOutline}
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span className="commentVoteCount">{c?.stats?.shit || 0}</span>
            </button>

            <button
              className={`commentVote commentVote--like ${c.didLike ? "isActive" : ""}`}
              type="button"
              onClick={() => toggleCommentVote(c.id, "like")}
              title="Like (bad)"
            >
              <ThumbsDown size={16} aria-hidden="true" />
              <span className="commentVoteCount">{c?.stats?.like || 0}</span>
            </button>

            <button className="commentAction" type="button" onClick={() => beginReply(c)}>
              Reply
            </button>
          </div>
          {c.replies?.length ? (
            <div className="commentReplies">
              {c.replies.map((r) => (
                <CommentItem key={r.id} c={r} depth={depth + 1} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <header className="threadHeader">
          <button className="threadBack" type="button" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="threadTitle">Post</div>
        </header>
        <div className="emptyState">
          <div className="emptyTitle">Post not found</div>
          <div className="emptySub">This post may have been deleted or is not available.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="threadHeader">
        <button className="threadBack" type="button" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="threadTitle">Discussion</div>
      </header>

      <Post
        post={post}
        onAction={bumpStat}
        onToggleShit={toggleShit}
        onToggleLike={toggleLike}
        onEnsureShit={ensureShit}
        disableNavigate
      />

      <section className="threadSection" aria-label="Join the conversation">
        <form className="commentComposer" onSubmit={submitComment}>
          <div className="commentComposerTop">
            <div className="commentComposerTitle">Join the conversation</div>
            {replyTo ? (
              <button className="commentComposerCancel" type="button" onClick={() => setReplyTo(null)}>
                Cancel reply
              </button>
            ) : null}
          </div>
          {replyTo ? <div className="commentComposerReplying">Replying to {replyTo.author}</div> : null}
          <textarea
            ref={textareaRef}
            className="commentTextarea"
            placeholder="Write a comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "#") return;
              const el = textareaRef.current;
              if (!el) return;
              e.preventDefault();
              const start = el.selectionStart ?? commentText.length;
              const end = el.selectionEnd ?? commentText.length;
              const next = `${commentText.slice(0, start)}${SHIT_TAG_MARK}${commentText.slice(end)}`;
              setCommentText(next);
              requestAnimationFrame(() => {
                el.focus();
                const pos = start + SHIT_TAG_MARK.length;
                el.setSelectionRange(pos, pos);
              });
            }}
            maxLength={MAX_COMMENT_LEN}
          />
          <div className="commentComposerBottom">
            <div className="commentComposerMeta">
              {commentText.length}/{MAX_COMMENT_LEN}
            </div>
            <button className="postBtn" type="submit" disabled={!commentText.trim()}>
              Comment
            </button>
          </div>
        </form>

        <div className="threadTools">
          <label className="threadSort">
            <span>Sort by:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="best">Best</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </label>

          <div className="threadCommentSearch">
            <Search size={18} className="searchIcon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search comments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="threadSection" aria-label="Comments">
        {tree.length === 0 ? (
          <div className="threadEmpty">No comments yet. Be the first to reply.</div>
        ) : (
          <div className="commentList">
            {tree.map((c) => (
              <CommentItem key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
