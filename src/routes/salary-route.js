const route = require('express').Router();
const salaryController = require('../application/controllers/salary-controller');
const checkRole = require('../application/middleware/checkRole');

route.post('/', checkRole(['hr']), salaryController.create);
route.get('/', salaryController.get);
route.get('/:id', salaryController.getById);
route.put('/:id', checkRole(['hr']),salaryController.update);
route.delete('/:id', checkRole(['hr']), salaryController.destroy);

module.exports = route;