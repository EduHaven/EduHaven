import express from "express";
import {
  createReview,
  getReviewsByFood,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, createReview);
router.get("/:foodId", getReviewsByFood);
router.delete("/delete/:reviewId", protect, deleteReview);
router.put("/update/:reviewId", protect, updateReview);
export default router;
