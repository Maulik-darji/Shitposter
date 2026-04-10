import {
  addDoc,
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export function listenToPosts(db, onPosts, onError) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(200));
  return onSnapshot(
    q,
    (snap) => {
      const posts = snap.docs.map((d) => {
        const data = d.data() || {};
        const createdAt = data.createdAt?.toDate?.() || new Date();
        return {
          id: d.id,
          authorInitial: data.authorInitial || "U",
          authorName: data.authorName || "User",
          authorHandle: data.authorHandle || "@user",
          title: data.title || "",
          text: data.text || "",
          language: data.language || "English",
          createdAt: createdAt.toISOString(),
          stats: {
            shit: Number(data.stats?.shit || 0) || 0,
            like: Number(data.stats?.like || 0) || 0,
            shitcomment: Number(data.stats?.shitcomment || 0) || 0,
            repostshit: Number(data.stats?.repostshit || 0) || 0,
            shareshit: Number(data.stats?.shareshit || 0) || 0,
          },
        };
      });
      onPosts(posts);
    },
    onError
  );
}

export async function createPost(db, post) {
  const payload = {
    authorInitial: post.authorInitial || "U",
    authorName: post.authorName || "You",
    authorHandle: post.authorHandle || "@user",
    title: post.title || "",
    text: post.text || "",
    language: post.language || "English",
    createdAt: serverTimestamp(),
    stats: post.stats || { shit: 0, like: 0, shitcomment: 0, repostshit: 0, shareshit: 0 },
  };
  const ref = await addDoc(collection(db, "posts"), payload);
  return ref.id;
}

export async function incPostStat(db, postId, field, by = 1) {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, {
    [`stats.${field}`]: increment(by),
  });
}
