const mongoose = require("mongoose");
const Vacation = require('../../models/Vacation');
const moment = require('moment')

const getAllVacations = async (req, res) => {
  try {
    const doc = await Vacation.find();
    res.status(200).json({
      status: "success",
      message: "Get vacation successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const getVacationById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Vacation.findById(id);
    res.status(200).json({
      status: "success",
      message: "Get vacation successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const createVacation = async (req, res) => {
  const {
    employee_id,
    start_date,
    end_date,
    description,
    status,
    type,
    duration,
    remaining, 
  } = req.body;
  
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const existingVacations = await Vacation.find({
      employee_id,
      start_date: { $gte: startOfYear, $lte: endOfYear },
    });

    const totalDuration = existingVacations.reduce((total, vacation) => {
      return total + vacation.duration;
    }, 0);

    const remainingDays = 12 - totalDuration;

    if (duration > remainingDays) {
      return res.status(400).json({
        message: `You can only request a maximum of ${remainingDays} days of vacation.`,
      });
    }

    const newVacation = new Vacation({
      employee_id,
      start_date,
      end_date,
      description,
      status,
      type,
      duration,
      remaining,
    });
    await newVacation.save();
    res.status(201).json({
      status: "success",
      message: "Vacation added successfully",
      data: newVacation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateVacation = async (req, res) => {
  const { id } = req.params;
  const {
    employee_id,
    start_date,
    end_date,
    description,
    status,
    type,
    duration,
    remaining, 
  } = req.body;
  try {
    const newVacation = {
    employee_id,
    start_date,
    end_date,
    description,
    status,
    type,
    duration,
    remaining, 
    }
    const doc = await Vacation.findByIdAndUpdate(
      id,
      newVacation,
      { new: true }
    )

    res.status(200).json({
      status: "success",
      message: "Vacation updated successfully",
      data: doc
    })
  } catch(err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}

const deleteVacation = async (req, res) => {
  const { id } = req.params;
  const idVacation = await Vacation.findById(id);
  if (!idVacation){
    return res.status(400).json({ message: "id not found." });
  }

  try {
    const doc = await Vacation.findByIdAndDelete(idVacation);
    res.status(200).json({ 
      status: "success",
      message: "Vacation delete successfully"
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllVacations,
  getVacationById,
  createVacation,
  updateVacation,
  deleteVacation,
};