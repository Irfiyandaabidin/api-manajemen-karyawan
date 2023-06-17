const Vacation = require('../../models/Vacation');
const {
  fetchVacation,
  getVacation,
  destroyVacation,
  addVacation,
  updVacation,
} = require("../domain/vacation.domain");

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
    const data = {
      employee_id,
      start_date,
      end_date,
      description,
      status,
      type,
      duration,
      remaining,
    };
    const response = await addVacation(data);
    res.status(response.status).send(response);
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
    const data = {
    employee_id,
    start_date,
    end_date,
    description,
    status,
    type,
    duration,
    remaining, 
    };
    const response = await updVacation(id, data);
    res.status(response.status).send(response);
  };

const deleteVacation = async (req, res) => {
  const { id } = req.params;
    
      const response = await destroyVacation(id);
        res.status(response.status).send(response);
    };

  const getAllVacations = async (req, res) => {
  const response = await fetchVacation();
    res.status(response.status).send(response);
};

const getVacationById = async (req, res) => {
  const { id } = req.params;

  const response = await getVacation(id);
  res.status(response.status).send(response);
};

module.exports = {
  getAllVacations,
  getVacationById,
  createVacation,
  updateVacation,
  deleteVacation,
};