import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // ✅ changed from 'name' to 'title'
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
});

export default mongoose.model("Event", eventSchema);
