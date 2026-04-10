import { localDateKey } from "./dates";

export function postScore(post) {
  const stats = post?.stats || {};
  const shits = Number(stats.shit || 0) || 0;
  const comments = Number(stats.shitcomment || 0) || 0;
  return shits + comments;
}

export function isSameLocalDay(iso, dateKey) {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return localDateKey(d) === dateKey;
}

export function topPostForDay(posts, dateKey) {
  const todays = (posts || []).filter((p) => isSameLocalDay(p?.createdAt, dateKey));
  if (todays.length === 0) return null;
  const sorted = [...todays].sort((a, b) => postScore(b) - postScore(a));
  return sorted[0] || null;
}

export function topPostsForDay(posts, dateKey, limit = 10) {
  const todays = (posts || []).filter((p) => isSameLocalDay(p?.createdAt, dateKey));
  const sorted = [...todays].sort((a, b) => postScore(b) - postScore(a));
  return sorted.slice(0, Math.max(1, limit));
}

export function topPostOverall(posts) {
  if (!posts || posts.length === 0) return null;
  const sorted = [...posts].sort((a, b) => postScore(b) - postScore(a));
  return sorted[0] || null;
}
