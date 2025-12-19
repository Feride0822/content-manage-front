import React, { useEffect, useState } from "react";
import { useWebSocket } from "../providers/WebSocketProvider";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";
import { IoClose } from "react-icons/io5";

const NotificationToast = () => {
  const { notifications } = useWebSocket();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[notifications.length - 1];
    const id = Date.now() + Math.random();

    // Build icon based on type
    let icon = null;
    if (latest.type === "NEW_LIKE") icon = <CiHeart size={30} color="red" />;
    if (latest.type === "NEW_COMMENT")
      icon = <FaRegComment size={30} color="green" />;
    if (latest.type === "NEW_FOLLOW")
      icon = <SlUserFollow size={30} color="blue" />;

    // Build message text
    const text = latest.message;

    // Avatar fallback
    const avatar =
      latest.data?.user?.avatarUrl || "https://i.pravatar.cc/150?img=32";

    // Timestamp
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setVisibleNotifications((prev) => [
      ...prev,
      { ...latest, id, icon, text, avatar, time },
    ]);

    // Auto-remove after 5 seconds
    const timeout = setTimeout(() => {
      setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [notifications]);

  const handleClose = (id) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {visibleNotifications.map((n) => (
        <div
          key={n.id}
          className="w-80 flex items-center gap-3 bg-white rounded-3xl p-3 shadow-lg animate-slide-in"
        >
          {/* Avatar */}
          <img
            src={n.avatar}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border"
          />

          {/* Message */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              {n.icon}
              <span className="text-sm font-medium text-gray-900">
                {n.text}
              </span>
            </div>
            <div className="text-xs text-gray-500">{n.time}</div>
          </div>

          {/* Close button */}
          <button
            onClick={() => handleClose(n.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
