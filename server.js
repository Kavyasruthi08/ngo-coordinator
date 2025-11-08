import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// ✅ Import route files
import volunteerRoutes from "./routes/volunteerRoutes.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Needed for ES module path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Connect to MongoDB before starting server
await connectDB();

// ✅ API Routes
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// ✅ Serve frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ Serve index.html only for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Handle unexpected errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});
