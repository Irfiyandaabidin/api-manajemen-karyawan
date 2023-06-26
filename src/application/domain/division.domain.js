const Division = require("../../models/Division");
const User = require("../../models/User");


async function fetchDivision() {
  try {
    const data = await Division.find({});
    return { status: 200, message: "Get Division successfully", data };
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

async function getDivision(id) {
  try {
    const doc = await Division.findById(id);
    if (!doc) {
      return {
          status: 404,
          message: "Division not found"
        };
    }
    return {
      status: 200,
      message: "Get Division successfully",
      data: doc
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message
    };
  }
}

async function deleteDivision(id){
  try {
    const doc = await Division.findByIdAndDelete(id);
    if (!doc) {
      return { status: 404, message: "Division not found" };
    }
    return { status: 200, message: "Division delete successfully" }
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

async function addDivision(data) {
  try {
    const division = new Division(data);
    const employeePromises = data.employees.map(id => User.findById(id));
    const employees = await Promise.all(employeePromises);
    const head_division = await User.findById(data.head_division);
    const employeesExist = employees.every(employee => employee !== null);
    const headDivisionExist = head_division !== null;
    
    if (employeesExist && headDivisionExist) {
      const doc = await division.save({ new: true });
      return {
        status: 201,
        message: "Division added successfully",
        data: doc,
      };
    }
    return {
      status: 400,
      message: "Employee or head division not found in user collection",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

async function updateDivision(id, data){
  try {
    const employeePromises = data.employees.map(id => User.findById(id));
    const employees = await Promise.all(employeePromises);
    const head_division = await User.findById(data.head_division);
    if(employees.every(employee => employee) && head_division){
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
    return {
      status: 400,
      message: "Employee or head division not found in user collection"
    }
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

module.exports = {
  fetchDivision,
  getDivision,
  deleteDivision,
  addDivision,
  updateDivision
};
