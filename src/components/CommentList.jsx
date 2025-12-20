import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { useAuth } from "../context/AuthContext";
import { getComments } from "../api/comment";

export default function CommentList({ postId }) {
  const { user } = useAuth(); // must contain user.id 
  const currentUserId = user?.id;
  console.log(user, 'User coming from useAuth');

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments({ postId });
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-3 border-t pt-3">
      <CommentForm postId={postId} onSuccess={fetchComments} />

      {loading && (
        <p className="text-sm text-gray-400 mt-2">Loading comments...</p>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">No comments yet</p>
      )}

      <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUserId={currentUserId}
            onChanged={fetchComments}
          />
        ))}
      </div>
    </div>
  );
}
