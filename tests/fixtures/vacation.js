const Vacation = require("../../src/models/Vacation");
const bcrypt = require("bcryptjs");

const vacations = [
    {
        _id: "648ddad8d81c7e22503a2cfe",
        employee_id: "64895f31901ab251dd08ad01",
        start_date:"2023-06-25",
        end_date:"2023-06-28",
        description:"Cuti mendesak",
        status:"await",
        type:"urgent",
        duration:5,
        remaining:7
    },
    {
        _id: "64956b3b5dde094074d643ea",
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
        _id: "64956b7e5dde094074d643ed",
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
        _id: "64956bbc5dde094074d643f0",
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

module.exports = {
    vacations,
};