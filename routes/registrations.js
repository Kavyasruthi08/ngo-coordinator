import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

// ✅ POST: Create new registration
router.post("/", async (req, res) => {
  try {
    const { volunteerId, eventId, status } = req.body;

    console.log("📩 Received body:", req.body);

    if (!volunteerId || !eventId) {
      return res.status(400).json({ message: "volunteerId and eventId are required" });
    }

    const registration = new Registration({
      volunteer: volunteerId,  // ✅ Correct mapping
      event: eventId,          // ✅ Correct mapping
      status: status || "registered",
    });

    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    console.error("❌ Error creating registration:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ GET all registrations
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("volunteer")
      .populate("event");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
