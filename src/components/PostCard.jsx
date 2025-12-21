import React, { useEffect, useState, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { IoHeart } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { toggleLike, checkLiked } from "../api/like";
import { createView, checkViewed } from "../api/view";
import CommentList from "./CommentList";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

export default function PostCard({ post, onDelete, currentUserId }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const viewChecked = useRef(false);

  post.imageUrls = post.imageUrls || [];
  post._count = post._count || { likes: 0, comments: 0, views: 0 };
  // Check if user liked
  useEffect(() => {
    let mounted = true;

    const fetchLiked = async () => {
      try {
        const res = await checkLiked(post.id);
        if (mounted) setLiked(res.liked);
      } catch (e) {
        console.error(e);
      }
    };

    fetchLiked();
    return () => (mounted = false);
  }, [post.id]);

  useEffect(() => {
    if (viewChecked.current) return;

    let mounted = true;

    const handleView = async () => {
      try {
        const viewedPosts = JSON.parse(
          localStorage.getItem("viewedPosts") || "[]"
        );

        if (viewedPosts.includes(post.id)) {
          console.log(`Already viewed post ${post.id} (from localStorage)`);
          viewChecked.current = true;
          return;
        }

        // Check backend
        const res = await checkViewed(post.id);

        if (mounted) {
          if (!res.viewed) {
            console.log(`👁️ Creating view for post ${post.id}`);
            await createView(post.id);

            // Save to localStorage
            viewedPosts.push(post.id);
            localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));

            viewChecked.current = true;
          } else {
            console.log(`Already viewed post ${post.id} (from backend)`);

            // Save to localStorage for future
            if (!viewedPosts.includes(post.id)) {
              viewedPosts.push(post.id);
              localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
            }

            viewChecked.current = true;
          }
        }
      } catch (e) {
        console.error(" Error handling view:", e);
      }
    };

    handleView();
    return () => {
      mounted = false;
    };
  }, [post.id]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    // optimistic icon toggle ONLY
    setLiked((prev) => !prev);

    try {
      const res = await toggleLike(post.id);
      setLiked(res.liked); // backend truth
    } catch (e) {
      console.error(e);
      setLiked((prev) => !prev); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 space-y-3">
      {/* User */}
      <div className="text-sm font-medium text-gray-700">
        <Link to={`/profile/${post?.user?.id}`} className="hover:underline">
          {post?.user?.pseudoname}
        </Link>
      </div>

      {/* Content */}
      <div className="text-gray-800 text-sm sm:text-base wrap-break-words">
        {post.content}
      </div>

      {/* Images */}
      {Array.isArray(post.imageUrls) && post.imageUrls.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1}>
          {post.imageUrls.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img.url}
                className="
                  w-full
                  rounded-lg
                  max-h-[300px]
                  sm:max-h-[400px]
                  object-cover
                "
                alt=""
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 mt-2 text-gray-600 text-sm">
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          {liked ? <IoHeart size={20} color="red" /> : <CiHeart size={20} />}
          <span>{post._count?.likes || 0}</span>
        </button>

        <div className="flex items-center gap-1">
          <FaRegComment size={18} />
          <span>{post._count?.comments || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <MdOutlineRemoveRedEye size={20} />
          <span>{post._count?.views || 0}</span>
        </div>
      </div>

      <CommentList postId={post.id} />
    </div>
  );
}
