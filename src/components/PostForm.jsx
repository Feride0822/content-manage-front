import { useState, useEffect } from "react";
import { createPost, updatePost } from "../api/post";

export default function PostForm({
  postId = null, // if editing
  initialContent = "",
  initialFiles = [], // existing image URLs
  onPostCreated,
  onPostUpdated,
  onCancel, // callback when cancel editing
}) {
  const [content, setContent] = useState(initialContent);
  const [newFiles, setNewFiles] = useState([]); // new files to upload
  const [existingImages, setExistingImages] = useState(initialFiles); // existing URLs
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update previews whenever new files or existing images change
  useEffect(() => {
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...existingImages, ...newPreviews]);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newFiles, existingImages]);

  // Reset state when editing a different post
  useEffect(() => {
    setContent(initialContent);
    setExistingImages(initialFiles);
    setNewFiles([]);
  }, [initialContent, initialFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && newFiles.length === 0 && existingImages.length === 0)
      return;

    setLoading(true);
    try {
      if (postId) {
        // Edit existing post
        const updatedPost = await updatePost(postId, {
          content,
          files: newFiles,
          existingImages,
        });
        if (onPostUpdated) onPostUpdated(updatedPost);
      } else {
        // Create new post
        const newPost = await createPost({
          content,
          files: newFiles,
        });
        if (onPostCreated) onPostCreated(newPost);
        setContent("");
        setNewFiles([]);
        setExistingImages([]);
      }
    } catch (err) {
      console.error(
        postId ? "Error updating post" : "Error creating post",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const handleRemoveNewFile = (file) => {
    setNewFiles((prev) => prev.filter((f) => f !== file));
  };

  return (
    <div className="w-full rounded-4xl flex flex-col gap-5 shadow-2xl bg-white p-5">
      <textarea
        className="w-full bg-gray-300 rounded-2xl resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 p-3"
        rows={4}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="flex flex-col items-center justify-center w-36 h-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
          <span className="text-gray-500 text-sm text-center">Add Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
          />
        </label>

        <div className="flex gap-2">
          {postId && onCancel && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-2xl hover:bg-gray-400 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            className="px-8 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? postId
                ? "Updating..."
                : "Posting..."
              : postId
              ? "Update"
              : "Post"}
          </button>
        </div>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {previews.map((src, i) => (
            <img
              key={i}
              multiple
              src={src}
              alt={`Preview ${i + 1}`}
              className="h-28 w-28 object-cover rounded-lg shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  );
}
