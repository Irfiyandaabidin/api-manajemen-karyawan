const route = require('express').Router();
const divisionController = require('../controllers/division-controller');
const checkRole = require('../middleware/checkRole');

route.post('/', checkRole(['supervisor']),divisionController.create);
route.get('/', divisionController.get);
route.get('/:id', divisionController.getById);
route.put('/:id', checkRole(['supervisor']),divisionController.update);
route.delete('/:id', checkRole(['supervisor']),divisionController.destroy);

module.exports = route;