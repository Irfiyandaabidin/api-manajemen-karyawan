const route = require('express').Router();
const attendanceController = require('../application/controllers/attendance-controller');
const checkRole = require('../application/middleware/checkRole');

route.post('/', checkRole(["employee"]),attendanceController.create);
route.put('/', checkRole(["employee"]),attendanceController.update);
route.delete('/:id', checkRole(["supervisor"]),attendanceController.destroy);
route.get('/:id', attendanceController.getById);
route.get('/user/:id', attendanceController.getByUser);
route.get('/', attendanceController.get);

module.exports = route