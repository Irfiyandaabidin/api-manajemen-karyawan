const Review = require('../../models/EmployeeReview');

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: 'success',
      message: 'Get all reviews successfully',
      data: reviews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Get review successfully',
      data: review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReview = async (req, res) => {
  const {
    employee_id,
    review_date,
    review_content,
    review_score,
    reviewer_role
  } = req.body;
  
  try {
    if (!employee_id || !review_date || !review_content || !review_score || !reviewer_role) {
      return res.status(400).json({ message: 'Incomplete review data' });
    }

    if (reviewer_role !== 'supervisor') {
      return res.status(403).json({ message: 'You are not authorized to create a review' });
    }
    
    const review = new Review({
      employee_id,
      review_date,
      review_content,
      review_score,
      reviewer_role
    });
    await review.save();
    res.status(201).json({
      status: 'success',
      message: 'Review created successfully',
      data: review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const {
    employee_id,
    review_date,
    review_content,
    review_score,
    reviewer_role
  } = req.body;
  
  try {
    if (!employee_id || !review_date || !review_content || !review_score || !reviewer_role) {
      return res.status(400).json({ message: 'Incomplete review data' });
    }
    
    const review = await Review.findByIdAndUpdate(
      id,
      {
        employee_id,
        review_date,
        review_content,
        review_score,
        reviewer_role
      },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (reviewer_role !== 'supervisor') {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      data: review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer_role !== 'supervisor') {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};

