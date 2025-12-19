import React, { useEffect, useState } from "react";
import { useWebSocket } from "../providers/WebSocketProvider";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";

const NotificationsPage = () => {
  const { notifications } = useWebSocket();
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const newNoti = notifications.map((n) => {
      let icon = null;
      if (n.type === "NEW_LIKE") icon = <CiHeart size={35} color="red" />;
      if (n.type === "NEW_COMMENT")
        icon = <FaRegComment size={30} color="green" />;
      if (n.type === "NEW_FOLLOW")
        icon = <SlUserFollow size={30} color="blue" />;

      return {
        id: n.id || Date.now() + Math.random(),
        text: n.message,
        avatar: n.data?.user?.avatarUrl || "https://i.pravatar.cc/150?img=32",
        icon,
        time: new Date(n.created_at || Date.now()).toLocaleString(),
      };
    });

    setAllNotifications((prev) => [...newNoti, ...prev]);
  }, [notifications])

  return (
    <div className="w-full flex justify-center pt-3">
      <div className="bg-gray-50 flex flex-col gap-3 w-full max-w-2xl min-h-screen rounded-4xl px-3 py-4">
        {allNotifications.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No notifications yet
          </div>
        )}

        {allNotifications.map((n) => (
          <div
            key={n.id}
            className="w-full flex items-center gap-4 shadow-md bg-white rounded-3xl p-4"
          >
            {/* Avatar */}
            <img
              src={n.avatar}
              className="w-12 h-12 rounded-full object-cover border"
              alt="avatar"
            />

            {/* Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-lg">
                {n.icon}
                <span className="font-medium">{n.text}</span>
              </div>
              <div className="text-sm text-gray-500">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
