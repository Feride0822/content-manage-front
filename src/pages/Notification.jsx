import React from "react";
import { Link } from "react-router-dom";
import { useWebSocket } from "../providers/WebSocketProvider";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";
import avatarImg from "/user.jpeg";

const NotificationsPage = () => {
  const { notifications, clearNotifications } = useWebSocket();

  /* ---------------- HELPERS ---------------- */

  const getIcon = (type) => {
    switch (type) {
      case "NEW_LIKE":
        return <FaHeart className="text-red-500" size={22} />;
      case "NEW_COMMENT":
        return <FaRegComment className="text-green-500" size={22} />;
      case "NEW_FOLLOW":
        return <SlUserFollow className="text-blue-500" size={22} />;
      default:
        return <CiHeart className="text-gray-400" size={22} />;
    }
  };

  const getAvatar = (n) => {
    if (n.type === "NEW_COMMENT") return n.data?.user?.avatarUrl || avatarImg;
    if (n.type === "NEW_LIKE")
      return n.data?.like?.user?.avatarUrl || avatarImg;
    if (n.type === "NEW_FOLLOW")
      return n.data?.follower?.avatarUrl || avatarImg;
    return avatarImg;
  };

  const getUserId = (n) => {
    if (n.type === "NEW_COMMENT") return n.data?.user?.id;
    if (n.type === "NEW_LIKE") return n.data?.like?.user?.id;
    if (n.type === "NEW_FOLLOW") return n.data?.follower?.id;
    return null;
  };

  const getPostLink = (n) => {
    if (n.type === "NEW_COMMENT") return `/post/${n.data?.post?.id}`;
    if (n.type === "NEW_LIKE") return `/post/${n.data?.postId}`;
    return null;
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full flex justify-center pt-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>

          {notifications.some((n) => !n.read) && (
            <button
              onClick={clearNotifications}
              className="text-blue-500 text-sm hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center">
              <CiHeart size={60} className="mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const userId = getUserId(n);
              const postLink = getPostLink(n);

              return (
                <div
                  key={n.data?.id}
                  className={`bg-white rounded-xl shadow p-4 flex items-center justify-center gap-4 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Avatar */}
                  {userId ? (
                    <div>
                      <img
                        src={getAvatar(n)}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    </div>
                  ) : (
                    <img
                      src={getAvatar(n)}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      {getIcon(n.type)}

                      <div>
                        {postLink ? (
                          <Link
                            to={postLink}
                            className="text-gray-800 hover:underline"
                          >
                            {n.message}
                          </Link>
                        ) : (
                          <p className="text-gray-800">{n.message}</p>
                        )}

                        {/* Comment preview */}
                        {n.type === "NEW_COMMENT" && (
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            “{n.data?.content}”
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                          {timeAgo(
                            n?.type === "NEW_COMMENT"
                              ? n?.data?.created_at
                              : n?.type === "NEW_LIKE"
                              ? n?.data?.like?.created_at
                              : n?.data?.created_at
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
