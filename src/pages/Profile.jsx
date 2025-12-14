import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function Profile() {
  // Profile modal state
  const [open, setOpen] = useState(false);

  // Profile fields
  const [name, setName] = useState("Your Name");
  const [followers] = useState(120);
  const [following] = useState(80);

  // Profile image state
  const [profileImg, setProfileImg] = useState("https://via.placeholder.com/80");

  // Handle profile image change
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  // =============================
  // POST STATES
  // =============================
  const [menuOpen, setMenuOpen] = useState(false);
  const [editPostModal, setEditPostModal] = useState(false);
  const [postText, setPostText] = useState(
    "This is a demo post text. User can write anything here."
  );

  // LIKE STATE
  const [liked, setLiked] = useState(false);

  // COMMENT MODAL
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  // VIEW MODAL
  const [viewOpen, setViewOpen] = useState(false);

  const deletePost = () => {
    alert("Post deleted!");
    setMenuOpen(false);
  };

  return (
    <>
      {/* PROFILE SECTION */}
      <div className="w-1/2 mx-auto flex flex-col bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profileImg}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            <div>
              <h2 className="text-xl font-semibold text-gray-800">{name}</h2>

              <div className="flex gap-6 text-gray-600 text-sm mt-1">
                <p>
                  <span className="font-semibold">{followers}</span> Followers
                </p>
                <p>
                  <span className="font-semibold">{following}</span> Following
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>

        <p className="mt-5 font-semibold">Posts</p>

        {/* POST CARD */}
        <div className="w-full flex flex-col gap-5 mt-4 px-5 pb-10">
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
            {/* POST HEADER */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">John Doe</span>
              </div>

              {/* MENU */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-500 hover:text-gray-950 text-3xl"
                >
                  ⋮
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 border z-50">
                    <button
                      onClick={() => {
                        setEditPostModal(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={deletePost}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* POST TEXT */}
            <p className="text-gray-700">{postText}</p>

            {/* POST IMAGE */}
            <img
              src="https://picsum.photos/400/200"
              alt="post"
              className="w-full rounded-2xl object-cover cursor-pointer"
              onClick={() => setViewOpen(true)}
            />

            {/* ACTIONS */}
            <div className="flex w-1/3 justify-around items-center text-gray-500 mt-2">
              {/* LIKE BTN */}
              <CiHeart
                size={30}
                className={`cursor-pointer transition ${
                  liked ? "text-red-600 scale-110" : ""
                }`}
                onClick={() => setLiked(!liked)}
              />

              {/* COMMENT BTN */}
              <FaRegComment
                size={25}
                className="cursor-pointer"
                onClick={() => setCommentOpen(true)}
              />

              {/* VIEW BTN */}
              <MdOutlineRemoveRedEye
                size={30}
                className="cursor-pointer"
                onClick={() => setViewOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Edit Profile</h2>

            <div className="flex flex-col items-center gap-3">
              <img
                src={profileImg}
                className="w-24 h-24 rounded-full object-cover border"
                alt="preview"
              />

              <input
                type="file"
                id="profilePicInput"
                onChange={handleImgChange}
                className="hidden"
              />

              <label
                htmlFor="profilePicInput"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Edit Picture
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT POST MODAL */}
      {editPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Edit Post</h2>

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="border p-3 rounded-lg resize-none h-32"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditPostModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => setEditPostModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENT MODAL */}
      {commentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Comments</h2>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border p-3 rounded-lg resize-none h-28"
              placeholder="Write a comment..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCommentOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>

              <button
                onClick={() => setCommentText("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setViewOpen(false)}
        >
          <img
            src="https://picsum.photos/500/300"
            className="rounded-2xl max-w-xl shadow-2xl"
            alt="view"
          />
        </div>
      )}
    </>
  );
}
