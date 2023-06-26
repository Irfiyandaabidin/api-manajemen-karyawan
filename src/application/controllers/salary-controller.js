const mongoose = require("mongoose");
const Salary = require("../../models/Salary");
const User = require("../../models/User");
const { addSalary, fetchSalary, getSalary, deleteSalary, updateSalary } = require("../domain/salary.domain");
const { check, validationResult } = require('express-validator');

const create = async (req, res) => {
  await check('employee_id', 'employee_id is required').notEmpty().run(req);
  await check('month', 'month is required').notEmpty().run(req);
  await check('year', 'year is required').notEmpty().run(req);
  await check('basic_salary', 'basic_salary is required').notEmpty().run(req);
  await check('allowance', 'allowance is required').notEmpty().run(req);
  await check('deduction', 'deduction is required').notEmpty().run(req);
  await check('total_salary', 'total_salary is required').notEmpty().run(req);
  await check('payment_status', 'payment_status is required').notEmpty().run(req);
  await check('employee_id', 'employee_id is hexadecimal').isHexadecimal().run(req);
  await check('month', 'month is integer').isInt().run(req);
  await check('year', 'year is integer').isInt().run(req);
  await check('basic_salary', 'basic_salary is integer').isInt().run(req);
  await check('allowance', 'allowance is integer').isInt().run(req);
  await check('deduction', 'deduction is integer').isInt().run(req);
  await check('total_salary', 'total_salary is integer').isInt().run(req);
  await check('payment_status', 'payment_status is paid or unpaid').isIn(['paid', 'unpaid']).run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400)
      .json({ errors: errors.array() });
  }

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
  const data = {
    employee_id,
    month,
    year,
    basic_salary,
    allowance,
    deduction,
    total_salary,
    payment_status,
  }
  const response = await addSalary(data);
  res.status(response.status).send(response); 
};

const update = async (req, res) => {
  await check('employee_id', 'employee_id is required').notEmpty().run(req);
  await check('month', 'month is required').notEmpty().run(req);
  await check('year', 'year is required').notEmpty().run(req);
  await check('basic_salary', 'basic_salary is required').notEmpty().run(req);
  await check('allowance', 'allowance is required').notEmpty().run(req);
  await check('deduction', 'deduction is required').notEmpty().run(req);
  await check('total_salary', 'total_salary is required').notEmpty().run(req);
  await check('payment_status', 'payment_status is required').notEmpty().run(req);
  await check('employee_id', 'employee_id is hexadecimal').isHexadecimal().run(req);
  await check('month', 'month is integer').isInt().run(req);
  await check('year', 'year is integer').isInt().run(req);
  await check('basic_salary', 'basic_salary is integer').isInt().run(req);
  await check('allowance', 'allowance is integer').isInt().run(req);
  await check('deduction', 'deduction is integer').isInt().run(req);
  await check('total_salary', 'total_salary is integer').isInt().run(req);
  await check('payment_status', 'payment_status is paid or unpaid').isIn(['paid', 'unpaid']).run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400)
      .json({ errors: errors.array() });
  }
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
  const data = {
    employee_id,
    month,
    year,
    basic_salary,
    allowance,
    deduction,
    total_salary,
    payment_status
  }
  const response = await updateSalary(id, data);
  res.status(response.status).send(response)
}

const destroy = async (req, res) => {
  const { id } = req.params;
  const response = await deleteSalary(id);
  res.status(response.status).send(response)
}

const get = async (req, res) => {
  const response = await fetchSalary();
  res.status(response.status).send(response) 
}

const getById = async (req, res) => {
  const { id } = req.params;
  const response = await getSalary(id);
  res.status(response.status).send(response);
}

module.exports = {
    create,
    update,
    destroy,
    get,
    getById
}