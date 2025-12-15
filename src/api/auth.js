import api from "./axios";

export const registerUser = async (username, password) => {
  const { data } = await api.post("/api/auth/register", {
    username,
    password,
  });
  return data;
};

export const loginUser = async (username, password) => {
  const { data } = await api.post("/api/auth/login", {
    username,
    password,
  });
  return data;
};
