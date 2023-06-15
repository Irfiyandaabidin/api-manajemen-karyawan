const Division = require("../../models/Division");

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
    const division = new Division(data);
    const doc = await division.save({ new: true });
    res.status(201).json({
      status: "success",
      message: "Division added successfully",
      data: doc,
    });
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
    const findId = await Division.findById(id);
    if (!findId) {
      return res.status(400).json({ message: "Id not found" });
    }
    const doc = await Division.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      status: "success",
      message: "Division updated successfully",
      data: doc,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Division.findById(id);
    if (!doc) {
      return res.status(400).json({ message: "Id not found" });
    }
    await Division.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "Division delete successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const get = async (req, res) => {
  try {
    const doc = await Division.find();
    res.status(200).json({
      status: "success",
      message: "Get Division successfully",
      data: doc,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const findId = await Division.findById(id);
    if (!findId) {
      return res.status(400).json({ message: "Id not found" });
    }
    const doc = await Division.findById(id);
    res.status(200).json({
      status: "success",
      message: "Get Division successfully",
      data: doc,
    });
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