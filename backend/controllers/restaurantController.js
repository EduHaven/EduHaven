import Restaurant from "../models/restaurantModel.js";

export const addRestaurant = async (req, res) => {
  try {
    const { name, location } = req.body;
    const restaurant = new Restaurant({ name, location });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
