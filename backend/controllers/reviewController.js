import Review from "../models/reviewModel.js";
import Food from "../models/foodModel.js";

export const createReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      food: foodId,
      user: userId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this food item." });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      food: foodId,
      rating: Number(rating),
      comment,
    });

    // Update average rating
    const reviews = await Review.find({ food: foodId });
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total / reviews.length;

    await Food.findByIdAndUpdate(foodId, {
      averageRating: avg.toFixed(1),
      numReviews: reviews.length,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    // Recalculate food rating
    const reviews = await Review.find({ food: review.food });
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = reviews.length ? total / reviews.length : 0;

    await Food.findByIdAndUpdate(review.food, {
      averageRating: avg.toFixed(1),
      numReviews: reviews.length,
    });

    res.json({ success: true, updatedReview: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only the user who posted or an admin can delete
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const foodId = review.food;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate ratings
    const reviews = await Review.find({ food: foodId });
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = reviews.length ? total / reviews.length : 0;

    await Food.findByIdAndUpdate(foodId, {
      averageRating: avg.toFixed(1),
      numReviews: reviews.length,
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsByFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const reviews = await Review.find({ food: foodId }).populate(
      "user",
      "name"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
