import { useState, useEffect } from "react";
import { getMe, getUserById } from "../api/user";
import { getFollowerCount, getFollowingCount } from "../api/follow";
import { useWebSocket } from "../providers/WebSocketProvider";
import avatarImg from "/user.jpeg";
import FollowButton from "../components/FollowButton";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState();
  const getCurrentUser = async () => {
    const res = await getMe();
    console.log(res, "Current user");
    setCurrentUser(res);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(false);
  const { socketService } = useWebSocket();

  const isOwnProfile = currentUser?.id === userId;

  // Fetch user data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        const followerData = await getFollowerCount(userId);
        const followingData = await getFollowingCount(userId);

        console.log(userData, "User data from current");
        setUser(userData);
        setStats({
          followers: followerData.followers,
          following: followingData.following,
          posts: userData._count?.posts || 0,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Listen for follow/unfollow events
  useEffect(() => {
    if (!socketService || !userId) return;

    console.log(
      "🔌 [UserProfile] Setting up socket listeners for userId:",
      userId
    );

    // ✅ FIXED: Changed from "follow:created" to "follower:created"
    const unsubscribeFollow = socketService.on("follower:created", (data) => {
      console.log("🔔 [UserProfile] follower:created event:", data);

      // If someone followed this user, increment followers
      if (data.followedId === userId) {
        console.log(
          `✅ [UserProfile] Someone followed this user (${userId}), incrementing followers`
        );
        setStats((prev) => ({
          ...prev,
          followers: prev.followers + 1,
        }));
      }
      // If this user followed someone, increment following
      if (data.followerId === userId) {
        console.log(
          `✅ [UserProfile] This user (${userId}) followed someone, incrementing following`
        );
        setStats((prev) => ({
          ...prev,
          following: prev.following + 1,
        }));
      }
    });

    const unsubscribeUnfollow = socketService.on("follow:removed", (data) => {
      console.log("🔕 [UserProfile] follow:removed event:", data);

      // If someone unfollowed this user, decrement followers
      if (data.followedId === userId) {
        console.log(
          `✅ [UserProfile] Someone unfollowed this user (${userId}), decrementing followers`
        );
        setStats((prev) => ({
          ...prev,
          followers: Math.max(0, prev.followers - 1),
        }));
      }
      // If this user unfollowed someone, decrement following
      if (data.followerId === userId) {
        console.log(
          `✅ [UserProfile] This user (${userId}) unfollowed someone, decrementing following`
        );
        setStats((prev) => ({
          ...prev,
          following: Math.max(0, prev.following - 1),
        }));
      }
    });

    return () => {
      console.log("🔌 [UserProfile] Cleaning up socket listeners");
      unsubscribeFollow();
      unsubscribeUnfollow();
    };
  }, [socketService, userId]);

  const handleFollowChange = (isFollowing) => {
    console.log(
      "🔄 [UserProfile] handleFollowChange called, isFollowing:",
      isFollowing
    );
    // DON'T update follower count here!
    // The socket event will handle it
    // This callback is just for notification purposes
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-10 text-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-10 text-center">
        <p className="text-red-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <img
            src={user.avatarUrl || avatarImg}
            alt={user.displayName || user.pseudoname}
            className="w-24 h-24 rounded-full object-cover border-2"
          />

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">
                {user.displayName || user.pseudoname}
              </h1>
              {!isOwnProfile && (
                <FollowButton
                  userId={userId}
                  onFollowChange={handleFollowChange}
                />
              )}
            </div>

            {user.username && (
              <p className="text-gray-500 mb-3">@{user.username}</p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-xl font-semibold">{stats.posts}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center cursor-pointer hover:bg-gray-50 px-3 py-1 rounded">
                <p className="text-xl font-semibold">{stats.followers}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center cursor-pointer hover:bg-gray-50 px-3 py-1 rounded">
                <p className="text-xl font-semibold">{stats.following}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts would go here */}
      <div className="mt-6">
        {/* Add PostList component filtered by userId */}
      </div>
    </div>
  );
}
