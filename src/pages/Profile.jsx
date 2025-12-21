import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMe, getUserById } from "../api/user";
import {
  getFollowerCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
} from "../api/follow";
import { getPostsByUserId } from "../api/post";
import { useWebSocket } from "../providers/WebSocketProvider";
import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";
import avatarImg from "/user.jpeg";

export default function UserProfile() {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Tab content data
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  const { socketService } = useWebSocket();

  const getCurrentUser = async () => {
    const res = await getMe();
    setCurrentUser(res);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const isOwnProfile = currentUser?.id === userId;

  // Fetch user data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        const followerData = await getFollowerCount(userId);
        const followingData = await getFollowingCount(userId);

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

  // Fetch tab content when tab changes
  useEffect(() => {
    const fetchTabContent = async () => {
      setTabLoading(true);
      try {
        if (activeTab === "posts") {
          const postsData = await getPostsByUserId(userId);
          console.log(postsData, "Posts by userId");
          setPosts(postsData || []);
        } else if (activeTab === "followers") {
          const followersData = await getFollowers(userId);
          setFollowers(followersData);
        } else if (activeTab === "following") {
          const followingData = await getFollowing(userId);
          setFollowing(followingData);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        setTabLoading(false);
      }
    };

    if (userId) {
      fetchTabContent();
    }
  }, [activeTab, userId]);

  // Listen for follow/unfollow events
  useEffect(() => {
    if (!socketService || !userId) return;

    const unsubscribeFollow = socketService.on("follower:created", (data) => {
      // If someone followed this user, increment followers
      if (data.followedId === userId) {
        setStats((prev) => ({
          ...prev,
          followers: prev.followers + 1,
        }));

        // Refresh followers list if on that tab
        if (activeTab === "followers") {
          getFollowers(userId).then((data) => setFollowers(data));
        }
      }
      // If this user followed someone, increment following
      if (data.followerId === userId) {
        setStats((prev) => ({
          ...prev,
          following: prev.following + 1,
        }));

        // Refresh following list if on that tab
        if (activeTab === "following") {
          getFollowing(userId).then((data) => setFollowing(data));
        }
      }
    });

    const unsubscribeUnfollow = socketService.on("follow:removed", (data) => {
      // If someone unfollowed this user, decrement followers
      if (data.followedId === userId) {
        setStats((prev) => ({
          ...prev,
          followers: Math.max(0, prev.followers - 1),
        }));

        // Refresh followers list if on that tab
        if (activeTab === "followers") {
          getFollowers(userId).then((data) => setFollowers(data));
        }
      }
      // If this user unfollowed someone, decrement following
      if (data.followerId === userId) {
        setStats((prev) => ({
          ...prev,
          following: Math.max(0, prev.following - 1),
        }));

        // Refresh following list if on that tab
        if (activeTab === "following") {
          getFollowing(userId).then((data) => setFollowing(data));
        }
      }
    });

    return () => {
      unsubscribeFollow();
      unsubscribeUnfollow();
    };
  }, [socketService, userId, activeTab]);

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
    <div className="w-full px-3 sm:px-0 sm:max-w-2xl mx-auto mt-4 sm:mt-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <img
            src={user.avatarUrl || avatarImg}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border object-cover mx-auto sm:mx-0"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">
                {user.displayName || user.pseudoname}
              </h1>
              {!isOwnProfile && <FollowButton userId={userId} />}
            </div>

            {user.username && (
              <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
            )}

            <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 mt-4">
              {["posts", "followers", "following"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded text-center ${
                    activeTab === tab ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold">
                    {stats[tab === "posts" ? "posts" : tab]}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{tab}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-3 rounded-xl shadow">
        <div className="flex text-sm sm:text-base">
          {["posts", "followers", "following"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-medium ${
                activeTab === tab ? "border-b-2 border-black" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3">
        {tabLoading && (
          <p className="text-center text-gray-500 py-6">Loading…</p>
        )}

        {activeTab === "posts" &&
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser?.id}
              onDelete={(id) =>
                setPosts((prev) => prev.filter((p) => p.id !== id))
              }
            />
          ))}

        {activeTab !== "posts" &&
          (activeTab === "followers" ? followers : following).map((item) => {
            const u = activeTab === "followers" ? item.follower : item.followed;
            return (
              <div
                key={u.id}
                className="bg-white p-3 sm:p-4 rounded-xl shadow flex items-center justify-between gap-3"
              >
                <Link
                  to={`/profile/${u.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <img
                    src={u.avatarUrl || avatarImg}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border"
                  />
                  <div className="truncate">
                    <p className="font-medium truncate">
                      {u.displayName || u.pseudoname}
                    </p>
                    {u.username && (
                      <p className="text-xs text-gray-500 truncate">
                        @{u.username}
                      </p>
                    )}
                  </div>
                </Link>
                {currentUser?.id !== u.id && <FollowButton userId={u.id} />}
              </div>
            );
          })}
      </div>
    </div>
  );
}
