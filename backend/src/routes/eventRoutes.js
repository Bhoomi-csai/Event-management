const express = require("express");
const router = express.Router();
const { prisma } = require("../config/database");


const { authMiddleware } = require("../middlewares/userMiddleware");

const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getAdminEventsController,
} = require("../controllers/eventController");


router.get("/admin", authMiddleware, getAdminEventsController);


router.get("/", getAllEventsController);


router.get("/:id", getEventByIdController);


router.post("/", authMiddleware, createEventController);


router.put("/:id", authMiddleware, updateEventController);


router.delete("/:id", authMiddleware, deleteEventController);
router.get("/category/counts", async (req, res) => {
   try {
     const categories = ["tech", "cultural", "sports", "workshops", "seminars", "clubs"];
 
     const counts = {};
 
     for (const c of categories) {
       counts[c] = await prisma.event.count({
         where: { category: c }
       });
     }
 
     return res.json(counts);
 
   } catch (err) {
     console.log(err);
     return res.status(500).json({ ERROR: "Server error" });
   }
 });
 router.get("/category/:categoryName", async (req, res) => {
   try {
     const { categoryName } = req.params;
 
     const events = await prisma.event.findMany({
       where: {
         category: categoryName.toLowerCase()
       },
       orderBy: { date: "asc" }
     });
 
     return res.json({ events });
   } catch (err) {
     console.error("Category filter error:", err);
     return res.status(500).json({ ERROR: "Server Error" });
   }
 });
 
 
module.exports = router;
