import express from "express";
import Volunteer from "../models/Volunteer.js";

const router = express.Router();

// ➕ Add a new volunteer
router.post("/", async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json({ message: "Volunteer added successfully", volunteer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 👀 Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Delete a volunteer
router.delete("/:id", async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
