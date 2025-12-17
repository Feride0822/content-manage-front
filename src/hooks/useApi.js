import publicApi from "../api/publicAxios";
import { STORAGE_KEYS } from "../constants/auth.constants";
import api from "../api/axios";

export const useApi = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  const client = token ? api : publicApi;

  return client;
};
