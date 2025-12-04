const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

const {
  registerForEventController,
  getEventRegistrationsController,
  getMyRegistrationsController,
  withdrawRegistrationController,
  getAdminEventsWithRegistrations
} = require("../controllers/registrationController");


router.post(
  "/register",
  authMiddleware,
  registerForEventController
);


router.get(
  "/event/:eventId",
  authMiddleware,
  getEventRegistrationsController
);


router.get(
  "/me",
  authMiddleware,
  getMyRegistrationsController
);


router.delete(
  "/:id",
  authMiddleware,
  withdrawRegistrationController
);
router.get("/admin/events", authMiddleware, getAdminEventsWithRegistrations);
router.get("/admin/event/:eventId", authMiddleware, getEventRegistrationsController);


module.exports = router;
