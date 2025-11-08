export const createRegistration = async (req, res) => {
  try {
    console.log("📩 Registration received:", req.body); // Debug log

    const { volunteerId, eventId, status } = req.body;

const registration = new Registration({
  volunteer: volunteerId,
  event: eventId,
  status,
});


    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
