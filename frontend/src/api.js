const API_URL =
  process.env.REACT_API_BACKEND_SERVER_URL ||
  process.env.REACT_API_BACKEND_LOCAL_URL;

async function safeJSON(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ERROR: "Invalid JSON response", raw: text };
  }
}

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userData,
        role: userData.role.toUpperCase()
      }),
    });
    return await safeJSON(response);
  } catch (error) {
    console.error("Signup error:", error);
    return { message: "Network error" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await safeJSON(response);
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Network error" };
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
