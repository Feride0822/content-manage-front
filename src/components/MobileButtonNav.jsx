import { NavLink, useLocation } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { TbBrandSafari } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { useWebSocket } from "../providers/WebSocketProvider";
import { useEffect, useState } from "react";
import { getMe } from "../api/user";

export default function MobileBottomNav() {
  const [me, setMe] = useState();
  const [unread, setUnread] = useState(0);
  const { socketService } = useWebSocket();
  const location = useLocation();

  useEffect(() => {
    getMe().then(setMe);
  }, []);

  useEffect(() => {
    if (!socketService) return;

    const unsub = socketService.on("notification", () => {
      if (location.pathname !== "/notification") {
        setUnread((p) => p + 1);
      }
    });

    return unsub;
  }, [socketService, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/notification") {
      setUnread(0);
    }
  }, [location.pathname]);

  const items = [
    { icon: HiOutlineHome, path: "/" },
    { icon: TbBrandSafari, path: "/explore" },
    {
      icon: IoMdNotificationsOutline,
      path: "/notification",
      badge: unread,
    },
    { icon: FiUser, path: `/profile/${me?.id}` },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <ul className="flex justify-around items-center h-14">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i} className="relative">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `p-2 ${isActive ? "text-blue-600" : "text-gray-500"}`
                }
              >
                <Icon size={26} />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
