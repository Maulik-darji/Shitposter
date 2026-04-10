const KEY = "shitposter_reactions_v1";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadAll() {
  const raw = localStorage.getItem(KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!parsed || typeof parsed !== "object") return { posts: {}, comments: {} };
  return {
    posts: parsed.posts && typeof parsed.posts === "object" ? parsed.posts : {},
    comments: parsed.comments && typeof parsed.comments === "object" ? parsed.comments : {},
  };
}

function saveAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getPostReaction(postId) {
  const all = loadAll();
  const r = all.posts[String(postId)] || null;
  return {
    didShit: Boolean(r?.didShit),
    didLike: Boolean(r?.didLike),
  };
}

export function setPostReaction(postId, reaction) {
  const all = loadAll();
  all.posts[String(postId)] = {
    didShit: Boolean(reaction?.didShit),
    didLike: Boolean(reaction?.didLike),
  };
  saveAll(all);
}

export function getCommentReaction(postId, commentId) {
  const all = loadAll();
  const key = `${String(postId)}:${String(commentId)}`;
  const r = all.comments[key] || null;
  return {
    didShit: Boolean(r?.didShit),
    didLike: Boolean(r?.didLike),
  };
}

export function setCommentReaction(postId, commentId, reaction) {
  const all = loadAll();
  const key = `${String(postId)}:${String(commentId)}`;
  all.comments[key] = {
    didShit: Boolean(reaction?.didShit),
    didLike: Boolean(reaction?.didLike),
  };
  saveAll(all);
}

