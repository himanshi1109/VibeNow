// Use environment variable if provided (for production), otherwise fallback to local proxy
const BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const getAuthHeader = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }
  return {};
};

export const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  // Do not set Content-Type if we're sending FormData (browser handles it automatically with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle empty or JSON responses
  let data = {};
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      // If we got an HTML response (like Vite fallback) instead of JSON, throw an error
      // so components don't crash trying to read properties on { message: text }
      throw new Error("Expected JSON response but got: " + text.substring(0, 50));
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
