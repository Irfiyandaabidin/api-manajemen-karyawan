const route = require('express').Router();
const vacationController = require('../application/controllers/vacation-controller');

route.post('/', vacationController.createVacation);

route.get('/', vacationController.getAllVacations);

route.get('/:id', vacationController.getVacationById);

route.put('/:id', vacationController.updateVacation);

route.delete('/:id', vacationController.deleteVacation);

module.exports = route;