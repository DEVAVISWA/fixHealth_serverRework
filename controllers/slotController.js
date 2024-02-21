const { err } = require("../Utils/logger");
const AvailableSlot = require("../models/availableSlot");
const Slot = require("../models/slot");

const slotRouter = require("express").Router();

slotRouter.post("/create_slot", async (req, res) => {
  try {
    const { filter, slotTime, slotNo } = req.body;
    const slot = new Slot({
      filter,
      slotTime,
      slotNo,
    });
    await slot.save();
    res
      .json({ message: "Slot created successfully", error: false })
      .status(200);
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to create new slot time - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

slotRouter.get("/get_slots", async (req, res) => {
  try {
    const slots = await Slot.aggregate([
      {
        $group: {
          _id: "$filter",
          slots: {
            $push: { slotTime: "$slotTime", slotNo: "$slotNo", id: "$_id" },
          },
        },
      },
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "Morning"] }, then: 1 },
                { case: { $eq: ["$_id", "Afternoon"] }, then: 2 },
                { case: { $eq: ["$_id", "Evening"] }, then: 3 },
              ],
              default: 99,
            },
          },
        },
      },
      {
        $sort: {
          sortOrder: 1,
        },
      },
    ]).exec();
    res
      .json({ error: false, data: slots, message: "successfully fetched!" })
      .status(200);
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to create new slot time - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

slotRouter.post("/get_available_slots", async (req, res) => {
  try {
    const { date } = req.body;
    console.log(date);
    const slots = await AvailableSlot.find({
      date,
      count: { $gt: 0 },
    }).populate("slot");
    res
      .json({ error: false, data: slots, message: "successfully fetched!" })
      .status(200);
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to get available slot time - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

slotRouter.post("/create_patient_booking", async (req, res) => {
  try {
    const { email, availableSlotID } = req.body;
    const newPatient = {
      email: email,
      slotConfirmed: false,
    };
    const addPatient = await AvailableSlot.updateOne(
      { _id: availableSlotID },
      { $push: { patients: newPatient } }
    );
    console.log(addPatient);
    res
      .json({
        error: false,
        data: null,
        message: "booking confirmed successfully!",
      })
      .status(200);
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to get available slot time - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

slotRouter.post("/get_patient_booking", async (req, res) => {
  try {
    const { email } = req.body;
    const bookings = await AvailableSlot.find({
      "patients.email": email,
    }).populate("slot");
    res
      .json({
        error: false,
        data: bookings,
        message: "booking confirmed successfully!",
      })
      .status(200);
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to get available slot time - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

slotRouter.post("/get_all_patients", async (req, res) => {
  try {
    const { slotNo, date } = req.body;
    const bookings = await AvailableSlot.find({
      date,
      slotNo,
    });
    res
      .json({
        error: false,
        data: bookings,
        message: "Patients Details fetched successfully!",
      })
      .status(200);
  } catch (error) {
    err(error);
    res
      .json({
        message: `unable to get patients details - ERROR:${error.message}`,
        error: true,
      })
      .status(500);
  }
});

module.exports = slotRouter;
