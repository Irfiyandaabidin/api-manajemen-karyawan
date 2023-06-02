const mongoose = require("mongoose");
const Employee = require("../models/employee");

const create = async (req, res) => {
  const {
    employee_id,
    nik,
    name,
    birth,
    gender,
    address,
    phone,
    entry_date,
  } = req.body;
  const employee = new Employee({
    employee_id,
    nik,
    name,
    birth,
    gender,
    address,
    phone,
    entry_date,
  });
  await employee.save();
  res.status(201).json({
    employee
  })
};

module.exports = {
    create
}