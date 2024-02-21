const { err } = require("../Utils/logger");
const Booking = require("../models/booking");
const AvailableSlot = require("../models/availableSlot");
const bookingRouter = require("express").Router();

bookingRouter.post("/create_Booking", async (req, res) => {
  try {
    const { email, name, date, slot, slotNo } = req.body;
    console.log(new Date(date));
    console.log(date, "normal");
    const bookings = await Booking.find({
      date: date,
      email,
    }).sort({ slotNo: 1 });

    const createBooking = async () => {
      const booking = new Booking({
        email,
        name,
        date,
        slot,
        remarks: "",
        slot_confirmed: false,
        slotNo,
      });
      await booking.save();
      const findSlots = await AvailableSlot.find({ date, slotNo });
      let count = 1;
      if (findSlots.length > 0) {
        count = findSlots.length + 1;
      }
      await AvailableSlot.create({
        date: date,
        slotNo,
        slot,
        patients: [],
        count,
      });
      return true;
    };
    if (bookings.length > 0) {
      const isValidBooking = bookings.some(
        (booking) => Math.abs(booking.slotNo - slotNo) < 3
      );
      if (!isValidBooking) {
        const bookingCreated = await createBooking();
        if (bookingCreated) {
          res
            .json({
              error: false,
              message: "Appointment time updated.",
              data: null,
            })
            .status(200);
        } else {
          res
            .json({
              error: false,
              message: "There was a error creating an Booking.",
              data: null,
            })
            .status(200);
        }
      } else {
        res
          .json({
            message:
              "You have a another appointment booked in this time span. Please select another timeslot.",
            error: true,
          })
          .status(200);
      }
    } else {
      const bookingCreated = await createBooking();
      res
        .json({ error: false, message: "Appointment time updated." })
        .status(200);
    }
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to create new Booking - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

bookingRouter.get("/clear_all_booking", async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.json({ message: "Cleared DB", error: false });
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to clear DB - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

bookingRouter.get("/get_booking_details_by_id/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const bookings = await Booking.find({ email })
      .populate("slot")
      .sort({ date: 1 });
    res.json({
      message: "Booking details fetched",
      data: bookings,
      error: false,
    });
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to fetch details - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});
bookingRouter.get("/get_booking_detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bookings = await Booking.find({ _id: id })
      .populate("slot")
      .sort({ date: 1 });
    res.json({
      message: "Booking details fetched",
      data: bookings,
      error: false,
    });
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to fetch details - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});
// REWORK LOGIC
bookingRouter.post("/confirm_patient_booking", async (req, res) => {
  try {
    const { email, bookingID, availableSlotID, remarks } = req.body;
    await Booking.updateOne(
      { _id: bookingID },
      { slot_confirmed: true, patient_id: email, remarks }
    );
    const getSlotDetails = await AvailableSlot.find({ _id: availableSlotID });
    let count = getSlotDetails[0].count - 1;
    await AvailableSlot.updateOne(
      { _id: availableSlotID },
      { booking_id: bookingID, count }
    );
    res.json({
      message: "Booking confirmed successfully!",
      data: null,
      error: false,
    });
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to confirm patient booking - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});
module.exports = bookingRouter;
