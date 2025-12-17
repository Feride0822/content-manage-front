import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:3003/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default publicApi;
