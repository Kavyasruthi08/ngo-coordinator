import Event from "../models/Event.js";

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  console.log("📩 Received body from client:", req.body); // ✅ Add this

  try {
    const { title, date, location, description } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: "Title, date, and location are required" });
    }

    const newEvent = new Event({ title, date, location, description });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("❌ DB Save Error:", error);
    res.status(400).json({ message: "Failed to create event", error: error.message });
  }
};


// Get by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: "Event not found" });
  }
};

// Update
export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update event" });
  }
};

// Delete
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete event" });
  }
};
