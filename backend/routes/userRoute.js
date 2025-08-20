import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  getUserStats,
  getUserOrderHistory,
  getUserReviews,
  setFavoriteRestaurant,
  removeFavoriteRestaurant,
  addFavoriteFood,
  removeFavoriteFood,
  getFavoriteFoods,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Profile routes
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);

// Password management
router.patch('/change-password', protect, changePassword);

// Account management
router.delete('/delete-account', protect, deleteUserAccount);

// User statistics and data
router.get('/stats', protect, getUserStats);
router.get('/orders', protect, getUserOrderHistory);
router.get('/reviews', protect, getUserReviews);

// Favorites and preferences
router.post('/favorite-restaurant', protect, setFavoriteRestaurant);
router.delete('/favorite-restaurant', protect, removeFavoriteRestaurant);
router.post('/favorite-foods', protect, addFavoriteFood);
router.delete('/favorite-foods', protect, removeFavoriteFood);
router.get('/favorite-foods', protect, getFavoriteFoods);



export default router;