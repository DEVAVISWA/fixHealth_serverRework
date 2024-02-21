const express = require("express");
const cors = require("cors");
const userRouter = require("./controllers/userController");
const bookingRouter = require("./controllers/bookingController");
const slotRouter = require("./controllers/slotController");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    '<h2> <span style="color:rgb(0,172,193);">fix_health </span> project by G. Deva Viswa </h2>'
  );
});

//I implement Role Based Access sytem (RBAS)
app.use("/api/user/", userRouter);
//booking
app.use("/api/booking/", bookingRouter);
// slot router
app.use("/api/slots/", slotRouter);

module.exports = app;
