const route = require('express').Router();
const employeeController = require('../controllers/employee-controller');

route.post('/', employeeController.create);

module.exports = route;