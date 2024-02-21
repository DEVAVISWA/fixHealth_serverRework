const { default: mongoose } = require("mongoose");

const BookingSchema = new mongoose.Schema({
  email: String, // physio email
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
    default: "",
  }, // Remarks by sales person
  slot_confirmed: {
    type: Boolean,
    default: false, // sales person confirms the slot.
  },

  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
  },
  slotNo: {
    type: Number,
    required: true,
  },
  patient_id: {
    type: String,
  },
});

const Booking = mongoose.model("Booking", BookingSchema, "bookings");

module.exports = Booking;
