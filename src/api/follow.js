// api/follow.js
import api from "./axios";
import publicApi from "./publicAxios";

export const toggleFollow = async (followedId) => {
  const { data } = await api.post(`/followers/toggle/${followedId}`);
  return data;
};

/**
 * Get list of users that a user is following
 * @param {string} userId - The user ID
 * @returns {Promise<Array>}
 */
export const getFollowing = async (userId) => {
  const { data } = await publicApi.get(`/followers/following/${userId}`);
  return data;
};

/**
 * Get list of followers of a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>}
 */
export const getFollowers = async (userId) => {
  const { data } = await publicApi.get(`/followers/followers/${userId}`);
  return data;
};

/**
 * Get follower count for a user
 * @param {string} userId - The user ID
 * @returns {Promise<{userId: string, followers: number}>}
 */
export const getFollowerCount = async (userId) => {
  const { data } = await publicApi.get(`/followers/count/followers/${userId}`);
  return data;
};

/**
 * Get following count for a user
 * @param {string} userId - The user ID
 * @returns {Promise<{userId: string, following: number}>}
 */
export const getFollowingCount = async (userId) => {
  const { data } = await publicApi.get(`/followers/count/following/${userId}`);
  return data;
};

/**
 * Check if current user is following another user
 * @param {string} followedId - The ID of the user to check
 * @returns {Promise<{following: boolean}>}
 */
export const checkFollowing = async (followedId) => {
  const { data } = await api.get(`/followers/check/${followedId}`);
  return data;
};
