const route = require('express').Router();
const employeeController = require('../controllers/employee-controller');

route.get('/', employeeController.getAllEmployees);

route.get('/:id', employeeController.getEmployeeById);

route.post('/', employeeController.createEmployee);

route.put('/:id', employeeController.updateEmployee);

route.delete('/:id', employeeController.deleteEmployee);

module.exports = route;