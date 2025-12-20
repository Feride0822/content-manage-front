import { useState, useEffect } from "react";
import { createPost, updatePost } from "../api/post";

export default function PostForm({
  postId = null,
  initialContent = "",
  initialFiles = [],
  onPostCreated,
  onPostUpdated,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setExistingImages(initialFiles);
    setNewFiles([]);
  }, [postId]);

  /* Image previews */
  useEffect(() => {
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setPreviews([...existingImages, ...newPreviews]);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles, existingImages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && newFiles.length === 0 && existingImages.length === 0)
      return;

    setLoading(true);
    try {
      if (postId) {
        const updatedPost = await updatePost(postId, {
          content,
          files: newFiles,
          existingImages,
        });
        onPostUpdated?.(updatedPost);
      } else {
        const newPost = await createPost({
          content,
          files: newFiles,
        });
        onPostCreated?.(newPost);
        setContent("");
        setNewFiles([]);
        setExistingImages([]);
      }
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-5 flex flex-col gap-4">
      <textarea
        className="w-full bg-gray-200 rounded-2xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl px-4 py-2 hover:border-blue-500">
          Add images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
          />
        </label>

        <div className="flex gap-2">
          {postId && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded-xl"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl"
          >
            {loading ? "Saving..." : postId ? "Update" : "Post"}
          </button>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-24 w-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}
