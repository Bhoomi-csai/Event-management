const express = require("express");
const usersRouter = express.Router();

const {
  createUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateUserController,
} = require("../controllers/userController");

const { authenticate } = require("../utils/auth");

/* =========================================================
   USER ROUTES FOR EVENT MANAGEMENT SYSTEM
========================================================= */

// Register (ADMIN or STUDENT)
usersRouter.post("/register", createUserController);

// Login
usersRouter.post("/login", loginUserController);

// Logout
usersRouter.post("/logout", logoutUserController);

// Get my profile
usersRouter.get("/me", authenticate, getMeController);

// Update profile (name/email only)
usersRouter.put("/update", authenticate, updateUserController);

module.exports = usersRouter;
