const mongoose = require("mongoose");
const Vacation = require("../models/vacation");

const create = async (req, res) => {
  const {
    employee_id,
    vacation_id,
    start_date,
    end_date,
    description,
    status,
    type,
    duration,
    remaining,
  } = req.body;
  const vacation = new Vacation({
    employee_id,
    vacation_id,
    start_date,
    end_date,
    description,
    status,
    type,
    duration,
    remaining,
  });
  await vacation.save();
  res.status(201).json({
    vacation
  })
};

module.exports = {
    create
}