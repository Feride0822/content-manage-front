import { CiHeart } from 'react-icons/ci'
import { FaRegComment } from 'react-icons/fa'
import { SlUserFollow } from 'react-icons/sl'

function Notification() {

  const notifications = [
    {
      type: "like",
      text: `liked your post: "bla bla"`,
      icon: <CiHeart size={35} color="red" />,
      time: "21h ago",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      type: "comment",
      text: `commented to your post: "bla bla"`,
      icon: <FaRegComment size={30} color="green" />,
      time: "21h ago",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      type: "follow",
      text: `started following you`,
      icon: <SlUserFollow size={30} color="blue" />,
      time: "21h ago",
      avatar: "https://i.pravatar.cc/150?img=18",
    },
  ];

  return (
    <div className="w-full flex justify-center pt-3">
      <div className="bg-gray-50 flex flex-col gap-3 w-1/2 min-h-screen rounded-4xl px-3">

        {notifications.map((n, i) => (
          <div
            key={i}
            className="w-full flex items-center gap-4 shadow-md bg-white rounded-3xl p-4"
          >
            {/* Avatar */}
            <img
              src={n.avatar}
              className="w-12 h-12 rounded-full object-cover border"
              alt="avatar"
            />

            {/* Middle text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-lg">
                {n.icon}
                <span className="font-medium">user {n.text}</span>
              </div>

              <div className="text-sm text-gray-500">{n.time}</div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Notification;
