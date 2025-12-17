import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { IoHeart } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import userAvatarImg from "../../public/user.jpeg";
import CommentList from "./CommentList";
import { toggleLike, checkLiked, getLikers } from "../api/like";
import LikersTooltip from "./LikersTooltip";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?._count?.likes || 0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [likers, setLikers] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  // Fetch like status on mount
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await checkLiked(post.id);
        setLiked(res.liked);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLikeStatus();
  }, [post.id]);

  // Toggle like logic
  const handleToggleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await toggleLike(post.id);
      setLiked(res.liked);
      // Optionally update likesCount from response
      setLikesCount((prev) => (res.liked ? prev : prev));
    } catch (err) {
      console.error(err);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  const handleMouseEnter = async () => {
    const timeout = setTimeout(async () => {
      if (likers.length === 0) {
        try {
          const data = await getLikers(post.id);
          setLikers(data);
        } catch (err) {
          console.error(err);
        }
      }
      setShowTooltip(true);
    }, 300); // 300ms delay
    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    setShowTooltip(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 mt-5 px-5 pb-10 relative">
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatarUrl || userAvatarImg}
            alt={post.user.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <span className="font-semibold">{post.user.displayName}</span>
            {post.user.username && (
              <div className="text-gray-500 text-sm">@{post.user.username}</div>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700">{post.content}</p>

        {/* Images */}
        {post.imageUrls?.length > 0 && (
          <img
            src={post.imageUrls[0].url}
            className="w-full h-52 object-cover rounded-xl"
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 text-gray-500 items-center relative">
          {/* Like button */}
          <div className="relative">
            <button
              className={`flex gap-1 items-center justify-between ${
                liked ? "text-red-500" : ""
              }`}
              onClick={handleToggleLike}
              disabled={loadingLike}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {liked ? <IoHeart size={26} /> : <CiHeart size={28} />}
              <span>{likesCount}</span>
            </button>

            {/* Tooltip / Popover */}
            <LikersTooltip likers={likers} show={showTooltip} />
          </div>

          {/* Comments button */}
          <button
            className="flex gap-1 items-center justify-between"
            onClick={() => setShowComments((v) => !v)}
          >
            <FaRegComment size={20} />
            <span>{post?._count?.comments}</span>
          </button>

          {/* Views */}
          <button className="flex gap-1 items-center justify-between">
            <MdOutlineRemoveRedEye size={28} />
            <span>{post?._count?.views}</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && <CommentList postId={post.id} />}
      </div>
    </div>
  );
};

export default PostCard;
