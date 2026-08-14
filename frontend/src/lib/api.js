const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
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
    // no JSON body — fine for some responses
  }

  if (!response.ok) {
    throw new ApiError(data?.message || "Something went wrong. Please try again.", response.status);
  }

  return data;
}

export const api = {
  getEvents: () => request("/api/events"),
  createEvent: (event, token) =>
    request("/api/events", { method: "POST", body: event, token }),
  deleteEvent: (id, token) =>
    request(`/api/events/${id}`, { method: "DELETE", token }),
  login: (password) =>
    request("/api/auth/login", { method: "POST", body: { password } }),
};

export { ApiError };
