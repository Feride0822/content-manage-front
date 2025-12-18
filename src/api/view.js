import api from "./axios";

export const createView = async (postId) => {
  const { data } = await api.post("/views", { postId });
  return data;
};

export const checkViewed = async (postId) => {
  const { data } = await api.get(`/views/check/${postId}`);
  return data; // { viewed: boolean }
};

export const getViewCount = async (postId) => {
  const { data } = await api.get(`/views/count/${postId}`);
  return data; // { postId, views }
};

export const getViewers = async (postId) => {
  const { data } = await api.get(`/views/${postId}`);
  return data;
};
