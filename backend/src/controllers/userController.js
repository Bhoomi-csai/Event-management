const { prisma } = require("../config/database");
const { createToken } = require("../utils/auth");
const bcrypt = require("bcrypt");


async function createUserController(req, res) {
  let { name, email, password, role } = req.body;

  try {
    const validRoles = ["ADMIN", "STUDENT"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ ERROR: "Invalid role. Use ADMIN or STUDENT" });
    }

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
        role: role, 
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


async function logoutUserController(req, res) {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ ERROR: "Logout failed" });
  }
}


async function getMeController(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        roll: true,
        department: true,
        year: true,
        skills: true,
        about: true,
        designation: true,
        office: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json({ user });

  } catch (err) {
    console.error("GetMe Error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}



async function updateUserController(req, res) {
  try {
    const userId = req.user.id;

    let {
      name,
      phone,
      image,
      roll,
      department,
      year,
      skills,
      about,
      designation,
      office
    } = req.body;

    const updateData = {
      name,
      phone,
      image,
      roll,
      department,
      year,
      skills,
      about,
      designation,
      office
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        roll: true,
        department: true,
        year: true,
        skills: true,
        about: true,
        designation: true,
        office: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("UpdateUser error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error while updating user"
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
