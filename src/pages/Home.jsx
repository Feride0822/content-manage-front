import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
    setMenuOpen(false);
  };

  const savePicture = () => {
    const imageUrl = "https://picsum.photos/400/200";
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "post-image.jpg";
    a.click();
    setMenuOpen(false);
  };

  return (
    <div className="w-full flex justify-center pt-10">
      <div className="flex w-1/2 min-h-screen flex-col rounded-4xl items-center bg-gray-50">

        {/* CREATE POST */}
        <div className="w-full rounded-4xl flex flex-col gap-5 shadow-2xl bg-white p-5">
          <div className="px-5">
            <textarea
              className="w-full bg-gray-300 rounded-2xl resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 p-3"
              rows="6"
              placeholder="What's on your mind?"
            ></textarea>
          </div>

          <form className="flex w-full justify-between items-center px-5">
            <label className="flex flex-col items-center justify-center w-28 h-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <svg
                className="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0H4m3 0h3m-3 0v12m0 0l3-3m-3 3l-3-3"
                />
              </svg>
              <span className="text-gray-500 text-sm text-center">Add Image</span>
              <input type="file" accept=".jpg,.png,.svg" className="hidden" />
            </label>

            <button className="px-10 py-3 rounded-2xl bg-gray-600 text-white hover:bg-gray-700 transition">
              Post
            </button>
          </form>
        </div>

        {/* POSTS */}
        <div className="w-full flex flex-col gap-5 mt-5 px-5 pb-10">
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">John Doe</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-500 hover:text-gray-950 text-3xl"
                >
                  ⋮
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-xl border z-50 overflow-hidden">
                    <button
                      onClick={copyLink}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={savePicture}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Save Picture
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Text */}
            <p className="text-gray-700">
              This is a demo post text. User can write anything here.
            </p>

            {/* Image */}
            <img
              src="https://picsum.photos/400/200"
              alt="post"
              className="w-full rounded-2xl object-cover"
            />

            {/* Bottom buttons */}
            <div className="flex w-1/3 justify-around items-center text-gray-500 mt-2">
              <CiHeart size={30} />
              <FaRegComment size={25} />
              <MdOutlineRemoveRedEye size={30} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
