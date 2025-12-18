import React, { useState, useEffect } from "react";
import { updatePost } from "../api/post";

export default function EditModal({ post, isOpen, onClose, onUpdated }) {
  const [content, setContent] = useState(post?.content || "");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState(post?.imageUrls || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(post?.content || "");
    setPreviews(post?.imageUrls || []);
    setImageFiles([]);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && imageFiles.length === 0 && previews.length === 0) return;

    setLoading(true);
    try {
      const updated = await updatePost(post.id, {
        content,
        files: imageFiles,
      });
      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-2xl w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

        <textarea
          className="w-full bg-gray-100 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Images */}
        <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-3">
          <span className="text-gray-500 text-sm">Add Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          />
        </label>

        {previews.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-3">
            {previews.map((img, i) => (
              <img
                key={i}
                src={img.url || URL.createObjectURL(img)}
                alt={`Preview ${i + 1}`}
                className="h-24 w-24 object-cover rounded-lg shrink-0"
              />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
