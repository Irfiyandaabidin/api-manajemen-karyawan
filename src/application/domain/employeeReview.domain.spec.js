const { reviews } = require('../../../tests/fixtures/employeeReviews');
const { users } = require('../../../tests/fixtures/users');
const Review = require('../../models/EmployeeReview');
const User = require('../../models/User');
const {
  fetchReview,
  getReview,
  destroyReview,
  addReview,
  updReview
} = require('./employeeReview.domain');

jest.mock('../../models/EmployeeReview');

describe('fetchReview()', () => {
  it('should fetch all reviews', async () => {
    const reviews = [
      { _id: '1', title: 'Review 1' },
      { _id: '2', title: 'Review 2' }
    ];

    Review.find.mockResolvedValue(reviews);

    const response = await fetchReview();

    expect(Review.find).toHaveBeenCalledWith({});
    expect(response.status).toBe(200);
    expect(response.message).toBe('Get Review successfully');
    expect(response.data).toEqual(reviews);
  });

  it('should return an error message if fetching reviews fails', async () => {
    const errorMessage = 'Failed to fetch reviews';

    Review.find.mockRejectedValue(new Error(errorMessage));

    const response = await fetchReview();

    expect(Review.find).toHaveBeenCalledWith({});
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe('getReview()', () => {
  it('should get a specific review by id', async () => {
    const id = '1';
    const review = { _id: id, title: 'Review 1' };

    Review.findById.mockResolvedValue(review);

    const response = await getReview(id);

    expect(Review.findById).toHaveBeenCalledWith(id);
    expect(response.status).toBe(200);
    expect(response.message).toBe('Get Review successfully');
    expect(response.data).toEqual(review);
  });

  it('should return "Review not found" if the review does not exist', async () => {
    const id = '1';

    Review.findById.mockResolvedValue(null);

    const response = await getReview(id);

    expect(Review.findById).toHaveBeenCalledWith(id);
    expect(response.status).toBe(404);
    expect(response.message).toBe('Review not found');
  });

  it('should return an error message if getting a review fails', async () => {
    const id = '1';
    const errorMessage = 'Failed to get review';

    Review.findById.mockRejectedValue(new Error(errorMessage));

    const response = await getReview(id);

    expect(Review.findById).toHaveBeenCalledWith(id);
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe('destroyReview()', () => {
  it('should delete a specific review by id', async () => {
    const id = '1';
    const review = { _id: id, title: 'Review 1' };

    Review.findByIdAndDelete.mockResolvedValue(review);

    const response = await destroyReview(id);

    expect(Review.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(response.status).toBe(200);
    expect(response.message).toBe('Review delete successfully');
  });

  it('should return "Review not found" if the review does not exist', async () => {
    const id = '1';

    Review.findByIdAndDelete.mockResolvedValue(null);

    const response = await destroyReview(id);

    expect(Review.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(response.status).toBe(404);
    expect(response.message).toBe('Review not found');
  });

  it('should return an error message if deleting a review fails', async () => {
    const id = '1';
    const errorMessage = 'Failed to delete review';

    Review.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

    const response = await destroyReview(id);

    expect(Review.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe('addReview()', () => {
  it('should add a new review', async () => {
    const user = users[0];
    const review = reviews[0]
    const userSpy = jest
      .spyOn(User, "findById")
      .mockResolvedValue(user);
    const reviewSpy = jest
      .spyOn(Review.prototype, "save")
      .mockResolvedValue(review)
    const result = await addReview(review)
    expect(userSpy).toHaveBeenCalledWith(review.employee_id);
    expect(reviewSpy).toHaveBeenCalledWith({new: true});
    expect(result.status).toBe(201);
    expect(result.message).toBe("Review added successfully");
  });

  it('should return an error message if adding a review fails', async () => {
    const data = { title: 'New Review' };
    const errorMessage = 'Failed to add review';

    Review.mockImplementationOnce(() => {
      return { save: jest.fn().mockRejectedValue(new Error(errorMessage)) };
    });

    const response = await addReview(data);

    expect(Review).toHaveBeenCalledWith(data);
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe('updReview()', () => {
  it('should update an existing review', async () => {
    const id = '1';
    const data = { title: 'Updated Review' };
    const review = { _id: id, title: 'Updated Review' };

    Review.findByIdAndUpdate.mockResolvedValue(review);

    const response = await updReview(id, data);

    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
    expect(response.status).toBe(200);
    expect(response.message).toBe('Review updated successfully');
    expect(response.data).toEqual(review);
  });

  it('should return "Review not found" if the review does not exist', async () => {
    const id = '1';
    const data = { title: 'Updated Review' };

    Review.findByIdAndUpdate.mockResolvedValue(null);

    const response = await updReview(id, data);

    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
    expect(response.status).toBe(400);
    expect(response.message).toBe('Review not found');
  });

  it('should return an error message if updating a review fails', async () => {
    const id = '1';
    const data = { title: 'Updated Review' };
    const errorMessage = 'Failed to update review';

    Review.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

    const response = await updReview(id, data);

    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});
