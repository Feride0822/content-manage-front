import { useState } from "react";
import { updateComment, deleteComment } from "../api/comment";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function CommentItem({ comment, currentUserId, onChanged }) {
  const isOwner = comment.user.id === currentUserId;

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

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

        {isOwner && (
          <div className="flex gap-2 text-xs text-blue-500">
            <button onClick={() => setEditing((v) => !v)}>
              {editing ? "Cancel" : <FiEdit />}
            </button>
            <button onClick={remove} className="text-red-500">
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
            className="text-sm bg-blue-500 text-white px-3 rounded"
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
