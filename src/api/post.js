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

export const updatePost = async (id, { content }) => {
  const urls = await uploadFiles(files);
  const images = urls?.map((url) => ({ url }));

  const payload = {
    ...(content && { content }),
    ...(images?.length > 0 && { images }),
  };

  const { data } = await api.put(`/posts/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data;
};

export const deletePosts = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};
