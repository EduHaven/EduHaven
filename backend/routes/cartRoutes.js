import express from "express";
import { addToCart, getCart ,updateCartItemQuantity,
  removeFromCart,
  clearCart,} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartItemQuantity);
router.delete("/remove", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
