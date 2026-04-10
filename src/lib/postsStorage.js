const STORAGE_KEY = "textpulse_posts_v1";

export function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const posts = Array.isArray(parsed) ? parsed : [];
    return posts.map((p) => {
      const stats = p?.stats && typeof p.stats === "object" ? { ...p.stats } : {};

      const legacyKeys = stats.reply != null || stats.repost != null || stats.share != null;
      const legacyLikeOnly =
        stats.like != null &&
        stats.shit == null &&
        stats.shitcomment == null &&
        stats.repostshit == null &&
        stats.shareshit == null;

      const hadLegacy = legacyKeys || legacyLikeOnly;

      if (legacyLikeOnly) stats.shit = stats.like;

      // Remove legacy/demo counters so UI doesn't show "fake" engagement.
      // Keep user-generated `shit` counts unless they came from legacy/demo data.
      const nextShit = hadLegacy ? 0 : Number(stats.shit || 0) || 0;
      const nextLike = hadLegacy ? 0 : Number(stats.like || 0) || 0;
      const nextShitComment = hadLegacy ? 0 : Number(stats.shitcomment || 0) || 0;
      const nextRepostShit = hadLegacy ? 0 : Number(stats.repostshit || 0) || 0;
      const nextShareShit = hadLegacy ? 0 : Number(stats.shareshit || 0) || 0;

      return {
        ...p,
        title: typeof p?.title === "string" && p.title.trim() ? p.title : "Untitled",
        language: typeof p?.language === "string" && p.language.trim() ? p.language : "English",
        didShit: hadLegacy ? false : Boolean(p?.didShit),
        didLike: hadLegacy ? false : Boolean(p?.didLike),
        stats: {
          shit: nextShit,
          like: nextLike,
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
      didLike: false,
      title: "Redesign shipped",
      text: "Just deployed the new redesign for Shitposter. The UI is finally looking as sharp as the logic. Pure black mode is the only way to live. 🚀",
      language: "English",
      createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
      stats: { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    },
    {
      id: crypto.randomUUID(),
      authorInitial: "M",
      authorName: "User",
      authorHandle: "@user",
      didShit: false,
      didLike: false,
      title: "Build something today",
      text: "Build something today that didn't exist yesterday. That's the superpower of being a developer.",
      language: "English",
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      stats: { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    },
    {
      id: crypto.randomUUID(),
      authorInitial: "T",
      authorName: "User",
      authorHandle: "@user",
      didShit: false,
      didLike: false,
      title: "Minimalism is peak",
      text: "Is it just me or is the new X interface actually growing on people? The minimalism is peak. #design #webdev",
      language: "English",
      createdAt: new Date(now - 1000 * 60 * 120).toISOString(),
      stats: { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
    },
  ];
}
