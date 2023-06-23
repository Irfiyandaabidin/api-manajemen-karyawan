const Division = require("../../models/Division");
const {
  fetchDivision,
  getDivision,
  deleteDivision,
  updateDivision,
  addDivision,
} = require("../domain/division.domain");

const create = async (req, res) => {
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
