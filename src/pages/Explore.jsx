import { useEffect, useState } from "react";
import { getUsers } from "../api/user";
import { toggleFollow, checkFollowing } from "../api/follow";
import { useWebSocket } from "../providers/WebSocketProvider";
import avatarImg from "/user.jpeg";
import { Link } from "react-router-dom";

function Explore() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState({});
  const { socketService } = useWebSocket();

  // Fetch users and their follow status
  const getUserData = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      console.log("Users fetched:", res?.users);

      // Check follow status for each user
      if (res?.users) {
        const usersWithFollowStatus = await Promise.all(
          res.users.map(async (user) => {
            try {
              const { following } = await checkFollowing(user.id);
              return { ...user, following };
            } catch (err) {
              // If not authenticated or error, default to false
              return { ...user, following: false };
            }
          })
        );
        setUsers(usersWithFollowStatus);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Listen for WebSocket follow/unfollow events
  useEffect(() => {
    if (!socketService) return;

    console.log("🔌 [Explore] Setting up follow event listeners");

    // New follow event (backend emits 'follower:created')
    const unsubscribeFollow = socketService.on(
      "follower:created",
      (followData) => {
        console.log(
          "🔔 [Explore] follower:created event received:",
          followData
        );
        console.log("🔍 followData.followedId:", followData.followedId);
        console.log("🔍 followData.followerId:", followData.followerId);

        // Update the followed user's follower count
        setUsers((prev) => {
          console.log(
            "📝 [Explore] Current users before update:",
            prev.map((u) => ({ id: u.id, followers: u._count?.followers }))
          );

          const updated = prev.map((user) => {
            if (user.id === followData.followedId) {
              console.log(
                `✅ [Explore] Updating user ${user.id} follower count: ${
                  user._count?.followers || 0
                } → ${(user._count?.followers || 0) + 1}`
              );
              return {
                ...user,
                _count: {
                  ...user._count,
                  followers: (user._count?.followers || 0) + 1,
                },
              };
            }
            return user;
          });

          console.log(
            "📝 [Explore] Users after update:",
            updated.map((u) => ({ id: u.id, followers: u._count?.followers }))
          );
          return updated;
        });
      }
    );

    // Unfollow event
    const unsubscribeUnfollow = socketService.on(
      "follow:removed",
      (unfollowData) => {
        console.log(
          "🔕 [Explore] follow:removed event received:",
          unfollowData
        );
        console.log("🔍 unfollowData.followedId:", unfollowData.followedId);
        console.log("🔍 unfollowData.followerId:", unfollowData.followerId);

        // Update the unfollowed user's follower count
        setUsers((prev) => {
          console.log(
            "📝 [Explore] Current users before unfollow update:",
            prev.map((u) => ({ id: u.id, followers: u._count?.followers }))
          );

          const updated = prev.map((user) => {
            if (user.id === unfollowData.followedId) {
              console.log(
                `✅ [Explore] Updating user ${user.id} follower count: ${
                  user._count?.followers || 0
                } → ${Math.max(0, (user._count?.followers || 0) - 1)}`
              );
              return {
                ...user,
                _count: {
                  ...user._count,
                  followers: Math.max(0, (user._count?.followers || 0) - 1),
                },
              };
            }
            return user;
          });

          console.log(
            "📝 [Explore] Users after unfollow update:",
            updated.map((u) => ({ id: u.id, followers: u._count?.followers }))
          );
          return updated;
        });
      }
    );

    return () => {
      console.log("🔌 [Explore] Cleaning up follow event listeners");
      unsubscribeFollow();
      unsubscribeUnfollow();
    };
  }, [socketService]);

  // Toggle follow/unfollow
  const handleToggleFollow = async (userId, index) => {
    console.log(
      `🎯 [Explore] handleToggleFollow called for userId: ${userId}, index: ${index}`
    );

    // Prevent multiple clicks
    if (followLoading[userId]) {
      console.log("⚠️ [Explore] Already loading, ignoring click");
      return;
    }

    setFollowLoading((prev) => ({ ...prev, [userId]: true }));

    // Store previous state for rollback
    const previousFollowing = users[index].following;

    console.log(
      `📊 [Explore] Previous state - following: ${previousFollowing}`
    );

    // Optimistic update - ONLY update the following status, NOT the follower count
    // The socket event will handle the follower count update
    setUsers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        following: !previousFollowing,
        // DON'T touch the follower count here - socket will update it
      };
      console.log(
        `✨ [Explore] Optimistic update - following: ${!previousFollowing}`
      );
      return updated;
    });

    try {
      const result = await toggleFollow(userId);
      console.log("✅ [Explore] Follow toggle result:", result);

      // Sync with server response (just the following status)
      setUsers((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          following: result.following,
          // Socket will update the follower count
        };
        return updated;
      });
    } catch (error) {
      console.error("❌ [Explore] Error toggling follow:", error);

      // Rollback on error - ONLY rollback the following status
      setUsers((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          following: previousFollowing,
        };
        console.log(
          `🔄 [Explore] Rolled back - following: ${previousFollowing}`
        );
        return updated;
      });
    } finally {
      setFollowLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-5 text-center">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-0 sm:max-w-2xl mx-auto mt-3 sm:mt-5 space-y-3">
      {users?.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        users.map((user, index) => (
          <div
            key={user.id}
            className="
              flex
              items-center
              justify-between
              bg-white
              p-3
              sm:p-4
              rounded-xl
              shadow-sm
              border
              gap-3
            "
          >
            {/* Left user info */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={user.avatarUrl || avatarImg}
                alt="avatar"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border flex-shrink-0"
              />

              <div className="min-w-0">
                <Link
                  className="font-medium hover:underline text-sm sm:text-base truncate block"
                  to={`/profile/${user?.id}`}
                >
                  {user.displayName || user.pseudoname}
                </Link>

                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {user?._count?.posts || 0} posts •{" "}
                  {user?._count?.followers || 0}
                  {user?._count?.followers === 1 ? " follower" : " followers"}
                </p>
              </div>
            </div>

            {/* Follow / Unfollow button */}
            <button
              onClick={() => handleToggleFollow(user.id, index)}
              disabled={followLoading[user.id]}
              className={`
                px-3
                sm:px-4
                py-1
                sm:py-1.5
                rounded-lg
                sm:rounded-xl
                text-xs
                sm:text-sm
                border
                transition-all
                whitespace-nowrap
                ${
                  user.following
                    ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-black text-white hover:bg-gray-800"
                }
                ${followLoading[user.id] ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {followLoading[user.id]
                ? "..."
                : user.following
                ? "Unfollow"
                : "Follow"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Explore;
