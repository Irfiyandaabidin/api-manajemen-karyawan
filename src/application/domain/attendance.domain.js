const Attendance = require("../../models/Attendance");
const moment = require('moment')

async function fetchAttendance() {
    try {
        const doc = await Attendance.find();
        return {
            status: 200,
            message: "Get attendance successfully",
            data: doc
        }
    } catch (err) {
        return{ 
            status:500,
            message: err.message 
        };
    }
}

async function getAttendance(id) {
    try {
        const doc = await Attendance.findById(id);
        return {
            status: 200,
            message: "Get attendance successfully",
            data: doc
        }
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function getAttendanceByUser(id) {
    try {
        const doc = await Attendance.find({ id });
        return {
            status: 200,
            message: "Get Attendance by user successfully.",
            data: doc
        }
    } catch (err) {
        return {
            status: 500,
            message: err.message 
        }
    }
}

async function addAttendance(data) {
    try {
        const today = moment().format('YYYY-MM-DD');
        const findAttendance = await Attendance.findOne({ employee_id: data.employee_id, date: today })
        if(!findAttendance){
            const attendance = new Attendance(data);
            const doc = await attendance.save({ new: true });
            return {
                status: 201,
                message: "Attendance added successfully.",
                data: doc,
            }
        }
        return { 
            status: 400,
            message: "You have already checked in today."
        } 
    } catch (err) {
        return { 
            status: 500,
            error: err.message
        }
    }
}

async function updateAttendance(id) {
    try {
        const today = moment().format('YYYY-MM-DD');
        const attendance = await Attendance.findOne({employee_id: id, date: today});
        if(attendance){
            const doc = await Attendance.findOneAndUpdate(attendance._id, {
                employee_id: id,
                time_in: attendance.time_in,
                status: "Done",
                time_out: moment().format('h:mm:ss')
            }, { new: true })
            return {
                status: 200,
                message: "Attendance updated successfully",
                data: doc,
            }
        } return { 
            status: 400, 
            message: "Employee has not clocked in."
        }
    } catch (err) {
        return { 
            status: 500, 
            error: err.message
        }
    }
}

async function deleteAttendance(id) {
    try {
        const idAttendance = await Attendance.findById(id);
        if(!idAttendance) {
            return { 
                status:404,
                message: "id not found." 
            };
        }
        const doc = await Attendance.findByIdAndDelete(idAttendance);
        return {
            status: 200,
            message: "Attendance delete successfully"
        }
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

module.exports = {
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendance,
    getAttendanceByUser,
    fetchAttendance
}