import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/post";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { useAuth } from "../context/AuthContext"; // assuming you have AuthContext

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const hasMore = useRef(true);
  const isFetching = useRef(false);

  const { user } = useAuth(); // current logged-in user

  const [editingPost, setEditingPost] = useState(null); // currently editing post

  // Fetch posts from API
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
      console.error("Error while fetching posts", err);
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

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setOffset((prev) => prev + 1);
    fetchPosts();
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
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
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

      {/* Top PostForm for creating new or editing existing post */}
      <PostForm
        key={editingPost?.id || "new"}
        postId={editingPost?.id || null}
        initialContent={editingPost?.content || ""}
        initialFiles={editingPost?.imageUrls?.map((img) => img.url) || []}
        onPostCreated={handlePostCreated}
        onPostUpdated={handlePostUpdated}
        onCancel={handleCancelEdit}
      />

      {/* Posts list */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={user?.id} // pass current user ID for owner check
          onEdit={handleEditPost}
          onDelete={handleDeleted}
        />
      ))}

      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
};

export default PostList;
