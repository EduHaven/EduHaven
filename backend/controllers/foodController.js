// foodController.js

import Food from "../models/foodModel.js";
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
  try {
    const body = { ...req.body };
    console.log("Parsed restaurantId:", body.restaurantId);
    console.log("Type:", typeof body.restaurantId);

    const newFood = new Food({
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category,
      restaurantId: body.restaurantId,
      image: req.file?.filename,
    });

    await newFood.save();

    res.status(201).json({ success: true, food: newFood });
  } catch (error) {
    console.error("❌ Add food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get food by restaurant
const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const foodList = await Food.find({ restaurantId });
    res.status(200).json({ success: true, food: foodList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await Food.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food item" });
  }
};

// ✅ Export all at once (no duplicates)
export { addFood, getFoodByRestaurant, removeFood };
