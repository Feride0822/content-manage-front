import React, { useState, useEffect, useRef } from "react";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { getPosts } from "../api/post";
import { useWebSocket } from "../providers/WebSocketProvider";

export default function PostList({ currentUserId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const hasMore = useRef(true);
  const isFetching = useRef(false);

  const { socketService } = useWebSocket();

  const fetchPosts = async () => {
    if (!hasMore.current || isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    try {
      const res = await getPosts({ limit, offset });
      if (res.data.length < limit) hasMore.current = false;
      setPosts((prev) => [...prev, ...res.data]);
      setOffset((prev) => prev + limit);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching posts");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 50
        ) {
          fetchPosts();
        }
      }, 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Socket events
  useEffect(() => {
    if (!socketService) return;

    const unsubscribeCreated = socketService.on("post:created", (newPost) => {
      console.log("🟢 New post via socket", newPost);
      setPosts((prev) => {
        // Avoid duplicates
        if (prev.some((p) => p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
      setOffset((prev) => prev + 1);
    });

    const unsubscribeUpdated = socketService.on(
      "post:updated",
      (updatedPost) => {
        console.log("🔄 Post updated via socket", updatedPost);
        setPosts((prev) =>
          prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        );
      }
    );

    const unsubscribeDeleted = socketService.on(
      "post:deleted",
      ({ postId }) => {
        console.log("🗑️ Post deleted via socket", postId);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setOffset((prev) => Math.max(0, prev - 1));
      }
    );

    // Update like counts from WebSocket (for other users' likes)
    const unsubscribeLikeCreated = socketService.on(
      "like:created",
      ({ like, post: updatedPost }) => {
        console.log("❤️ Like added via socket", like);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === updatedPost.id) {
              return {
                ...p,
                _count: {
                  ...p._count,
                  likes:
                    updatedPost._count?.likes || (p._count?.likes || 0) + 1,
                },
              };
            }
            return p;
          })
        );
      }
    );

    const unsubscribeLikeRemoved = socketService.on(
      "like:removed",
      ({ postId }) => {
        console.log("💔 Like removed via socket", postId);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                _count: {
                  ...p._count,
                  likes: Math.max(0, (p._count?.likes || 0) - 1),
                },
              };
            }
            return p;
          })
        );
      }
    );

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeLikeCreated();
      unsubscribeLikeRemoved();
    };
  }, [socketService]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => {
      // Avoid duplicates
      if (prev.some((p) => p.id === newPost.id)) return prev;
      return [newPost, ...prev];
    });
    setOffset((prev) => prev + 1);
  };

  const handleDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setOffset((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="space-y-4 w-full">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <PostForm onPostCreated={handlePostCreated} />

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDeleted}
          currentUserId={currentUserId}
        />
      ))}

      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
}
