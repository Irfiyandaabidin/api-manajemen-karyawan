const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true
    },
    basic_salary: {
        type: Number,
        required: true
    },
    allowance: {
        type: Number,
        required: true
    },
    deduction: {
        type: Number,
        required: true
    },
    total_salary: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['paid', 'unpaid'],
        required: true
    }
});

const Salary = mongoose.model('Salary', salarySchema);
module.exports = Salary;