import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/post";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const hasMore = useRef(true);
  const isFetching = useRef(false);

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

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setOffset((prev) => prev + 1);
  };

  // Delete post from UI
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

      {/* Create post */}
      <PostForm onPostCreated={handlePostCreated} />

      {/* Posts */}
      {posts.map((post, index) => (
        <PostCard key={index} post={post} onDelete={handleDeleted} />
      ))}

      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
};

export default PostList;
