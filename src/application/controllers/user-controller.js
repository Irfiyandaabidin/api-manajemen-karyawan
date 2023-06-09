const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { addUser, fetchUser, getUser, updateUser, deleteUser } = require("../domain/user.domain")
const { check, validationResult } = require("express-validator");

const create = async (req, res) => {
  await check('email', 'email is required').notEmpty().run(req);
  await check('password', 'password is required').notEmpty().run(req);
  await check('nik', 'nik is required').notEmpty().run(req);

  await check('email', 'Please include a valid email').isEmail().optional().run(req);
  await check('password', 'password min 6').isLength({min: 6}).optional().run(req);
  await check('role', 'role is hr, employee, or supervisor').isIn(['hr', 'employee', 'supervisor']).optional().run(req);
  await check('nik', 'nik is integer and length mus be 16').isInt({min:1000000000000000, max:9999999999999999}).optional().run(req);
  await check('name', 'name is string').isString().optional().run(req);
  await check('gender', 'gender just male or female').isIn(['male', 'female']).optional().run(req);
  await check('address', 'address is string').isString().optional().run(req);
  await check('phone', 'phone is length 12').isLength(12).optional().run(req);
  await check('image_profile', 'image_profile is string').isString().optional().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400)
      .json({ errors: errors.array() });
  }
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

  const salt = await bcrypt.genSalt(10);
  const cryptPassword = await bcrypt.hash(password, salt);
  
  const data = {
    email,
    password : cryptPassword,
    role,
    nik,
    name,
    birth,
    gender,
    address,
    phone,
    entry_date,
    image_profile,
  };
  const response = await addUser(data);
  res.status(response.status).send(response);
};

const getAll = async (req, res) => {
  const response = await fetchUser();
  res.status(response.status).send(response);
};

const get = async (req, res) => {
  const { id } = req.params;
  const response = await getUser(id);
  res.status(response.status).send(response);
};

const update = async (req, res) => {
  await check('email', 'email is required').notEmpty().run(req);
  await check('password', 'password is required').notEmpty().run(req);

  await check('email', 'Please include a valid email').isEmail().optional().run(req);
  await check('password', 'password min 6').isLength({min: 6}).optional().run(req);
  await check('role', 'role is hr, employee, or supervisor').isIn(['hr', 'employee', 'supervisor']).optional().run(req);
  await check('nik', 'nik is integer and length mus be 16').isInt({min:1000000000000000, max:9999999999999999}).optional().run(req);
  await check('name', 'name is string').isString().optional().run(req);
  await check('gender', 'gender just male or female').isIn(['male', 'female']).optional().run(req);
  await check('address', 'address is string').isString().optional().run(req);
  await check('phone', 'phone is length 12').isLength(12).optional().run(req);
  await check('image_profile', 'image_profile is string').isString().optional().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400)
    .json({ errors: errors.array() });
  }
  const { id } = req.params;
  const idUser = req.user.id;
  const { role } = req.user;
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
  const salt = await bcrypt.genSalt(10);
  const cryptPasswordUpdate = await bcrypt.hash(password, salt);
  const data = {
    email,
    password: cryptPasswordUpdate,
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
  const response = await updateUser(id, idUser, data);
  res.status(response.status).send(response);
};

const destroy = async (req, res) => {
  const { id } = req.params;
  const response = await deleteUser(id);
  res.status(response.status).send(response);
};

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy,
};
