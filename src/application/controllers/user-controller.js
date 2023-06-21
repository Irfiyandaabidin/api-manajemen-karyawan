const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { addUser, fetchUser, getUser, updateUser, deleteUser } = require("../domain/user.domain")

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
  const data = {
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
  const data = {
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
