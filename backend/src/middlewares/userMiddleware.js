const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");

/* ============================================================
   CREATE USER VALIDATION (REGISTER)
============================================================ */
async function createUserMiddleware(req, res, next) {
    let { name, email, password, confirm_password, role } = req.body;

    if (!name || !email || !password || !confirm_password || !role) {
        return res.status(400).json({ ERROR: "All fields are required" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (password !== confirm_password) {
        return res.status(400).json({ ERROR: "Passwords do not match" });
    }

    if (password.length < 6) {
        return res.status(400).json({ ERROR: "Password must be at least 6 characters long" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ERROR: "Invalid email format" });
    }

    // Validate role
    if (!["ADMIN", "STUDENT"].includes(role)) {
        return res.status(400).json({ ERROR: "Role must be ADMIN or STUDENT" });
    }

    try {
        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return res.status(400).json({ ERROR: "Email already registered" });
        }

        req.body = { name, email, password, role };
        next();
    } catch (err) {
        console.error("CreateUser Middleware Error:", err);
        return res.status(500).json({ ERROR: "Server validation error" });
    }
}

/* ============================================================
   LOGIN VALIDATION
============================================================ */
async function loginUserMiddleware(req, res, next) {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            ERROR: "Email and Password are required",
        });
    }

    email = email.trim().toLowerCase();

    req.body = { email, password };
    next();
}

/* ============================================================
   UPDATE USER PROFILE VALIDATION (name/email only)
============================================================ */
async function updateUserMiddleware(req, res, next) {
    let { name, email } = req.body;

    if (!name && !email) {
        return res.status(400).json({
            ERROR: "Provide at least one field to update",
        });
    }

    const updateData = {};

    if (name) {
        name = name.trim();
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return res.status(400).json({ ERROR: "Name must contain only letters & spaces" });
        }
        updateData.name = name;
    }

    if (email) {
        email = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ ERROR: "Invalid email format" });
        }
        updateData.email = email;
    }

    req.body = updateData;
    next();
}

/* ============================================================
   AUTH MIDDLEWARE (KEEP)
============================================================ */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ ERROR: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ ERROR: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ ERROR: "Invalid or expired token" });
    }
}

module.exports = {
    createUserMiddleware,
    loginUserMiddleware,
    updateUserMiddleware,
    authMiddleware,
};
