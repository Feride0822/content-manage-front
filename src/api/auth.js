import publicApi from "./publicAxios";

export const registerUser = async (username, password) => {
  const { data } = await publicApi.post("/auth/register", {
    username,
    password,
  });
  console.log(data, "register response");
  return data;
};

export const loginUser = async (username, password) => {
  const { data } = await publicApi.post("/auth/login", {
    username,
    password,
  });
  console.log(data, "Login response");
  return data;
};
