import express from "express";
import chatRouter from "./src/routes/chat.route.js";
import adminRouter from "./src/routes/admin.route.js";
import { initializeDB } from "./src/db/index.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.CORS_URL })); // Allow requests from frontend

// routes
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Bus Booking API is running" });
});

initializeDB();

app.listen("4000", () => console.log("server listening on port 4000"));
