const Division = require("../../models/Division");
const { fetchDivision, getDivision, deleteDivision, updateDivision, addDivision } = require("../domain/divison.domain");

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
  try {
    const response = await addDivision(data);
    res.status(response.status).send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  try {
    const response = await updateDivision(id, data);
    res.status(response.status).send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await deleteDivision(id);
    res.status(response.status).send(response)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const get = async (req, res) => {
  try {
    const response = await fetchDivision();
    res.status(response.status).send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;

  try {
      const response = await getDivision(id);
      res.status(response.status).send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  create,
  update,
  destroy,
  get,
  getById,
};
