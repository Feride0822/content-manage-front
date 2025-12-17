import api from "./axios";
import publicApi from "./publicAxios";

export const getComments = async ({ postId, limit = 20, offset = 0 }) => {
  const { data } = await publicApi.get(`/comments`, {
    params: { postId, limit, offset },
  });
  return data;
};

export const createComment = async ({ postId, content }) => {
  const { data } = await api.post("/comments", { postId, content });
  return data;
};

export const updateComment = async ({ id, content }) => {
  const { data } = await api.put(`/comments/${id}`, { content });
  return data;
};

export const deleteComment = async (id) => {
  const { data } = await api.delete(`/comments/${id}`);
  return data;
};
