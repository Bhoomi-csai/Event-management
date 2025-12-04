const express = require("express");
const corsMiddleware = require("./config/cors.js");
require("dotenv").config();
const path = require("path");

const userRoutes = require("./routes/userRoute.js");
const eventRoutes = require("./routes/eventRoutes.js");
const registrationRoutes = require("./routes/registrationRoutes.js");
const uploadRoutes = require("./routes/uploadRoute.js"); 

const app = express();
const PORT = process.env.SERVER_PORT || 5001;


app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/upload", uploadRoutes);  // ⭐ profile picture upload


app.get("/", (req, res) => {
  res.status(200).send("<h1>Event Management Backend Running Successfully 🚀</h1>");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local Backend URL: http://localhost:${PORT}`);
});
