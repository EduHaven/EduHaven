import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.foodId items.restaurantId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.foodId.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json(await order.populate("items.foodId items.restaurantId"));
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ message: "Error placing order", error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).populate("items.foodId items.restaurantId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};
