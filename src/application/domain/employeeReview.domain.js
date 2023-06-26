const Review = require('../../models/EmployeeReview');
const User = require('../../models/User');

async function fetchReview() {
    try{
        const data = await Review.find({});
        return { status: 200, message: "Get Review successfully", data};
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function getReview(id) {
    try {
        const doc = await Review.findById(id);
        if (!doc) {
            return {
                status: 404,
                message: "Review not found"
            };
        }
        return {
            status: 200,
            message: "Get Review successfully",
            data: doc
        };
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function destroyReview(id){
    try {
        const doc = await Review.findByIdAndDelete(id);
        if (!doc) {
            return { status: 404, message: "Review not found"};
        }
        return { status: 200, message: "Review delete successfully"}
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function addReview(data) {
    try {
      const user = await User.findById(data.employee_id);
      if (user) {
        const review = new Review(data);
        const doc = await review.save({new: true});
        return {
          status: 201,
          message: "Review added successfully",
          data: doc,
        };
      }
      return {
        status: 400,
        message: "Employee not found",
      };
    } catch (err) {
      return {
        status: 500,
        message: err.message,
      };
    }
  }
  

async function updReview(id, data){
    try {
      const doc = await Review.findByIdAndUpdate(id, data, { new: true });
      if (!doc) {
        return { status:400, message: "Review not found" };
      }
      return {
        status: 200,
        message: "Review updated successfully",
        data: doc,
      }
    } catch (err) {
      return {
        status: 500,
        message: err.message
      }
    }
  }

  module.exports = {
    fetchReview,
    getReview,
    destroyReview,
    addReview,
    updReview
  };