import { useState, useEffect } from "react";
import { createPost } from "../api/post";

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageFiles || imageFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && imageFiles.length === 0) return;

    setLoading(true);
    try {
      const newPost = await createPost({
        content,
        files: imageFiles,
      });

      setContent("");
      setImageFiles([]);

      if (onPostCreated) onPostCreated(newPost);
    } catch (err) {
      console.error("Error creating post", err);
    } finally {
      setLoading(false);
    }
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
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          />
        </label>

        <button
          className="px-8 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Preview */}
      {previews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {previews.map((src, i) => (
            <img
              key={i}
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
