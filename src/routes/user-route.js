const route = require('express').Router();
const userController = require('../application/controllers/user-controller');
const checkRole = require('../application/middleware/checkRole');

route.get('/', userController.getAll);
route.get('/:id', userController.get);
route.post('/', checkRole(["hr"]), userController.create);
route.put('/:id', userController.update);
route.delete('/:id', checkRole(["hr"]), userController.destroy);

module.exports = route;