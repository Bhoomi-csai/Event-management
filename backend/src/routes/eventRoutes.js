const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getAdminEventsController,
} = require("../controllers/eventController");

/* ============================================================
   ADMIN → GET ALL EVENTS CREATED BY LOGGED-IN ADMIN
   GET /api/events/admin
============================================================ */
router.get("/admin", authMiddleware, getAdminEventsController);

/* ============================================================
   PUBLIC / STUDENT → GET ALL EVENTS (search, filter)
   GET /api/events
============================================================ */
router.get("/", getAllEventsController);

/* ============================================================
   PUBLIC / STUDENT → GET SINGLE EVENT
   GET /api/events/:id
============================================================ */
router.get("/:id", getEventByIdController);

/* ============================================================
   ADMIN → CREATE EVENT
   POST /api/events
============================================================ */
router.post("/", authMiddleware, createEventController);

/* ============================================================
   ADMIN → UPDATE EVENT
   PUT /api/events/:id
============================================================ */
router.put("/:id", authMiddleware, updateEventController);

/* ============================================================
   ADMIN → DELETE EVENT
   DELETE /api/events/:id
============================================================ */
router.delete("/:id", authMiddleware, deleteEventController);

module.exports = router;
