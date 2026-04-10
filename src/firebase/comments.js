import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

export function listenToComments(db, postId, onData, onError) {
  const col = collection(db, "posts", String(postId), "comments");
  const q = query(col, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const items = [];
      snap.forEach((d) => {
        const data = d.data() || {};
        const createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date();
        items.push({
          id: d.id,
          postId: String(postId),
          parentId: data.parentId || null,
          authorInitial: data.authorInitial || "U",
          authorName: data.authorName || "User",
          authorHandle: data.authorHandle || "@user",
          text: data.text || "",
          createdAt: createdAt?.toISOString ? createdAt.toISOString() : String(createdAt),
          stats: {
            shit: Number(data.stats?.shit || 0) || 0,
            like: Number(data.stats?.like || 0) || 0,
          },
        });
      });
      onData(items);
    },
    onError
  );
}

export async function createComment(db, postId, comment) {
  const col = collection(db, "posts", String(postId), "comments");
  const { id: _ignoreId, ...data } = comment || {};
  await addDoc(col, { ...data, stats: data.stats || { shit: 0, like: 0 } });
}

export async function incCommentStat(db, postId, commentId, field, by = 1) {
  const ref = doc(db, "posts", String(postId), "comments", String(commentId));
  await updateDoc(ref, {
    [`stats.${field}`]: increment(by),
  });
}
