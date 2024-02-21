const { default: mongoose } = require("mongoose");

const AvailableSlotsSchema = new mongoose.Schema({
  slotNo: Number,
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
  date: {
    type: Date,
    default: Date.now,
  },
  count: Number,
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  patients: [
    {
      email: String,
    },
  ],
});

const AvailableSlot = mongoose.model(
  "AvailableSlot",
  AvailableSlotsSchema,
  "availableslots"
);

module.exports = AvailableSlot;
