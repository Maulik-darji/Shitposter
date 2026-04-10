const STORAGE_KEY = "textpulse_posts_v1";

export function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const posts = Array.isArray(parsed) ? parsed : [];
    return posts.map((p) => {
      const stats = p?.stats && typeof p.stats === "object" ? { ...p.stats } : {};
      const hadLegacy =
        stats.like != null || stats.reply != null || stats.repost != null || stats.share != null;

      if (stats.like != null && stats.shit == null) stats.shit = stats.like;

      // Remove legacy/demo counters so UI doesn't show "fake" engagement.
      // Keep user-generated `shit` counts unless they came from legacy/demo data.
      const nextShit = hadLegacy ? 0 : Number(stats.shit || 0) || 0;
      const nextShitComment = hadLegacy ? 0 : Number(stats.shitcomment || 0) || 0;
      const nextRepostShit = hadLegacy ? 0 : Number(stats.repostshit || 0) || 0;
      const nextShareShit = hadLegacy ? 0 : Number(stats.shareshit || 0) || 0;

      return {
        ...p,
        didShit: hadLegacy ? false : Boolean(p?.didShit),
        stats: {
          shit: nextShit,
          shitcomment: nextShitComment,
          repostshit: nextRepostShit,
          shareshit: nextShareShit,
        },
      };
    });
  } catch {
    return [];
  }
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function clearPosts() {
  localStorage.removeItem(STORAGE_KEY);
}

export function seedIfEmpty(posts) {
  if (posts.length > 0) return posts;
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      authorInitial: "A",
      authorName: "User",
      authorHandle: "@user",
      didShit: false,
      text: "Just deployed the new redesign for Shitposter. The UI is finally looking as sharp as the logic. Pure black mode is the only way to live. 🚀",
      createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
      stats: { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    },
    {
      id: crypto.randomUUID(),
      authorInitial: "M",
      authorName: "User",
      authorHandle: "@user",
      didShit: false,
      text: "Build something today that didn't exist yesterday. That's the superpower of being a developer.",
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      stats: { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    },
    {
      id: crypto.randomUUID(),
      authorInitial: "T",
      authorName: "User",
      authorHandle: "@user",
      didShit: false,
      text: "Is it just me or is the new X interface actually growing on people? The minimalism is peak. #design #webdev",
      createdAt: new Date(now - 1000 * 60 * 120).toISOString(),
      stats: { shit: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    },
  ];
}
