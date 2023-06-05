const route = require('express').Router();
const vacationController = require('../controllers/vacation-controller');

route.post('/vacation', vacationController.createVacation);

route.get('/vacation', vacationController.getAllVacations);

route.get('/vacation/:id', vacationController.getVacationById);

route.put('/vacation/:id', vacationController.updateVacation);

route.delete('/vacation/:id', vacationController.deleteVacation);

module.exports = route;
