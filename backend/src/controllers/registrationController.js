const { prisma } = require("../config/database");


async function registerForEventController(req, res) {
  try {
    const student = req.user;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ ERROR: "eventId is required" });
    }

    if (student.role !== "STUDENT") {
      return res.status(403).json({ ERROR: "Only students can register for events" });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event) {
      return res.status(404).json({ ERROR: "Event not found" });
    }

    const existing = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: Number(eventId),
          userId: student.id
        }
      }
    });

    if (existing) {
      return res.status(400).json({ ERROR: "Already registered for this event" });
    }

    const registration = await prisma.registration.create({
      data: {
        eventId: Number(eventId),
        userId: student.id,
        status: "REGISTERED"
      },
      include: {
        event: true
      }
    });

    return res.json({
      message: "Registration successful",
      registration
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}


async function getEventRegistrationsController(req, res) {
  try {
    const admin = req.user;
    const { eventId } = req.params;

    if (admin.role !== "ADMIN") {
      return res.status(403).json({ ERROR: "Only admins can view registrations" });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event) {
      return res.status(404).json({ ERROR: "Event not found" });
    }

    if (event.createdBy !== admin.id) {
      return res.status(403).json({ ERROR: "You cannot view another admin's event registrations" });
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId: Number(eventId) },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return res.json({ registrations });

  } catch (err) {
    console.error("Registrations fetch error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}


async function getMyRegistrationsController(req, res) {
  try {
    const student = req.user;

    const registrations = await prisma.registration.findMany({
      where: { 
        userId: student.id,
        status: "REGISTERED" 
      },
      orderBy: { createdAt: "desc" },
      include: {
        event: true,
      }
    });

    return res.json({ registrations });
  } catch (err) {
    console.error("My registrations error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}



async function withdrawRegistrationController(req, res) {
  try {
    const student = req.user;
    const { id } = req.params;

    const registration = await prisma.registration.findUnique({
      where: { id: Number(id) }
    });

    if (!registration)
      return res.status(404).json({ ERROR: "Registration not found" });

    if (registration.userId !== student.id) {
      return res.status(403).json({ ERROR: "You can only unregister your own event" });
    }

    await prisma.registration.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Successfully unregistered" });

  } catch (err) {
    console.error("Withdraw error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}
async function getAdminEventsWithRegistrations(req, res) {
  try {
    const adminId = req.user.id;

    const events = await prisma.event.findMany({
      where: { createdBy: adminId },
      include: {
        registrations: {
          where: { status: "REGISTERED" }
        }
      }
    });

    const result = events.map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      category: e.category,
      registrationCount: e.registrations.length
    }));

    return res.json({ events: result });
  } catch (err) {
    console.error("Admin events list error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}
async function getEventRegistrationsController(req, res) {
  try {
    const adminId = req.user.id;
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) }
    });

    if (!event || event.createdBy !== adminId) {
      return res.status(403).json({ ERROR: "Unauthorized to view this event" });
    }

    const registrations = await prisma.registration.findMany({
      where: {
        eventId: Number(eventId),
        status: "REGISTERED"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            roll: true,
            phone: true,
            email: true
          }
        }
      }
    });
    
    return res.json({
      event: {
        title: event.title,
        date: event.date,
        location: event.location,
        category: event.category
      },
      students: registrations.map(r => r.user)
    });

  } catch (err) {
    console.error("Event registrations error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}


module.exports = {
  registerForEventController,
  getEventRegistrationsController,
  getMyRegistrationsController,
  withdrawRegistrationController,
  getAdminEventsWithRegistrations,
  getEventRegistrationsController
};
