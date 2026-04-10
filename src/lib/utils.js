export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function formatRelativeTime(iso) {
  const dt = new Date(iso);
  const diffMs = Date.now() - dt.getTime();
  const s = Math.floor(diffMs / 1000);
  if (s < 10) return "now";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function channelFromHash(hash, shift, min, max) {
  const span = max - min;
  const v = (hash >>> shift) & 0xff;
  return min + (v % (span + 1));
}

export function postTintFromId(id, alpha = 0.08) {
  const hash = fnv1a32(String(id || ""));
  const r = channelFromHash(hash, 0, 70, 230);
  const g = channelFromHash(hash, 8, 70, 230);
  const b = channelFromHash(hash, 16, 70, 230);
  const a = Math.max(0.03, Math.min(0.18, alpha));
  return {
    bg: `rgba(${r}, ${g}, ${b}, ${a})`,
    border: `rgba(${r}, ${g}, ${b}, ${Math.max(0.14, a + 0.08)})`,
  };
}
