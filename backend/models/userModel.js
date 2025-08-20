import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  favoriteRestaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  favoriteFoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "food" }]
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;

