import { useState } from "react";

function Explore() {
  const [users, setUsers] = useState([
    {
      username: "abcd",
      posts: 1,
      followers: 1,
      following: true,
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      username: "Amara",
      posts: 1,
      followers: 1,
      following: true,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      username: "Dhshshsh",
      posts: 0,
      followers: 1,
      following: true,
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    {
      username: "user25867",
      posts: 0,
      followers: 0,
      following: false,
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      username: "user25484",
      posts: 1,
      followers: 0,
      following: false,
      avatar: "https://i.pravatar.cc/150?img=20",
    },
  ]);

  const toggleFollow = (index) => {
    const updated = [...users];
    updated[index].following = !updated[index].following;
    setUsers(updated);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-5 space-y-3">
      {users.map((user, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border"
        >
          {/* Left user info */}
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />

            <div>
              <h4 className="font-medium">{user.username}</h4>
              <p className="text-sm text-gray-500">
                {user.posts} posts • {user.followers}
                {user.followers === 1 ? " follower" : " followers"}
              </p>
            </div>
          </div>

          {/* Follow / Unfollow button */}
          <button
            onClick={() => toggleFollow(index)}
            className={`px-4 py-1 rounded-xl border transition-all ${
              user.following
                ? "bg-white border-gray-300 text-gray-700"
                : "bg-black text-white"
            }`}
          >
            {user.following ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Explore;
