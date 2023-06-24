const Salary = require("../../src/models/Salary");
const salaries = [
    {
        employee_id: '12ab34cd56ef7890fe1d2c3b',
        month: 1,
        year: 2021,
        basic_salary: 5000000,
        allowance: 1000000,
        deduction: 500000,
        total_salary: 5500000,
        payment_status: 'unpaid',
    },
    {
        employee_id: '60d2b7e9c5d4fe41f0a0f4b5',
        month: 2,
        year: 2021,
        basic_salary: 5000000,
        allowance: 1000000,
        deduction: 500000,
        total_salary: 5500000,
        payment_status: 'unpaid',
    },
    {
        employee_id: '60d2b7e9c5d4fe41f0a0f4b6',
        month: 1,
        year: 2021,
        basic_salary: 6000000,
        allowance: 2000000,
        deduction: 1000000,
        total_salary: 7000000,
        payment_status: 'unpaid',
    },
    {
        employee_id: '60d2b7e9c5d4fe41f0a0f4b6',
        month: 2,
        year: 2021,
        basic_salary: 6000000,
        allowance: 2000000,
        deduction: 1000000,
        total_salary: 7000000,
        payment_status: 'unpaid',
    },
    {
        employee_id: '60d2b7e9c5d4fe41f0a0f4b7',
        month: 1,
        year: 2021,
        basic_salary: 7000000,
        allowance: 3000000,
        deduction: 1500000,
        total_salary: 8500000,
        payment_status: 'unpaid',
    },
];

const insertManySalary = async () => {
    return await Salary.insertMany(salaries);
}

async function deleteManySalary() {
    await Salary.deleteMany({});
}

module.exports = {
    salaries,
    insertManySalary,
    deleteManySalary
}