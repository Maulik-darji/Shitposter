import { localDateKey, localMonthKey } from "./dates";

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

export function isSameLocalMonth(iso, monthKey) {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return localMonthKey(d) === monthKey;
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

function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function viralOfMonth(posts, monthKey, limit = 10, pool = 40) {
  const monthly = (posts || []).filter((p) => isSameLocalMonth(p?.createdAt, monthKey));
  const scored = monthly
    .map((p) => ({ p, s: postScore(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  if (scored.length === 0) return [];

  const poolSize = Math.max(limit, Math.min(scored.length, pool));
  const poolPosts = scored.slice(0, poolSize);

  // Deterministic "random" selection: stable for the same month and post IDs.
  const shuffled = [...poolPosts].sort((a, b) => {
    const ah = fnv1a32(`${monthKey}:${a.id}`);
    const bh = fnv1a32(`${monthKey}:${b.id}`);
    return ah - bh;
  });

  return shuffled.slice(0, Math.max(1, limit));
}
