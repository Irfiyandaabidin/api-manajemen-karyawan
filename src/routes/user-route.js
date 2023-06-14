const route = require('express').Router();
const userController = require('../application/controllers/user-controller');
const checkRole = require('../application/middleware/checkRole');

route.get('/', userController.getAll);
route.get('/:id', userController.get);
route.post('/', userController.create);
route.put('/', userController.update);
route.delete('/:id', checkRole(["hr"]), userController.destroy);

module.exports = route;