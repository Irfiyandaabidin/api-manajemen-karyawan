const route = require('express').Router();
const vacationController = require('../controllers/vacation-controller');

route.post('/', vacationController.create);

module.exports = route;