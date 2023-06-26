const Division = require("../../src/models/Division");

const divisions = [
    {
      _id: "6097a8b6f54d2a6f4c7a8e8d",
      division_name: "Sales Division",
      description: "Responsible for sales activities",
      employees: ["6097a8b6f54d2a6f4c7a8e8f", "6097a8b6f54d2a6f4c7a8e90"],
      start_date: "2021-01-01",
      head_division: "6097a8b6f54d2a6f4c7a8e8f",
      budget: 100000
    },
    {
      _id: "6097a8b6f54d2a6f4c7a8e8e",
      division_name: "Marketing Division",
      description: "Responsible for marketing activities",
      employees: ["6097a8b6f54d2a6f4c7a8e91", "6097a8b6f54d2a6f4c7a8e92"],
      start_date: "2021-01-01",
      head_division: "6097a8b6f54d2a6f4c7a8e91",
      budget: 80000
    },
    {
      _id: "6097a8b6f54d2a6f4c7a8e8f",
      division_name: "IT Division",
      description: "Responsible for IT activities",
      employees: ["6097a8b6f54d2a6f4c7a8e93", "6097a8b6f54d2a6f4c7a8e94"],
      start_date: "2021-01-01",
      head_division: "6097a8b6f54d2a6f4c7a8e93",
      budget: 120000
    },
    {
      _id: "6097a8b6f54d2a6f4c7a8e90",
      division_name: "HR Division",
      description: "Responsible for HR activities",
      employees: ["6097a8b6f54d2a6f4c7a8e95", "6097a8b6f54d2a6f4c7a8e96"],
      start_date: "2021-01-01",
      head_division: "6097a8b6f54d2a6f4c7a8e95",
      budget: 90000
    },
    {
      _id: "6097a8b6f54d2a6f4c7a8e91",
      division_name: "Finance Division",
      description: "Responsible for finance activities",
      employees: ["6097a8b6f54d2a6f4c7a8e97", "6097a8b6f54d2a6f4c7a8e98"],
      start_date: "2021-01-01",
      head_division: "6097a8b6f54d2a6f4c7a8e97",
      budget: 110000
    }
  ]

  const insertManyDivision = async () => {
    return await Division.insertMany(divisions);
}

async function deleteManyDivision() {
    await Division.deleteMany({});
}

module.exports = {
    divisions,
    insertManyDivision,
    deleteManyDivision,
}