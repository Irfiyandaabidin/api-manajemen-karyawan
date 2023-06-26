const Review = require("../../src/models/EmployeeReview");

const reviews = [
    {
      "employee_id": "649877a6b02a25377da1bb1e",
      "review_date": "2021-10-05T00:00:00.000Z",
      "review_content": "Great work, keep it up!",
      "review_score": 9,
      "reviewer_id": "649877a4b02a25377da1baf4",
      "reviewer_role": "HR"
    },
    {
      "employee_id": "615a6d7fca8f9f8f19a9e8b9",
      "review_date": "2021-10-05T00:00:00.000Z",
      "review_content": "Needs improvement in communication",
      "review_score": 6,
      "reviewer_id": "615a6d7fca8f9f8f19a9e8b7",
      "reviewer_role": "Supervisor"
    },
    {
      "employee_id": "615a6d7fca8f9f8f19a9e8ba",
      "review_date": "2021-10-05T00:00:00.000Z",
      "review_content": "Exceeded expectations, well done!",
      "review_score": 10,
      "reviewer_id": "615a6d7fca8f9f8f19a9e8b8",
      "reviewer_role": "HR"
    },
    {
      "employee_id": "615a6d7fca8f9f8f19a9e8ba",
      "review_date": "2021-10-05T00:00:00.000Z",
      "review_content": "Needs more attention to detail",
      "review_score": 7,
      "reviewer_id": "615a6d7fca8f9f8f19a9e8b7",
      "reviewer_role": "Supervisor"
    },
    {
      "employee_id": "615a6d7fca8f9f8f19a9e8bb",
      "review_date": "2021-10-05T00:00:00.000Z",
      "review_content": "Great potential, keep learning!",
      "review_score": 8,
      "reviewer_id": "615a6d7fca8f9f8f19a9e8b8",
      "reviewer_role": "HR"
    }
  ]

  const insertManyReview = async () => {
    return await Review.insertMany(reviews);
}

async function deleteManyReview() {
    await Review.deleteMany({});
}

module.exports = {
    reviews,
    insertManyReview,
    deleteManyReview,
}

module.exports = {
    reviews,
    insertManyReview,
    deleteManyReview,
}