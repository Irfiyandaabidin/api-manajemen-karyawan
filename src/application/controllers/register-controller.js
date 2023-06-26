const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { addUser } = require("../domain/user.domain")
const { check, validationResult } = require("express-validator");

module.exports = async (req, res) => {
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