const Vacation = require("../../src/models/Vacation");

const vacations = [
    {
        employee_id: "64895f31901ab251dd08ad01",
        start_date:"2023-06-25",
        end_date:"2023-06-28",
        description:"Cuti mendesak",
        status:"await",
        type:"urgent",
        duration:5,
        remaining:12
    },
    {
        employee_id: "64956768efc3895c2e4c700a",
        start_date:"2023-06-24",
        end_date:"2023-06-27",
        description:"urgent vacation",
        status:"approved",
        type:"urgent",
        duration:5,
        remaining:7
    },
    {
        employee_id: "64956768efc3895c2e4c700b",
        start_date:"2023-06-14",
        end_date:"2023-06-20",
        description:"urgent vacation",
        status:"await",
        type:"sick",
        duration:7,
        remaining:5
    },
    {
        employee_id: "64956768efc3895c2e4c700e",
        start_date:"2023-06-03",
        end_date:"2023-06-04",
        description:"urgent vacation",
        status:"await",
        type:"sick",
        duration:2,
        remaining:10
    }
]

const insertManyVacation = async () => {
    await Vacation.insertMany(vacations);
}

async function deleteManyVacation() {
    await Vacation.deleteMany({});
}

module.exports = {
    vacations,
    insertManyVacation,
    deleteManyVacation,
};