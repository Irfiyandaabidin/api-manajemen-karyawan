const route = require('express').Router();
const reviewController = require('../application/controllers/employeeReview-controller');


route.get('/', reviewController.getAllReviews);
route.get('/:id', reviewController.getReviewById);
route.post('/', reviewController.createReview);
route.put('/:id', reviewController.updateReview);
route.delete('/:id', reviewController.deleteReview);

module.exports = route;
