const Attendance = require("../../models/Attendance");
const User = require("../../models/User");
const moment = require('moment');

const create = async (req, res) => {
    const employee_id = req.user.id;

    const data = {
        employee_id,
        date: moment().format('YYYY-MM-DD'),
        time_in: moment().format('h:mm:ss'),
        status: "in"
    };

    try {
        const today = moment().format('YYYY-MM-DD');
        const findAttendance = await Attendance.findOne({ employee_id, date: today })
        console.log(findAttendance)
        if(!findAttendance){
            const attendance = new Attendance(data);
            const doc = await attendance.save({ new: true });
            return res.status(201).json({
                status: "success",
                message: "Attendance added successfully.",
                data: doc,
            })
        }
        return res.status(400).json({ message: "You have already checked in today."}) 
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const update = async (req, res) => {
    const employee_id = req.user.id;
    try {
        const today = moment().format('YYYY-MM-DD');
        const attendance = await Attendance.findOne({employee_id, date: today});
        if(attendance){
            const doc = await Attendance.findOneAndUpdate(attendance._id, {
                employee_id,
                time_in: attendance.time_in,
                status: "Done",
                time_out: moment().format('h:mm:ss')
            }, { new: true })
            return res.status(200).json({
                status: "success",
                message: "Attendance updated successfully",
                data: doc,
            })
        } return res.status(400).json({ message: "Employee has not clocked in." })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const destroy = async (req, res) => {
    const { id } = req.params;
    const idAttendance = await Attendance.findById(id);
    if(!idAttendance) {
        return res.status(400).json({ message: "id not found." });
    }

    try {
        const doc = await Attendance.findByIdAndDelete(idAttendance);
        res.status(200).json({
            status: "success",
            message: "Attendance delete successfully"
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const get = async (req, res) => {
    try {
        const doc = await Attendance.find();
        res.status(200).json({
            status: "success",
            message: "Get attendance successfully",
            data: doc
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await Attendance.findById(id);
        res.status(200).json({
            status: "success",
            message: "Get attendance successfully",
            data: doc
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getByUser = async (req, res) => {
    const employee_id = req.params.id;
    try {
        const doc = await Attendance.find({ employee_id });
        res.status(200).json({
            status: "success",
            message: "Get Attendance by user successfully.",
            data: doc
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
module.exports = {
    create,
    update,
    destroy,
    getById,
    getByUser,
    get
}