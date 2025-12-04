const express = require("express");
const multer = require("multer");
const router = express.Router();
const { authMiddleware } = require("../middlewares/userMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profile/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/profile-picture", authMiddleware, upload.single("image"), (req, res) => {
  const filePath = `/uploads/profile/${req.file.filename}`;
  res.json({ imageUrl: filePath });
});

module.exports = router;
