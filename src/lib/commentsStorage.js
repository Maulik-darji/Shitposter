const PREFIX = "shitposter_comments_v1:";

function keyForPost(postId) {
  return `${PREFIX}${String(postId || "")}`;
}

export function loadComments(postId) {
  try {
    const raw = localStorage.getItem(keyForPost(postId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveComments(postId, comments) {
  try {
    localStorage.setItem(keyForPost(postId), JSON.stringify(comments || []));
  } catch {
    // ignore
  }
}

export function addComment(postId, comment) {
  const current = loadComments(postId);
  const next = [comment, ...current];
  saveComments(postId, next);
  return next;
}

