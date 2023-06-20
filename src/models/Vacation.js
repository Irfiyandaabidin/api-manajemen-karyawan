const mongoose = require('mongoose');

const vacationSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        type: String,
        enum: ["await", "approved", "canceled"],
        default: "await",
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