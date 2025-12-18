import api from "./axios";
import { uploadFiles } from "./image-upload";
import publicApi from "./publicAxios";

export const createPost = async ({ content, files }) => {
  const urls = await uploadFiles(files);

  const images = urls?.map((url) => ({ url }));

  const { data } = await api.post(
    "/posts",
    {
      content,
      imageUrls: images,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return data;
};

export const getPosts = async (params = {}) => {
  const { data } = await publicApi.get("/posts", { params });
  return data;
};

export const getPostsByUserId = async (userId) => {
  const { data } = await publicApi.get(`/posts/user/${userId}`);
  return data;
};

export const getPostById = async (id) => {
  const { data } = await publicApi.get(`/posts/${id}`);
  return data;
};

export const updatePost = async (
  id,
  { content, files = [], existingImages = [] }
) => {
  // Upload new files if any
  let images = existingImages; // keep existing URLs
  if (files.length > 0) {
    const uploadedUrls = await uploadFiles(files);
    images = [...existingImages, ...uploadedUrls.map((url) => ({ url }))];
  }

  const payload = {
    ...(content && { content }),
    ...(images?.length > 0 && { imageUrls: images }),
  };

  const { data } = await api.put(`/posts/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};
