const route = require('express').Router();
const userController = require('../controllers/user-controller');
const checkEmployee = require('../middleware/checkEmployee');
const checkHr = require('../middleware/checkHr');
const checkRole = require('../middleware/checkRole');
const checkSupervisor = require('../middleware/checkSupervisor');

route.get('/', userController.getAll);
route.get('/:id', userController.get);
route.post('/', checkRole(["hr", "supervisor"]), userController.create);
route.put('/', userController.update);
route.delete('/:id', checkRole(["hr"]), userController.destroy);

module.exports = route;