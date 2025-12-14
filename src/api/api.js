const BACKEND_URL = "https://os-project-k18n.onrender.com"; 

/**
 * Generic API request
 */
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

/* =====================
   AUTH
===================== */

export const registerUser = (username, pseudoname, password) =>
  apiRequest("/api/auth/register", "POST", { username, pseudoname, password });

export const loginUser = (username, password) =>
  apiRequest("/api/auth/login", "POST", { username, password });
