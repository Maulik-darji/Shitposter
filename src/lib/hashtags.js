export const SHIT_TAG_MARK = "💩";

// Matches either "#tag" or "💩tag"
const TAG_RE = /[#💩]([A-Za-z0-9_]+)/g;

export function normalizeHashToShit(text) {
  return String(text || "").replaceAll("#", SHIT_TAG_MARK);
}

export function extractHashtags(text) {
  const t = String(text || "");
  const tags = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = TAG_RE.exec(t))) {
    if (m[1]) tags.push(m[1]);
  }
  return tags;
}

export function tokenizeHashtags(text) {
  const t = String(text || "");
  const out = [];
  let last = 0;
  let m;
  TAG_RE.lastIndex = 0;
  // eslint-disable-next-line no-cond-assign
  while ((m = TAG_RE.exec(t))) {
    const start = m.index;
    const end = TAG_RE.lastIndex;
    if (start > last) out.push({ type: "text", value: t.slice(last, start) });
    out.push({ type: "tag", value: m[1] || "" });
    last = end;
  }
  if (last < t.length) out.push({ type: "text", value: t.slice(last) });
  return out;
}

