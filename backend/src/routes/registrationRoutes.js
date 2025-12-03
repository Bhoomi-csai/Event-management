const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

const {
  registerForEventController,
  getEventRegistrationsController,
  getMyRegistrationsController,
  withdrawRegistrationController
} = require("../controllers/registrationController");

/* ============================================================
   STUDENT → REGISTER FOR EVENT
   POST /api/registrations/register
============================================================ */
router.post(
  "/register",
  authMiddleware,
  registerForEventController
);

/* ============================================================
   ADMIN → GET ALL REGISTRATIONS FOR AN EVENT
   GET /api/registrations/event/:eventId
============================================================ */
router.get(
  "/event/:eventId",
  authMiddleware,
  getEventRegistrationsController
);

/* ============================================================
   STUDENT → GET THEIR OWN REGISTRATIONS
   GET /api/registrations/me
============================================================ */
router.get(
  "/me",
  authMiddleware,
  getMyRegistrationsController
);

/* ============================================================
   STUDENT → WITHDRAW REGISTRATION
   DELETE /api/registrations/:id
============================================================ */
router.delete(
  "/:id",
  authMiddleware,
  withdrawRegistrationController
);

module.exports = router;
