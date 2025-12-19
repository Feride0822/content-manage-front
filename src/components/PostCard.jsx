import React, { useState, useEffect, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { IoHeart } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { toggleLike, checkLiked } from "../api/like";
import CommentList from "./CommentList";
import { useWebSocket } from "../providers/WebSocketProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function PostCard({ post, onDelete, currentUserId }) {
  const { socketService } = useWebSocket();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const ignoreNextSocketEvent = useRef(false);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await checkLiked(post.id);
        setLiked(res.liked);
      } catch (err) {
        console.error("Error checking liked status:", err);
      }
    };
    fetchLiked();
  }, [post.id]);

  useEffect(() => {
    if (!isTogglingLike) {
      setLikesCount(post._count?.likes || 0);
    }
  }, [post._count?.likes, isTogglingLike]);

  useEffect(() => {
    if (!socketService) return;

    const unsubscribeCreated = socketService.on(
      "like:created",
      ({ like, post: updatedPost }) => {
        if (updatedPost.id === post.id) {
          console.log("🔔 Like added via socket:", like);

          if (ignoreNextSocketEvent.current && like.userId === currentUserId) {
            ignoreNextSocketEvent.current = false;
            return;
          }

          if (like.userId !== currentUserId) {
            setLikesCount(updatedPost._count?.likes || 0);
          }
        }
      }
    );

    const unsubscribeRemoved = socketService.on(
      "like:removed",
      ({ postId, userId }) => {
        if (postId === post.id) {
          console.log("🔔 Like removed via socket by user:", userId);

          if (ignoreNextSocketEvent.current && userId === currentUserId) {
            ignoreNextSocketEvent.current = false;
            return;
          }

          if (userId !== currentUserId) {
            setLikesCount((prev) => Math.max(0, prev - 1));
          }
        }
      }
    );

    return () => {
      unsubscribeCreated();
      unsubscribeRemoved();
    };
  }, [socketService, post.id, currentUserId]);

  const handleLike = async () => {
    if (isTogglingLike) return;

    setIsTogglingLike(true);
    ignoreNextSocketEvent.current = true; 

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? Math.max(0, likesCount - 1) : likesCount + 1);

    try {
      const res = await toggleLike(post.id);
      console.log("✅ Like toggled successfully:", res);

      setLiked(res.liked);
    } catch (err) {
      console.error("❌ Error toggling like:", err);

      setLiked(previousLiked);
      setLikesCount(previousCount);
      ignoreNextSocketEvent.current = false;
    } finally {
      setIsTogglingLike(false);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{post.user.displayName}</span>
        <button
          onClick={() => onDelete(post.id)}
          className="text-red-500 text-sm"
        >
          Delete
        </button>
      </div>

      <div>{post.content}</div>

      {/* Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1}>
          {post.imageUrls?.map((url, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={url?.url}
                className="w-full rounded-lg max-h-80 object-cover"
                alt={`post-img-${idx}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-1"
          disabled={isTogglingLike}
        >
          {liked ? <IoHeart color="red" size={24} /> : <CiHeart size={24} />}
          <span>{likesCount}</span>
        </button>

        <button className="flex items-center gap-1">
          <FaRegComment /> <span>{post._count?.comments || 0}</span>
        </button>

        <button className="flex items-center gap-1">
          <MdOutlineRemoveRedEye /> <span>{post._count?.views || 0}</span>
        </button>
      </div>

      <CommentList postId={post.id} />
    </div>
  );
}
