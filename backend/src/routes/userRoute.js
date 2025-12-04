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



usersRouter.post("/register", createUserController);

usersRouter.post("/login", loginUserController);

usersRouter.post("/logout", logoutUserController);

usersRouter.get("/me", authenticate, getMeController);

usersRouter.put("/update", authenticate, updateUserController);

module.exports = usersRouter;
