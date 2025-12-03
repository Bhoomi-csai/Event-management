const { prisma } = require("../config/database");
const { createToken } = require("../utils/auth");
const bcrypt = require("bcryptjs");

/* =========================================================
   CREATE USER (SIGNUP)
========================================================= */
async function createUserController(req, res) {
  let { name, email, password, role } = req.body;

  try {
    // Validate role
    const validRoles = ["ADMIN", "STUDENT"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ ERROR: "Invalid role. Use ADMIN or STUDENT" });
    }

    // Check email unique
    const emailExists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (emailExists) {
      return res.status(400).json({ ERROR: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: role, // directly ADMIN or STUDENT
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("CreateUser error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error while creating user",
    });
  }
}

/* =========================================================
   LOGIN
========================================================= */
async function loginUserController(req, res) {
  let { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ ERROR: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ ERROR: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = createToken(payload);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =========================================================
   LOGOUT
========================================================= */
async function logoutUserController(req, res) {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ ERROR: "Logout failed" });
  }
}

/* =========================================================
   GET MY PROFILE
========================================================= */
async function getMeController(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ ERROR: "User not found" });

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =========================================================
   UPDATE PROFILE (name/email only)
========================================================= */
async function updateUserController(req, res) {
  try {
    const userId = req.user.id;
    let { name, email } = req.body;

    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ ERROR: "No valid fields provided" });
    }

    // Email unique check
    if (updateData.email) {
      const emailUser = await prisma.user.findFirst({
        where: { email: updateData.email, NOT: { id: userId } },
      });

      if (emailUser) {
        return res.status(400).json({ ERROR: "Email already taken" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("UpdateUser error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error while updating user",
    });
  }
}

module.exports = {
  createUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateUserController,
};
