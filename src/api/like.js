import api from "./axios";

export const toggleLike = async (postId) => {
  const { data } = await api.post(`/likes/toggle/${postId}`);
  return data;
};

export const checkLiked = async (postId) => {
  const { data } = await api.get(`/likes/check/${postId}`);
  return data;
};

export const getLikers = async (postId) => {
  const { data } = await api.get(`/likes/post/${postId}`);
  return data;
};
