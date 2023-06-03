const mongoose = require("mongoose");
const Salary = require("../models/salary");

const create = async (req, res) => {
  const {
    employee_id,
    month,
    year,
    basic_salary,
    allowance,
    deduction,
    total_salary,
    payment_status,
  } = req.body;
  const salary = new Salary({
    employee_id,
    month,
    year,
    basic_salary,
    allowance,
    deduction,
    total_salary,
    payment_status,
  });
  await salary.save();
  res.status(201).json({
    salary
  })
};

module.exports = {
    create
}