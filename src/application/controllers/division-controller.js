const Division = require("../../models/Division");
const {
  fetchDivision,
  getDivision,
  deleteDivision,
  updateDivision,
  addDivision,
} = require("../domain/divison.domain");
const { check, validationResult } = require('express-validator');

const create = async (req, res) => {
  await check('division_name', 'division_name is required').notEmpty().run(req);
  await check('description', 'description is required').notEmpty().run(req);
  await check('employees', 'employees is required').notEmpty().run(req);
  await check('start_date', 'start_date is required').notEmpty().run(req);
  await check('head_division', 'head_division is required').notEmpty().run(req);
  await check('budget', 'budget is required').notEmpty().run(req);
  await check('division_name', 'division_name is string').isString().run(req);
  await check('description', 'description is string').isString().run(req);
  await check('employees', 'employees is array').isArray().run(req);
  await check('start_date', 'start_date is date').isDate().run(req);
  await check('head_division', 'head_division is hexadecimal').isHexadecimal().run(req);
  await check('budget', 'budget is integer').isInt().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400)
      .json({ errors: errors.array() });
  }

  const {
    division_name,
    description,
    employees,
    start_date,
    head_division,
    budget,
  } = req.body;
  const data = {
    division_name,
    description,
    employees,
    start_date,
    head_division,
    budget,
  };
  const response = await addDivision(data);
  res.status(response.status).send(response);
};

const update = async (req, res) => {
  await check('division_name', 'division_name is required').notEmpty().run(req);
  await check('description', 'description is required').notEmpty().run(req);
  await check('employees', 'employees is required').notEmpty().run(req);
  await check('start_date', 'start_date is required').notEmpty().run(req);
  await check('head_division', 'head_division is required').notEmpty().run(req);
  await check('budget', 'budget is required').notEmpty().run(req);
  await check('division_name', 'division_name is string').isString().run(req);
  await check('description', 'description is string').isString().run(req);
  await check('employees', 'employees is array').isArray().run(req);
  await check('start_date', 'start_date is date').isDate().run(req);
  await check('head_division', 'head_division is hexadecimal').isHexadecimal().run(req);
  await check('budget', 'budget is integer').isInt().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400)
      .json({ errors: errors.array() });
  }
  const { id } = req.params;
  const {
    division_name,
    description,
    employees,
    start_date,
    head_division,
    budget,
  } = req.body;
  const data = {
    division_name,
    description,
    employees,
    start_date,
    head_division,
    budget,
  };
  const response = await updateDivision(id, data);
  res.status(response.status).send(response);
};

const destroy = async (req, res) => {
  const { id } = req.params;

  const response = await deleteDivision(id);
  res.status(response.status).send(response);
};

const get = async (req, res) => {
  const response = await fetchDivision();
  res.status(response.status).send(response);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const response = await getDivision(id);
  res.status(response.status).send(response);
};

module.exports = {
  create,
  update,
  destroy,
  get,
  getById,
};
