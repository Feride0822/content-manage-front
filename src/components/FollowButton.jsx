import { useState, useEffect } from "react";
import { toggleFollow, checkFollowing } from "../api/follow";

/**
 * Reusable Follow/Unfollow Button Component
 * @param {string} userId - The user ID to follow/unfollow
 * @param {boolean} initialFollowing - Initial following state (optional)
 * @param {function} onFollowChange - Callback when follow state changes (optional)
 * @param {string} className - Custom CSS classes (optional)
 */
export default function FollowButton({
  userId,
  initialFollowing = false,
  onFollowChange,
  className = "",
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  // Check initial follow status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { following: isFollowing } = await checkFollowing(userId);
        setFollowing(isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
        setFollowing(false);
      }
    };

    if (!initialFollowing) {
      checkStatus();
    }
  }, [userId]);

  const handleToggle = async () => {
    if (loading) return;

    setLoading(true);
    const previousState = following;

    // Optimistic update - ONLY change button state
    setFollowing(!following);

    try {
      const result = await toggleFollow(userId);
      setFollowing(result.following);

      // Call callback if provided (just for notification, NOT for updating counts)
      if (onFollowChange) {
        onFollowChange(result.following);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Rollback on error
      setFollowing(previousState);

      // Notify callback of rollback
      if (onFollowChange) {
        onFollowChange(previousState);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-1 rounded-xl border transition-all ${
        following
          ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          : "bg-black text-white hover:bg-gray-800"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? "..." : following ? "Unfollow" : "Follow"}
    </button>
  );
}
