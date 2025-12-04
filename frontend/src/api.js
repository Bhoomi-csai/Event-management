// src/api.js
const API_URL =
  process.env.REACT_APP_BACKEND_URL || // e.g. REACT_APP_BACKEND_URL=https://your-backend.com
  "http://localhost:5001"; // local fallback for dev

async function safeJSON(response) {
  // read raw text, return parsed JSON or an object describing the raw body
  const text = await response.text();
  if (!text) {
    // No body
    return {
      status: response.status,
      ok: response.ok,
      ERROR: "Empty response body",
      raw: "",
    };
  }
  try {
    return { status: response.status, ok: response.ok, ...JSON.parse(text) };
  } catch (err) {
    return {
      status: response.status,
      ok: response.ok,
      ERROR: "Invalid JSON response",
      raw: text,
    };
  }
}

export const signupUser = async (userData) => {
  try {
    // Only send the fields backend expects
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: (userData.role || "STUDENT").toUpperCase(),
    };

    const response = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await safeJSON(response);

    // Helpful normalized return shape
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        ...data,
      };
    }

    return { ok: true, status: response.status, ...data };
  } catch (error) {
    console.error("Signup error:", error);
    return { ok: false, ERROR: "Network error", raw: String(error) };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await safeJSON(response);
    if (!response.ok) return { ok: false, ...data };
    return { ok: true, ...data };
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false, ERROR: "Network error" };
  }
};

export const registerForEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/api/registrations/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ eventId }),
    });

    return await safeJSON(response);
  } catch (err) {
    return { ERROR: "Network error" };
  }
};
