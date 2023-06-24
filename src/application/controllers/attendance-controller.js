const Attendance = require("../../models/Attendance");
const User = require("../../models/User");
const moment = require('moment');
const { deleteAttendance ,addAttendance, updateAttendance, getAttendance, getAttendanceByUser, fetchAttendance } = require('../domain/attendance.domain')

const create = async (req, res) => {
    const employee_id = req.user.id;

    const data = {
        employee_id,
        date: moment().format('YYYY-MM-DD'),
        time_in: moment().format('h:mm:ss'),
        status: "in"
    };
    const response = await addAttendance(data);
    res.status(response.status).send(response)
}

const update = async (req, res) => {
    const employee_id = req.user.id;
    const response = await updateAttendance(employee_id);
    res.status(response.status).send(response)
}

const destroy = async (req, res) => {
    const { id } = req.params;
    const response = await deleteAttendance(id);
    res.status(response.status).send(response)
}

const get = async (req, res) => {
    const response = await fetchAttendance();
    res.status(response.status).send(response)
}

const getById = async (req, res) => {
    const { id } = req.params;
    const response = await getAttendance(id);
    res.status(response.status).send(response)
}

const getByUser = async (req, res) => {
    const employee_id = req.params.id;
    const response = await getAttendanceByUser(employee_id);
    res.status(response.status).send(response)
}
module.exports = {
    create,
    update,
    destroy,
    getById,
    getByUser,
    get
}