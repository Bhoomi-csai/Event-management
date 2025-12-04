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
import EditEvent from "./pages/EditEvent";
import RegisteredEventsDashboard from "./pages/RegisteredEventsDashboard";  
import EventRegistrations from "./pages/EventRegistrations";               



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



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/explore" element={<ExploreEvents />} />
        <Route path="/category/:categoryName" element={<CategoryEvents />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <StudentRoute>
              <MyRegistrations />
            </StudentRoute>
          }
        />

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
          path="/admin/registrations"
          element={
            <AdminRoute>
              <RegisteredEventsDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/event/:eventId/registrations"
          element={
            <AdminRoute>
              <EventRegistrations />
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

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
