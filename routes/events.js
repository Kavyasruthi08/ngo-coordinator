import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// ✅ Get all events
router.get("/", getEvents);

// ✅ Create a new event
router.post("/", createEvent);

// ✅ Get event by ID
router.get("/:id", getEventById);

// ✅ Update event by ID
router.put("/:id", updateEvent);

// ✅ Delete event by ID
router.delete("/:id", deleteEvent);

export default router;
