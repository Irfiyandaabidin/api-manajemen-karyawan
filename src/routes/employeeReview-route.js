const route = require('express').Router();
const reviewController = require('../application/controllers/employeeReview-controller');
const checkRole = require('../application/middleware/checkRole');


route.get('/', reviewController.getAllReviews);
route.get('/:id', reviewController.getReviewById);
route.post('/', checkRole(["supervisor"]), reviewController.createReview);
route.put('/:id', checkRole(["supervisor"]), reviewController.updateReview);
route.delete('/:id', checkRole(["supervisor"]), reviewController.deleteReview);

module.exports = route;