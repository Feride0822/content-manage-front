import { useState } from "react";
import { createComment } from "../api/comment";

export default function CommentForm({ postId, onSuccess }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await createComment({ postId, content });
      setContent("");
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 rounded-full border px-4 py-2 text-sm"
      />
      <button
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        {loading ? "..." : "Post"}
      </button>
    </form>
  );
}
