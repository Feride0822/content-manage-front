import { BsChat } from "react-icons/bs";
import { FiLogOut, FiUser } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbBrandSafari } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { getMe } from "../api/user";
import { useEffect, useState } from "react";

function Navbar() {
  const [me, setMe] = useState();

  const getUserMe = async () => {
    const res = await getMe();
    setMe(res);
  };

  useEffect(() => {
    getUserMe();
  }, []);

  const data = [
    { icon: HiOutlineHome, path: "/" },
    { icon: TbBrandSafari, path: "/explore" },
    { icon: BsChat, path: "/chat" },
    { icon: IoMdNotificationsOutline, path: "/notification" },
    { icon: FiUser, path: `/profile/${me?.id}` },
    { icon: FiLogOut, path: "/login" },
  ];

  return (
    <div className="w-full h-15 border-b-2">
      <div className="container mx-auto px-15 h-full flex w-full justify-between">
        <div className="flex gap-4 items-center">
          <Link to={"/"} className="flex items-center justify-center gap-3">
            <FiUser color="blue" />
            <h4>Anonymous Social</h4>
          </Link>
        </div>

        <div className="w-1/4">
          <ul className="flex cursor-pointer w-full items-center h-full justify-between">
            {data.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="flex">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "text-green-300" : ""
                    }
                  >
                    <Icon size={25} />
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
