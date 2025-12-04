import React, { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "STUDENT", // store uppercase to match backend (optional)
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client validation
    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await signupUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role, // already uppercase
    });

    setLoading(false);

    if (result.ok && result.message === "User registered successfully") {
      setMessage("Signup successful! Redirecting...");
      // small delay for UX only
      setTimeout(() => navigate("/login"), 900);
    } else {
      // Show best error we have
      setMessage(
        result.ERROR || result.message || result.raw || "Something went wrong"
      );
      console.warn("Signup failed:", result);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create your account</h2>
        <p className="subtitle">Join Campus Connect and start your journey</p>

        <div className="role-selector">
          <label>
            <input
              type="radio"
              name="role"
              value="ADMIN"
              checked={formData.role === "ADMIN"}
              onChange={handleChange}
            />
            Admin
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="STUDENT"
              checked={formData.role === "STUDENT"}
              onChange={handleChange}
            />
            Student
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};
 
export default SignupForm;
