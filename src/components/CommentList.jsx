import React, { useEffect, useState, useRef } from "react";
import { getComments, createComment } from "../api/comment";
import { useWebSocket } from "../providers/WebSocketProvider";
import { STORAGE_KEYS } from "../constants/auth.constants";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const { socketService } = useWebSocket();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const currentUser = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.USER) || "{}"
  );
  const displayName = currentUser.displayName || currentUser.username || "User";

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments({ postId });
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socketService) return;

    const onCommentCreated = (comment) => {
      console.log("💬 comment:created", comment);
      if (comment.postId === postId) {
        setComments((prev) => {
          if (prev.some((c) => c.id === comment.id)) return prev;
          return [comment, ...prev];
        });
      }
    };

    const onCommentUpdated = (comment) => {
      console.log("✏️ comment:updated", comment);
      if (comment.postId === postId) {
        setComments((prev) =>
          prev.map((c) => (c.id === comment.id ? comment : c))
        );
      }
    };

    const onCommentDeleted = ({ commentId }) => {
      console.log("🗑 comment:deleted", commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    const onTyping = (data) => {
      if (data.postId === postId && data.displayName !== displayName) {
        setTypingUsers((prev) => new Set([...prev, data.displayName]));
      }
    };

    const onStopTyping = (data) => {
      if (data.postId === postId) {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(data.displayName);
          return updated;
        });
      }
    };

    socketService.on("comment:created", onCommentCreated);
    socketService.on("comment:updated", onCommentUpdated);
    socketService.on("comment:deleted", onCommentDeleted);
    socketService.on("comment:typing", onTyping);
    socketService.on("comment:stop-typing", onStopTyping);

    return () => {
      socketService.off("comment:created", onCommentCreated);
      socketService.off("comment:updated", onCommentUpdated);
      socketService.off("comment:deleted", onCommentDeleted);
      socketService.off("comment:typing", onTyping);
      socketService.off("comment:stop-typing", onStopTyping);
    };
  }, [socketService, postId, displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    if (isTypingRef.current) {
      socketService.sendStopTyping(postId, displayName);
      isTypingRef.current = false;
    }

    setSubmitting(true);
    try {
      await createComment({ postId, content: newComment });
      setNewComment("");
    } catch (err) {
      console.error("Error creating comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    if (value.trim() && !isTypingRef.current) {
      socketService.sendTyping(postId, displayName);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socketService.sendStopTyping(postId, displayName);
        isTypingRef.current = false;
      }
    }, 2000);

    if (!value.trim() && isTypingRef.current) {
      socketService.sendStopTyping(postId, displayName);
      isTypingRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      if (isTypingRef.current)
        socketService.sendStopTyping(postId, displayName);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [postId, displayName]);

  return (
    <div className="space-y-3 mt-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={handleInputChange}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "..." : "Post"}
        </button>
      </form>

      {typingUsers.size > 0 && (
        <div className="text-sm text-gray-500 italic">
          {Array.from(typingUsers).join(", ")}{" "}
          {typingUsers.size === 1 ? "is" : "are"} typing...
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {comment.user.displayName}
                </span>
                <span className="text-gray-500 text-sm">{comment.content}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
