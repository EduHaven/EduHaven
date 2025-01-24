import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    FullName:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    UserProfile:{
        type: String,
        required: true,
        default: "https://cdn-icons-png.flaticon.com/512/219/219986.png"
    }
});

const User = mongoose.model("User", UserSchema);

export default User;