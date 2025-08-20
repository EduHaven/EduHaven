import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Review from '../models/reviewModel.js';
import Cart from '../models/cartModel.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favoriteRestaurant', 'name address phone');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, favoriteRestaurant } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it already exists
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(favoriteRestaurant && { favoriteRestaurant })
      },
      { new: true, runValidators: true }
    ).select('-password').populate('favoriteRestaurant', 'name address phone');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(userId);
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Delete user's related data
    await Cart.deleteMany({ userId });
    await Review.deleteMany({ user: userId });
    await Order.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [orderCount, reviewCount, cartItemCount] = await Promise.all([
      Order.countDocuments({ userId }),
      Review.countDocuments({ user: userId }),
      Cart.aggregate([
        { $match: { userId } },
        { $unwind: '$items' },
        { $group: { _id: null, totalItems: { $sum: '$items.quantity' } } }
      ])
    ]);

    const totalSpent = await Order.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders: orderCount,
        totalReviews: reviewCount,
        cartItems: cartItemCount[0]?.totalItems || 0,
        totalSpent: totalSpent[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
};

// Get user's order history with details
export const getUserOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.foodId', 'name price image category')
      .populate('items.restaurantId', 'name address phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasMore: page * limit < totalOrders
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId })
      .populate('food', 'name image price category restaurantId')
      .populate({
        path: 'food',
        populate: {
          path: 'restaurantId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: page * limit < totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
};

// Set favorite restaurant
export const setFavoriteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const userId = req.user._id;

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { favoriteRestaurant: restaurantId },
      { new: true }
    ).select('-password').populate('favoriteRestaurant', 'name address phone');

    res.status(200).json({
      success: true,
      message: 'Favorite restaurant updated',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error setting favorite restaurant', error: error.message });
  }
};

// Remove favorite restaurant
export const removeFavoriteRestaurant = async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { favoriteRestaurant: 1 } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Favorite restaurant removed',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite restaurant', error: error.message });
  }
};

// Add food to favorites
export const addFavoriteFood = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: 'Food ID is required' });
    }

    // Check if food exists
    const Food = (await import('../models/foodModel.js')).default;
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Check if already in favorites
    const user = await User.findById(userId);
    if (user.favoriteFoods.includes(foodId)) {
      return res.status(400).json({ message: 'Food already in favorites' });
    }

    // Add to favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteFoods: foodId } },
      { new: true }
    ).populate('favoriteFoods', 'name image price category averageRating restaurantId')
     .populate({
       path: 'favoriteFoods',
       populate: {
         path: 'restaurantId',
         select: 'name'
       }
     });

    res.status(200).json({
      success: true,
      message: 'Food added to favorites',
      favoriteFoods: updatedUser.favoriteFoods
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding food to favorites', error: error.message });
  }
};

// Remove food from favorites
export const removeFavoriteFood = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: 'Food ID is required' });
    }

    // Remove from favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteFoods: foodId } },
      { new: true }
    ).populate('favoriteFoods', 'name image price category averageRating restaurantId')
     .populate({
       path: 'favoriteFoods',
       populate: {
         path: 'restaurantId',
         select: 'name'
       }
     });

    res.status(200).json({
      success: true,
      message: 'Food removed from favorites',
      favoriteFoods: updatedUser.favoriteFoods
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing food from favorites', error: error.message });
  }
};

// Get user's favorite foods
export const getFavoriteFoods = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate('favoriteFoods', 'name image price category averageRating numReviews restaurantId')
      .populate({
        path: 'favoriteFoods',
        populate: {
          path: 'restaurantId',
          select: 'name address phone'
        }
      });

    res.status(200).json({
      success: true,
      favoriteFoods: user.favoriteFoods || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite foods', error: error.message });
  }
};

