import { BsChat } from "react-icons/bs";
import { FiLogOut, FiUser } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbBrandSafari } from "react-icons/tb";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getMe } from "../api/user";
import { useEffect, useState } from "react";
import { useWebSocket } from "../providers/WebSocketProvider";

function Navbar() {
  const [me, setMe] = useState();
  const [unreadCount, setUnreadCount] = useState(0);
  const { socketService } = useWebSocket();
  const location = useLocation();

  const getUserMe = async () => {
    const res = await getMe();
    setMe(res);
  };

  useEffect(() => {
    getUserMe();
  }, []);

  // Listen for notifications and update counter
  useEffect(() => {
    if (!socketService) return;

    console.log("🔔 [Navbar] Setting up notification counter");

    const unsubscribe = socketService.on("notification", (notificationData) => {
      console.log("🔔 [Navbar] New notification, incrementing counter");

      // Only increment if not on notifications page
      if (location.pathname !== "/notification") {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      console.log("🔔 [Navbar] Cleaning up notification counter");
      unsubscribe();
    };
  }, [socketService, location.pathname]);

  // Reset counter when visiting notifications page
  useEffect(() => {
    if (location.pathname === "/notification") {
      console.log("🔔 [Navbar] On notifications page, resetting counter");
      setUnreadCount(0);
    }
  }, [location.pathname]);

  const data = [
    { icon: HiOutlineHome, path: "/" },
    { icon: TbBrandSafari, path: "/explore" },
    // { icon: BsChat, path: "/chat" },
    {
      icon: IoMdNotificationsOutline,
      path: "/notification",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { icon: FiUser, path: `/profile/${me?.id}` },
    { icon: FiLogOut, path: "/login" },
  ];

  return (
    <div className="w-full h-16 border-b-2 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-full flex w-full justify-between items-center">
        {/* Logo */}
        <div className="flex gap-4 items-center">
          <Link
            to={"/"}
            className="flex items-center justify-center gap-3 hover:opacity-80 transition-opacity"
          >
            <FiUser size={28} color="#3b82f6" />
            <h4 className="text-xl font-bold text-gray-800">
              Anonymous Social
            </h4>
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="w-auto">
          <ul className="flex cursor-pointer items-center h-full gap-8">
            {data.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="flex relative">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `p-2 rounded-lg transition-colors ${
                        isActive
                          ? "text-blue-500 bg-blue-50"
                          : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                      }`
                    }
                  >
                    <Icon size={26} />

                    {/* Notification Badge */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
