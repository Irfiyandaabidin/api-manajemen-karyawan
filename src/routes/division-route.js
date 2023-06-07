const route = require('express').Router();
const divisionController = require('../controllers/division-controller');

route.post('/', divisionController.create);
route.get('/', divisionController.get);
route.get('/:id', divisionController.getById);
route.put('/:id', divisionController.update);
route.delete('/:id', divisionController.destroy);

module.exports = route;