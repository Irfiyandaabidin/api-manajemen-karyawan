const mongoose = require("mongoose");
const Salary = require("../../models/Salary");
const User = require("../../models/User");
const { addSalary, fetchSalary, getSalary, deleteSalary, updateSalary } = require("../domain/salary.domain");

const create = async (req, res) => {
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