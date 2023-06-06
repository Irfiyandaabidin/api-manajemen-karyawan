const mongoose = require("mongoose");
const Employee = require('../models/Employee');

const createEmployee = async (req, res) => {
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
  try {
    const newEmployee = new Employee({
    employee_id,
    nik,
    name,
    birth,
    gender,    
    address,
    phone,
    entry_date,
    });
    await newEmployee.save();
    res.status(201).json({
      status: "success",
      message: "Employee added successfully",
      data: newEmployee
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const doc = await Employee.find();
    res.status(200).json({
      status: "success",
      message: "Get employee successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Employee.findById(id);
    res.status(200).json({
      status: "success",
      message: "Get employee successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
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
  try {
    const newEmployee = {
    employee_id,
    nik,
    name,
    birth,
    gender,
    address,
    phone,
    entry_date,
    }
    const doc = await Employee.findByIdAndUpdate(
      id,
      newEmployee,
      { new: true }
    )

    res.status(200).json({
      status: "success",
      message: "Employee updated successfully",
      data: doc
    })
  } catch(err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const idEmployee = await Employee.findById(id);
  if (!idEmployee){
    return res.status(400).json({ message: "id not found." });
  }

  try {
    const doc = await Employee.findByIdAndDelete(idEmployee);
    res.status(200).json({ 
      status: "success",
      message: "Employee delete successfully"
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
