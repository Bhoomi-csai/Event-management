const { prisma } = require("../config/database");

/* =============================================================
   CREATE EVENT (ADMIN ONLY)
============================================================= */
async function createEventController(req, res) {
  try {
    const adminId = req.user.id;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ ERROR: "Only admins can create events" });
    }

    let {
      title,
      description,
      image,
      location,
      date,
      startTime,
      endTime,
      category
    } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({
        ERROR: "Title, location, and date are required",
      });
    }

    // Validate date format (YYYY-MM-DD)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .json({ ERROR: "Invalid date format. Use YYYY-MM-DD." });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        image: image || null,
        location,
        date: parsedDate,
        startTime: startTime || null,
        endTime: endTime || null,
        createdBy: adminId,
        category: category ? category.toLowerCase() : null,
      },
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error("Create event error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =============================================================
   GET ALL EVENTS (SEARCH + FILTER + PAGINATION)
============================================================= */
async function getAllEventsController(req, res) {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const filters = {};

    if (search) {
      filters.title = { contains: search, mode: "insensitive" };
    }

    if (category) {
      filters.category = category.toLowerCase();
    }

    const events = await prisma.event.findMany({
      where: filters,
      skip,
      take: Number(limit),
      orderBy: { date: "asc" },
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
    });

    const total = await prisma.event.count({ where: filters });

    return res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      events,
    });
  } catch (err) {
    console.error("Get all events error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =============================================================
   GET ADMIN'S RELEASED EVENTS (ADMIN ONLY)
   Used by ReleasedEvents.jsx
============================================================= */
async function getAdminEventsController(req, res) {
  try {
    const adminId = req.user.id;
    const { page = 1, limit = 7 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const events = await prisma.event.findMany({
      where: { createdBy: adminId },
      skip,
      take: Number(limit),
      orderBy: { date: "asc" },
    });

    const total = await prisma.event.count({
      where: { createdBy: adminId },
    });

    return res.json({ events, total });
  } catch (err) {
    console.error("Admin events error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =============================================================
   GET SINGLE EVENT DETAILS
============================================================= */
async function getEventByIdController(req, res) {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        admin: { select: { id: true, name: true } },
        registrations: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ ERROR: "Event not found" });
    }

    return res.json({ event });
  } catch (err) {
    console.error("Get event by id error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =============================================================
   UPDATE EVENT (ADMIN ONLY)
============================================================= */
async function updateEventController(req, res) {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ ERROR: "Only admins can update events" });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!event) {
      return res.status(404).json({ ERROR: "Event not found" });
    }

    if (event.createdBy !== adminId) {
      return res
        .status(403)
        .json({ ERROR: "You can only edit your own events" });
    }

    let {
      title,
      description,
      image,
      location,
      date,
      startTime,
      endTime,
      category,
    } = req.body;

    let parsedDate = undefined;
    if (date) {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ ERROR: "Invalid date format" });
      }
    }

    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        image,
        location,
        date: parsedDate,
        startTime,
        endTime,
        category: category ? category.toLowerCase() : undefined,
      },
    });

    return res.json({
      message: "Event updated successfully",
      event: updated,
    });
  } catch (err) {
    console.error("Update event error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =============================================================
   DELETE EVENT (ADMIN ONLY)
============================================================= */
async function deleteEventController(req, res) {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ ERROR: "Only admins can delete events" });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!event) {
      return res.status(404).json({ ERROR: "Event not found" });
    }

    if (event.createdBy !== adminId) {
      return res
        .status(403)
        .json({ ERROR: "You can only delete your own events" });
    }

    await prisma.event.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

module.exports = {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  getAdminEventsController,
  updateEventController,
  deleteEventController,
};
