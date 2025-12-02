import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function Profile() {
  return (
    <div className="w-1/2 mx-auto flex flex-col bg-white p-6 rounded-xl shadow-md">

      <div className="flex items-center justify-between">

        {/* LEFT PART */}
        <div className="flex items-center gap-4">

          {/* PROFILE IMAGE */}
          <img
            src="https://via.placeholder.com/80"
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          {/* NAME + FOLLOW INFO */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Your Name
            </h2>

            <div className="flex gap-6 text-gray-600 text-sm mt-1">
              <p>
                <span className="font-semibold">120</span> Followers
              </p>
              <p>
                <span className="font-semibold">80</span> Following
              </p>
            </div>
          </div>

        </div>

        {/* EDIT BUTTON */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Edit Profile
        </button>

      </div>

      <p>Post</p>

      <div className="w-full flex flex-col gap-5 mt-5 px-5 pb-10">
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">John Doe</span>
              </div>
              <div className="relative text-3xl">
                <button className="text-gray-500 hover:text-gray-950">⋮</button>
              </div>
            </div>

            {/* Post Text */}
            <p className="text-gray-700">
              This is a demo post text. User can write anything here.
            </p>

            {/* Post Image */}
            <img
              src="https://picsum.photos/400/200"
              alt="post"
              className="w-full rounded-2xl object-cover"
            />

            {/* Bottom Buttons */}
            <div className="flex w-1/3 justify-around items-center text-gray-500 mt-2">
              <CiHeart size={30}/>
              <FaRegComment size={25}/>
              <MdOutlineRemoveRedEye size={30}/>
            </div>
          </div>
      </div>

    </div>
  );
}
