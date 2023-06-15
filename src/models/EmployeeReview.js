const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review_date: {
    type: Date,
    required: true
  },
  review_content: {
    type: String,
    required: true
  },
  review_score: {
    type: Number,
    required: true
  },
  reviewer_role: {
    type: String,
    ref: 'User',
    required: true
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
