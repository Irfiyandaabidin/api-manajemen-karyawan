const mongoose = require("mongoose");
const Salary = require("../models/Salary");

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
  try {
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
    const doc = await salary.save({ new: true });
    res.status(201).json({
      status: "success",
      message: "Salary added successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message})
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const {
    employee_id,
    month,
    year,
    basic_salary,
    allowance,
    deduction,
    total_salary,
    payment_status
  } = req.body;
  try {
    const newSalary = {
      employee_id,
      month,
      year,
      basic_salary,
      allowance,
      deduction,
      total_salary,
      payment_status
    }
    const doc = await Salary.findByIdAndUpdate(
      id,
      newSalary,
      { new: true }
    )

    res.status(200).json({
      status: "success",
      message: "Salary updated successfully",
      data: doc
    })
  } catch(err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}

const destroy = async (req, res) => {
  const { id } = req.params;
  const idSalary = await Salary.findById(id);
  if (!idSalary){
    return res.status(400).json({ message: "id not found." });
  }

  try {
    const doc = await Salary.findByIdAndDelete(idSalary);
    res.status(200).json({ 
      status: "success",
      message: "Salary delete successfully"
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const get = async (req, res) => {
  try {
    const doc = await Salary.find();
    res.status(200).json({
      status: "success",
      message: "Get salary successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Salary.findById(id);
    res.status(200).json({
      status: "success",
      message: "Get salary successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
    create,
    update,
    destroy,
    get,
    getById
}