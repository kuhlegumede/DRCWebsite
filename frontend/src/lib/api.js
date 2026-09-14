const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  let response;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  try {
    response = await fetch(`${API_BASE_URL}${cleanPath}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Couldn't reach the school server. Please check your connection and try again.",
      0
    );
  }

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || "Something went wrong. Please try again.",
      response.status
    );
  }

  return data;
}

export const api = {
  // Events API
  getEvents: () => request("/api/events"),
  createEvent: (event, token) =>
    request("/api/events", { method: "POST", body: event, token }),
  deleteEvent: (id, token) =>
    request(`/api/events/${id}`, { method: "DELETE", token }),

  // Auth API
  login: (password) =>
    request("/api/auth/login", { method: "POST", body: { password } }),

  // News API
  getNews: () => request("/api/news"),
  getNewsById: (id) => request(`/api/news/${id}`),
  createNews: (formData, token) =>
    request("/api/news", { method: "POST", body: formData, token }),
  deleteNews: (id, token) =>
    request(`/api/news/${id}`, { method: "DELETE", token }),
};

export { ApiError };
