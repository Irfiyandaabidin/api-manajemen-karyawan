const Division = require("../../models/Division");

async function fetchDivision() {
  const data = await Division.find({});
  return { status: 200, message: "Get Division successfully", data };
}

async function getDivision(id) {
  const doc = await Division.findById(id);
  if (!doc) {
    return {
        status: 404,
        message: "Division not found"
      };
  }
  return {
    status: 200,
    message: "Get Division successfully.",
    data: doc
  };
}

async function deleteDivision(id){
    const doc = await Division.findByIdAndDelete(id);
    if (!doc) {
      return { status: 404, message: "Division not found" };
    }
    return { status: 200, message: "Division delete successfully" }
}

async function addDivision(data){
    const division = new Division(data);
    const doc = await division.save({ new: true });
    return {
      status: 201,
      message: "Division added successfully",
      data: doc,
    };
}

async function updateDivision(id, data){
    const doc = await Division.findByIdAndUpdate(id, data, { new: true });
    if (!doc) {
      return { status:400, message: "Division not found" };
    }
    return {
      status: 200,
      message: "Division updated successfully",
      data: doc,
    }
}
module.exports = {
  fetchDivision,
  getDivision,
  deleteDivision,
  addDivision,
  updateDivision
};
