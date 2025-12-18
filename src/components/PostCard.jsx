import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { IoHeart } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import userAvatarImg from "../../public/user.jpeg";
import CommentList from "./CommentList";
import LikersTooltip from "./LikersTooltip";
import ViewersTooltip from "./ViewerToolTip";
import { toggleLike, checkLiked, getLikers } from "../api/like";
import { createView, checkViewed, getViewers } from "../api/view";
import { deletePost } from "../api/post";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ post, currentUserId, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Likes
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?._count?.likes || 0);
  const [likers, setLikers] = useState([]);
  const [showLikersTooltip, setShowLikersTooltip] = useState(false);

  // Views
  const [viewsCount, setViewsCount] = useState(post?._count?.views || 0);
  const [viewed, setViewed] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [showViewersTooltip, setShowViewersTooltip] = useState(false);

  // Timestamp
  const [timeAgo, setTimeAgo] = useState(
    formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
  );

  const isEdited = post.updatedAt && post.updatedAt !== post.created_at;
  const isOwner = post.user.id === currentUserId;

  // Update timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(
        formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, [post.created_at]);

  // Fetch initial like status
  useEffect(() => {
    (async () => {
      try {
        const res = await checkLiked(post.id);
        setLiked(res.liked);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [post.id]);

  // Handle post view per user
  useEffect(() => {
    let timer;

    const init = async () => {
      try {
        const res = await checkViewed(post.id);
        if (res.viewed) {
          setViewed(true); // already viewed, skip POST
          return;
        }

        const el = document.getElementById(`post-${post.id}`);
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry], obs) => {
            if (entry.isIntersecting) {
              timer = setTimeout(async () => {
                try {
                  await createView(post.id);
                  setViewsCount((v) => v + 1);
                  setViewed(true);
                } catch (err) {
                  console.error(err);
                } finally {
                  if (timer) clearTimeout(timer);
                  obs.unobserve(entry.target);
                }
              }, 3000);
            }
          },
          { threshold: 0.6 }
        );

        observer.observe(el);
      } catch (err) {
        console.error("Failed to check viewed status", err);
      }
    };

    init();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [post.id]);

  // Optimistic like toggle
  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    toggleLike(post.id).catch(() => {
      // rollback on failure
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    });
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      onDelete?.(post.id);
    } catch (err) {
      console.error("Failed to delete post", err);
      alert("Failed to delete post. Try again.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleMouseEnterLikers = async () => {
    if (likers.length === 0) {
      const data = await getLikers(post.id);
      setLikers(data);
    }
    setShowLikersTooltip(true);
  };
  const handleMouseLeaveLikers = () => setShowLikersTooltip(false);

  const handleMouseEnterViews = async () => {
    if (viewers.length === 0) {
      const data = await getViewers(post.id);
      setViewers(data);
    }
    setShowViewersTooltip(true);
  };
  const handleMouseLeaveViews = () => setShowViewersTooltip(false);

  return (
    <div
      id={`post-${post.id}`}
      className="w-full flex flex-col gap-5 mt-5 px-5 pb-10 relative"
    >
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatarUrl || userAvatarImg}
            alt={post.user.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{post.user.displayName}</span>
            {post.user.username && (
              <span className="text-gray-500 text-sm">
                @{post.user.username}
              </span>
            )}
          </div>

          {isOwner && (
            <div className="ml-auto flex gap-2 relative">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => onEdit?.(post)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </button>

              {showDeleteConfirm && (
                <div className="absolute top-6 right-0 bg-white border rounded-xl shadow-md p-3 flex flex-col gap-2 w-48 z-50">
                  <p className="text-sm text-gray-700">
                    Are you sure you want to delete?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-2 py-1 cursor-pointer text-sm bg-gray-200 rounded-xl hover:bg-gray-300"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-2 py-1 cursor-pointer text-sm bg-red-500 text-white rounded-xl hover:bg-red-600"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-700">{post.content}</p>
        {post.imageUrls?.length > 0 && (
          <img
            src={post.imageUrls[0].url}
            className="w-full h-52 object-cover rounded-xl"
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 text-gray-500 items-center relative justify-between">
          <div className="flex gap-4 items-center">
            {/* Likes */}
            <div className="relative">
              <button
                className={`flex gap-1 items-center cursor-pointer ${
                  liked ? "text-red-500" : ""
                }`}
                onClick={handleToggleLike}
                onMouseEnter={handleMouseEnterLikers}
                onMouseLeave={handleMouseLeaveLikers}
              >
                {liked ? <IoHeart size={26} /> : <CiHeart size={28} />}
                <span>{likesCount}</span>
              </button>
              <LikersTooltip likers={likers} show={showLikersTooltip} />
            </div>

            {/* Comments */}
            <button
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => setShowComments((v) => !v)}
            >
              <FaRegComment size={20} />
              <span>{post?._count?.comments}</span>
            </button>

            {/* Views */}
            <div className="relative">
              <button
                className="flex gap-1 items-center cursor-pointer"
                onMouseEnter={handleMouseEnterViews}
                onMouseLeave={handleMouseLeaveViews}
              >
                <MdOutlineRemoveRedEye size={28} />
                <span>{viewsCount}</span>
              </button>
              <ViewersTooltip viewers={viewers} show={showViewersTooltip} />
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-gray-400 text-xs">
            {timeAgo} {isEdited && "(edited)"}
          </span>
        </div>

        {showComments && <CommentList postId={post.id} />}
      </div>
    </div>
  );
};

export default PostCard;
