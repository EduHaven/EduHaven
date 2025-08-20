import express from "express";
import { createOrder } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/create-order",protect, createOrder);
export default router;
