const API_URL = "http://localhost:3000";

function getToken() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data).token : null;
}

// Wraps fetch with the Authorization header automatically
export async function apiFetch(path, options = {}) {
  const token = getToken();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

export { API_URL };
