const route = require('express').Router();
const salaryController = require('../controllers/salary-controller');

route.post('/', salaryController.create);
route.get('/', salaryController.get);
route.get('/:id', salaryController.getById);
route.put('/:id', salaryController.update);
route.delete('/:id', salaryController.destroy);

module.exports = route;
// coba