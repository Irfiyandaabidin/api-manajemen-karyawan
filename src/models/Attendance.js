const mongoose = require("mongoose");
const moment = require("moment");
const momenttz = require("moment-timezone");

const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    get: (value) => moment(value).format("YYYY-MM-DD"),
    set: (value) => moment(value, "YYYY-MM-DD").toDate(),
  },
  time_in: {
    type: String,
    required: true,
    get: (value) => momenttz(value).tz("Asia/Jakarta").format("h:mm:ss"),
    set: (value) => momenttz(value, "h:mm:ss").toDate(),
  },
  time_out: {
    type: String,
    get: (value) => momenttz(value).tz("Asia/Jakarta").format("h:mm:ss"),
    set: (value) => momenttz(value, "h:mm:ss").toDate(),
  },
  status: {
    type: String,
    enum: ["in", "completed"],
    default: "in",
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
