const route = require('express').Router();
const salaryController = require('../controllers/salary-controller');

route.post('/', salaryController.create);
route.get('/', salaryController.get);
route.get('/:id', salaryController.getById);
route.put('/:id', salaryController.update);
route.delete('/:id', salaryController.destroy);

<<<<<<< HEAD
module.exports = route;
=======
module.exports = route;
// coba
>>>>>>> 3c5e327d07b84d699ced4b0313c4db2887901344
