const mongoose = require('mongoose');
const moment = require('moment');

const attendanceSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        get: (value) => moment(value).format('YYYY-MM-DD'),
        set: (value) => moment(value, 'YYYY-MM-DD').toDate()
    },
    time_in: {
        type: Date,
        required: true,
        get: (value) => moment(value).format('h:mm:ss'),
        set: (value) => moment(value, 'h:mm:ss').toDate()
    },
    time_out: {
        type: Date,   
        get: (value) => moment(value).format('h:mm:ss'),
        set: (value) => moment(value, 'h:mm:ss').toDate()
    },
    status: {
        type: String,
        enum: ["in", "completed"],
        default: 'in'
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;