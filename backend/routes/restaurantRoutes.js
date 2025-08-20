import express from "express";
import { addRestaurant } from "../controllers/restaurantController.js";

const router = express.Router();
router.post("/add", addRestaurant);
export default router;
