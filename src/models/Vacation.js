const mongoose = require('mongoose');

const vacationSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    vacation_id: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    remaining: {
        type: Number,
        required: true
    },
});

const Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;