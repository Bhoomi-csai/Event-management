const API_URL = "http://localhost:5001/api";

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userData,
        role: userData.role.toUpperCase()
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    return { message: "Network error" };
  }
};


export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Network error" };
  }
};
export const registerForEvent = async (eventId) => {
  try {
    const response = await fetch("http://localhost:5001/api/registrations/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"), 
      },
      body: JSON.stringify({ eventId }),
    });

    return await response.json();
  } catch (err) {
    return { ERROR: "Network error" };
  }
};

