import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["registered", "cancelled", "completed"],
    default: "registered",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Registration", registrationSchema);
