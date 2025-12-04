// src/api.js
// Robust API_URL chooser:
// - supports your REACT_API_* names (if you insist on keeping them)
// - also checks the standard CRA REACT_APP_* names (recommended)
// - falls back to localhost:5001 for dev
// - sanitizes trailing dots/slashes

function normalizeUrl(raw) {
  if (!raw) return undefined;
  let url = String(raw).trim();
  // remove trailing dots or slashes that can break fetch URLs
  url = url.replace(/[\/\.]+$/, "");
  return url;
}

// Prefer standard CRA names if available
const RAW_SERVER_STANDARD = process.env.REACT_APP_BACKEND_SERVER_URL;
const RAW_LOCAL_STANDARD = process.env.REACT_APP_BACKEND_LOCAL_URL;

// Your original names (may not be available in CRA)
const RAW_SERVER_LEGACY = process.env.REACT_API_BACKEND_SERVER_URL;
const RAW_LOCAL_LEGACY = process.env.REACT_API_BACKEND_LOCAL_URL;

// pick first available (standard -> legacy)
const RAW_SERVER = RAW_SERVER_STANDARD || RAW_SERVER_LEGACY;
const RAW_LOCAL = RAW_LOCAL_STANDARD || RAW_LOCAL_LEGACY;

const SERVER_URL = normalizeUrl(RAW_SERVER);
const LOCAL_URL = normalizeUrl(RAW_LOCAL);

// Final selection — server (prod) first, then local dev fallback, then a hard fallback
const API_URL = SERVER_URL || LOCAL_URL || "http://localhost:5001";

if (!SERVER_URL && RAW_SERVER_LEGACY) {
  // warn if legacy value exists but was malformed
  // eslint-disable-next-line no-console
  console.warn("Provided REACT_API/REACT_APP backend server URL was malformed:", RAW_SERVER_LEGACY);
}
// eslint-disable-next-line no-console
console.info("Using API_URL =", API_URL);

async function safeJSON(response) {
  const text = await response.text();
  if (!text) {
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

/* Auth / Users */
export const signupUser = async (userData) => {
  try {
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

/* Get current user (me) */
export const getMe = async (token) => {
  try {
    const tokenToUse = token || localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
      },
    });

    return await safeJSON(response);
  } catch (err) {
    console.error("getMe error:", err);
    return { ok: false, ERROR: "Network error" };
  }
};

/* Update user profile */
export const updateUser = async (payload, token) => {
  try {
    const tokenToUse = token || localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`,
      },
      body: JSON.stringify(payload),
    });

    return await safeJSON(response);
  } catch (err) {
    console.error("updateUser error:", err);
    return { ok: false, ERROR: "Network error" };
  }
};

/* Event registration (example) */
export const registerForEvent = async (eventId) => {
  try {
    const tokenToUse = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/registrations/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`,
      },
      body: JSON.stringify({ eventId }),
    });

    return await safeJSON(response);
  } catch (err) {
    console.error("registerForEvent error:", err);
    return { ERROR: "Network error" };
  }
};

export default {
  API_URL,
  safeJSON,
  signupUser,
  loginUser,
  getMe,
  updateUser,
  registerForEvent,
};
