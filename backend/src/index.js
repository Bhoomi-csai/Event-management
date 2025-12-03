const express = require("express");
const corsMiddleware = require("./config/cors.js");
require("dotenv").config();

const userRoutes = require("./routes/userRoute.js");
const eventRoutes = require("./routes/eventRoutes.js");
const registrationRoutes = require("./routes/registrationRoutes.js");

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Health Check
app.get("/", (req, res) => { 
  res.status(200).send("<h1>Event Management Backend Running Successfully 🚀</h1>");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`🌍 Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
