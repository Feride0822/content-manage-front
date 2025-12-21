import api from "./axios";

export const getMe = async () => {
  const { data } = await api.get(`/users/me`);
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get(`/users`);
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};
