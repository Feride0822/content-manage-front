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
  const [editingPost, setEditingPost] = useState(null);

  // Fetch posts from API
  const fetchPosts = async (reset = false) => {
    if (!hasMore.current || isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    try {
      const res = await getPosts({ limit, offset: reset ? 0 : offset });
      if (res.data.length < limit) hasMore.current = false;
      setPosts((prev) => (reset ? res.data : [...prev, ...res.data]));
      setOffset(reset ? res?.data?.length : offset + limit);
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

  // Infinite scroll
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

  // Socket event listeners
  useEffect(() => {
    if (!socketService) return;

    // Post created
    const unsubscribeCreated = socketService.on("post:created", (newPost) => {
      console.log("📝 New post via socket", newPost);

      setPosts((prev) => {
        const existingPost = prev.find((p) => p.id === newPost.id);

        if (existingPost) {
          return prev.map((p) => {
            if (p.id === newPost.id) {
              return {
                ...p,
                ...newPost,
                imageUrls:
                  newPost.imageUrls?.length > 0
                    ? newPost.imageUrls
                    : p.imageUrls || [],
                _count: newPost._count ||
                  p._count || { likes: 0, comments: 0, views: 0 },
              };
            }
            return p;
          });
        }

        const normalizedPost = {
          ...newPost,
          imageUrls: newPost.imageUrls || [],
          _count: newPost._count || { likes: 0, comments: 0, views: 0 },
          user: newPost.user || {},
          comments: newPost.comments || [],
          likes: newPost.likes || [],
          views: newPost.views || [],
        };

        return [normalizedPost, ...prev];
      });

      setOffset((prev) => prev + 1);
    });

    // Post updated
    const unsubscribeUpdated = socketService.on(
      "post:updated",
      (updatedPost) => {
        console.log("✏️ Post updated via socket", updatedPost);

        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === updatedPost.id) {
              return {
                ...p,
                ...updatedPost,
                imageUrls:
                  updatedPost.imageUrls?.length > 0
                    ? updatedPost.imageUrls
                    : p.imageUrls || [],
                _count: updatedPost._count ||
                  p._count || { likes: 0, comments: 0, views: 0 },
              };
            }
            return p;
          })
        );
      }
    );

    // Post deleted
    const unsubscribeDeleted = socketService.on(
      "post:deleted",
      ({ postId }) => {
        console.log("🗑️ Post deleted via socket", postId);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setOffset((prev) => Math.max(0, prev - 1));
      }
    );

    // Like created
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

    // Like removed
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

    // Comment created
    const unsubscribeCommentCreated = socketService.on(
      "comment:created",
      (comment) => {
        console.log("💬 Comment added via socket", comment);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === comment.postId) {
              return {
                ...p,
                _count: {
                  ...p._count,
                  comments: (p._count?.comments || 0) + 1,
                },
              };
            }
            return p;
          })
        );
      }
    );

    // Comment deleted
    const unsubscribeCommentDeleted = socketService.on(
      "comment:deleted",
      ({ commentId, postId }) => {
        console.log("🗑️ Comment deleted via socket", commentId);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                _count: {
                  ...p._count,
                  comments: Math.max(0, (p._count?.comments || 0) - 1),
                },
              };
            }
            return p;
          })
        );
      }
    );

    // View created
    const unsubscribeViewCreated = socketService.on(
      "view:created",
      ({ view, postId }) => {
        console.log("👁️ View added via socket", view, "for post", postId);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              console.log(
                `📊 Updating view count for post ${postId}: ${
                  p._count?.views || 0
                } → ${(p._count?.views || 0) + 1}`
              );
              return {
                ...p,
                _count: {
                  ...p._count,
                  views: (p._count?.views || 0) + 1,
                },
              };
            }
            return p;
          })
        );
      }
    );

    // Cleanup all listeners
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeLikeCreated();
      unsubscribeLikeRemoved();
      unsubscribeCommentCreated();
      unsubscribeCommentDeleted();
      unsubscribeViewCreated();
    };
  }, [socketService]);

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    const normalizedPost = {
      ...newPost,
      imageUrls: newPost.imageUrls || [],
      _count: newPost._count || { likes: 0, comments: 0, views: 0 },
      user: newPost.user || {},
      comments: newPost.comments || [],
      likes: newPost.likes || [],
      views: newPost.views || [],
    };

    setPosts((prev) => {
      if (prev.some((p) => p.id === normalizedPost.id)) {
        console.log("Post already exists, updating instead");
        return prev.map((p) =>
          p.id === normalizedPost.id ? normalizedPost : p
        );
      }
      return [normalizedPost, ...prev];
    });
    setOffset((prev) => prev + 1);
  };

  // Handle post deletion
  const handleDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setOffset((prev) => Math.max(0, prev - 1));
    if (editingPost?.id === id) setEditingPost(null);
  };

  // Trigger edit mode
  const handleEditPost = (post) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle post update
  const handlePostUpdated = (updatedPost) => {
    const normalizedPost = {
      ...updatedPost,
      imageUrls: updatedPost.imageUrls || [],
      _count: updatedPost._count || { likes: 0, comments: 0, views: 0 },
    };

    setPosts((prev) =>
      prev.map((p) => (p.id === normalizedPost.id ? normalizedPost : p))
    );
    setEditingPost(null);
  };

  // Cancel editing
  const handleCancelEdit = () => setEditingPost(null);

  return (
    <div className="space-y-4 w-full">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <PostForm onPostCreated={handlePostCreated} />

      {posts.map((post, index) => (
        <PostCard
          key={post?.id}
          post={post}
          onDelete={handleDeleted}
          currentUserId={currentUserId}
        />
      ))}

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500">No posts yet. Create one!</p>
      )}
    </div>
  );
}
