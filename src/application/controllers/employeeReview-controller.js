const Review = require('../../models/EmployeeReview');
const {
  fetchReview,
    getReview,
    destroyReview,
    addReview,
    updReview,
} = require("../domain/employeeReview.domain")

const createReview = async (req, res) => {
  const {
    employee_id,
    review_date,
    review_content,
    review_score,
  } = req.body;
  const reviewer_id = req.user.id
  const reviewer_role = req.user.role

  const data = {
      employee_id,
      review_date,
      review_content,
      review_score,
      reviewer_id,
      reviewer_role
    };
  const response = await addReview(data);
  res.status(response.status).send(response);
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const {
    employee_id,
    review_date,
    review_content,
    review_score,
  } = req.body;
  const {
    reviewer_id,
    reviewer_role
  } = req.user
    const data = {
      employee_id,
      review_date,
      review_content,
      review_score,
      reviewer_id,
      reviewer_role,
      };
      const response = await updReview(id, data);
      res.status(response.status).send(response);
  };

const deleteReview = async (req, res) => {
  const { id } = req.params;
  
  const response = await destroyReview(id);
  res.status(response.status).send(response);
};

const getAllReviews = async (req, res) => {
  const response = await fetchReview();
    res.status(response.status).send(response);
};

const getReviewById = async (req, res) => {
  const { id } = req.params;
  
  const response = await getReview(id);
  res.status(response.status).send(response);
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
