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
        enum: ["approved", "rejected", "await"],
        default: "await",
        required: true
    },
    type: {
        type: String,
        enum: ["urgent", "sick", "annual", "maternity"],
        default: "urgent",
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    remaining: {
        type: Number,
    },
    
});

const Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;