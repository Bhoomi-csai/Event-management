import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

import ExploreEvents from "./pages/ExploreEvents";
import AddEvent from "./pages/AddEvent";
import CategoryEvents from "./pages/CategoryEvents";
import ReleasedEvents from "./pages/ReleasedEvents";
import MyRegistrations from "./pages/MyRegistrations";
import Profile from "./pages/Profile";
import EditEvent from "./pages/EditEvent"; // if you create it

/* ================================
   ROUTE GUARDS
================================ */

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate to="/" />;
};

const StudentRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "STUDENT" ? children : <Navigate to="/" />;
};

/* ================================
   APP ROUTES
================================ */

function App() {
  return (
    <Router>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/explore" element={<ExploreEvents />} />
        <Route path="/category/:categoryName" element={<CategoryEvents />} />

        {/* ---------- COMMON LOGGED-IN ROUTES ---------- */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ---------- STUDENT DASHBOARD ROUTES ---------- */}
        <Route
          path="/my-registrations"
          element={
            <StudentRoute>
              <MyRegistrations />
            </StudentRoute>
          }
        />

        {/* ---------- ADMIN DASHBOARD ROUTES ---------- */}
        <Route
          path="/add-event"
          element={
            <AdminRoute>
              <AddEvent />
            </AdminRoute>
          }
        />

        <Route
          path="/released-events"
          element={
            <AdminRoute>
              <ReleasedEvents />
            </AdminRoute>
          }
        />

        <Route
          path="/edit-event/:id"
          element={
            <AdminRoute>
              <EditEvent />
            </AdminRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
