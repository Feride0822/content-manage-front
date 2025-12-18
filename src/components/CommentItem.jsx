import { useState, useEffect } from "react";
import { updateComment, deleteComment } from "../api/comment";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

export default function CommentItem({ comment, currentUserId, onChanged }) {
  const isOwner = comment.user.id === currentUserId;

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [timeAgo, setTimeAgo] = useState(
    formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
  );

  // Update timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(
        formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [comment.created_at]);

  const save = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await updateComment({ id: comment.id, content });
      setEditing(false);
      onChanged(); // 🔄 refetch comments
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      await deleteComment(comment.id);
      onChanged();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-gray-100 px-3 py-2 rounded-lg">
      <div className="flex justify-between items-start">
        <span className="font-semibold">{comment.user.displayName}</span>
        <span className="text-xs text-gray-400">{timeAgo}</span>

        {isOwner && (
          <div className="flex gap-2 text-xs text-blue-500 ml-2">
            <button
              onClick={() => setEditing((v) => !v)}
              className="cursor-pointer"
            >
              {editing ? "Cancel" : <FiEdit />}
            </button>
            <button onClick={remove} className="text-red-500 cursor-pointer">
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="mt-2 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 rounded border px-2 py-1 text-sm"
          />
          <button
            onClick={save}
            disabled={loading}
            className="text-sm bg-blue-500 text-white px-3 rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-sm mt-1">{comment.content}</p>
      )}
    </div>
  );
}
