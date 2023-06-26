const route = require('express').Router();
const vacationController = require('../application/controllers/vacation-controller');
const checkRole = require('../application/middleware/checkRole');

route.post('/', checkRole(['supervisor']), vacationController.createVacation);
route.get('/', vacationController.getAllVacations);
route.get('/:id', vacationController.getVacationById);
route.put('/:id', checkRole(['supervisor']),vacationController.updateVacation);
route.delete('/:id', checkRole(['supervisor']), vacationController.deleteVacation);

module.exports = route;
