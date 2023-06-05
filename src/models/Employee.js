const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    nik: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    entry_date: {
        type: Date,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;