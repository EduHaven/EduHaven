import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
      quantity: { type: Number, required: true },
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true }
    }
  ]
});

export default mongoose.model("Cart", cartSchema);
