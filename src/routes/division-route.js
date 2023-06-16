const route = require('express').Router();
const divisionController = require('../application/controllers/division-controller');
const checkRole = require('../application/middleware/checkRole');

route.post('/', checkRole(['hr']),divisionController.create);
route.get('/', divisionController.get);
route.get('/:id', divisionController.getById);
route.put('/:id', checkRole(['hr']),divisionController.update);
route.delete('/:id', checkRole(['hr']),divisionController.destroy);

module.exports = route;