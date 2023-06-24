const Attendance = require("../../src/models/Attendance");

const attendances = [
  {
    employee_id: "6165b5b3d1f5a1c9e0b17d0a",
    date: "2021-11-01",
    time_in: "08:00:00",
    time_out: "16:00:00",
    status: "completed",
  },
  {
    employee_id: "6165b5b3d1f5a1c9e0b17d0a",
    date: "2021-11-02",
    time_in: "08:30:00",
    status: "in",
  },
  {
    employee_id: "6165b5b3d1f5a1c9e0b17d0a",
    date: "2021-11-03",
    time_in: "08:00:00",
    time_out: "17:00:00",
    status: "completed",
  },
  {
    employee_id: "6165b5b3d1f5a1c9e0b17d0b",
    date: "2021-11-01",
    time_in: "08:30:00",
    time_out: "17:30:00",
    status: "completed",
  },
  {
    employee_id: "6165b5b3d1f5a1c9e0b17d0b",
    date: "2021-11-02",
    time_in: "09:00:00",
    time_out: "18:00:00",
    status: "completed",
  },
];

async function deleteManyAttendance() {
  await Attendance.deleteMany({});
}

async function insertManyAttendance() {
  await Attendance.insertMany(attendances)
}

module.exports = {
  attendances,
  deleteManyAttendance,
  insertManyAttendance
};
