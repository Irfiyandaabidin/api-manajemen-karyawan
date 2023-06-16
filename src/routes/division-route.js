const route = require('express').Router();
const divisionController = require('../application/controllers/division-controller');
const checkRole = require('../application/middleware/checkRole');

route.post('/', checkRole(['employee']),divisionController.create);
route.get('/', divisionController.get);
route.get('/:id', divisionController.getById);
route.put('/:id', checkRole(['employee']),divisionController.update);
route.delete('/:id', checkRole(['employee']),divisionController.destroy);

module.exports = route;