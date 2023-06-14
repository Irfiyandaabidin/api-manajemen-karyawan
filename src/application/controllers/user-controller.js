const mongoose = require("mongoose");
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const create = async (req, res) => {
  const {
    email,
    password,
    role,
    nik,
    name,
    birth,
    gender,
    address,
    phone,
    entry_date,
    image_profile,
  } = req.body;
  try {
    const newUser = new User({
      email,
      password,
      role,
      nik,
      name,
      birth,
      gender,
      address,
      phone,
      entry_date,
      image_profile,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    newUser.password = undefined
    res.status(201).json({
      status: "success",
      message: "User added successfully",
      data: newUser
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const doc = await User.find();
    res.status(200).json({
      status: "success",
      message: "Get user successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await User.findById(id);
    res.status(200).json({
      status: "success",
      message: "Get user successfully",
      data: doc
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const idUser = req.user.id
  const {role} = req.user;
  const {
    email,
    password,
    nik,
    name,
    birth,
    gender,
    address,
    phone,
    entry_date,
    image_profile,
  } = req.body;
  try {
    if (idUser === id){
      const newUser = {
        email,
        password,
        role,
        nik,
        name,
        birth,
        gender,
        address,
        phone,
        entry_date,
        image_profile,
      }
      const doc = await User.findByIdAndUpdate(
        id,
        newUser,
        { new: true }
      )
  
      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: doc
      })
    }
    res.status(403).json({
      message: "Access Denied."
    })
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
}

const destroy = async (req, res) => {
  const { id } = req.params;
  const idUser = await User.findById(id);
  if (!idUser){
    return res.status(400).json({ message: "id not found." });
  }

  try {
    const doc = await User.findByIdAndDelete(idUser);
    res.status(200).json({ 
      status: "success",
      message: "User delete successfully"
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy
};
