import User from "../Model/UserModel.js";
import friends from "../Model/FriendModel.js";
import bcrypt from "bcrypt";
import generateAuthToken from "../utils/GenerateAuthToken.js";
import mongoose from "mongoose";
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmehndmws',
  api_key: process.env.CLOUDINARY_API_KEY || '772976768998728',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'BXpWyZHYKbAexc3conUG88t6TVM'
});

export const signup = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password } = req.body;

    if (!FirstName || !LastName || !Email || !Password) {
      return res.status(422).json({ error: 'Please fill all the fields' });
    }
    const userExists = await User.findOne({ Email: Email });
    if (userExists) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const haspass = await bcrypt.hash(Password, 12);
    const user = new User({
      FirstName,
      LastName,
      Email,
      Password: haspass,
      ProfilePicture: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
    });

    await user.save();

    const token = generateAuthToken(user);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 86400000),
    });

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user._id;
    const updateData = req.body;

    // Prevent updating sensitive fields
    const forbiddenFields = ['_id', 'Email', 'Password'];
    forbiddenFields.forEach(field => {
      if (updateData[field]) {
        delete updateData[field];
      }
    });

    // Validate graduation year if provided
    if (updateData.GraduationYear) {
      const currentYear = new Date().getFullYear();
      if (updateData.GraduationYear < 1900 || updateData.GraduationYear > currentYear + 10) {
        return res.status(400).json({ error: 'Invalid graduation year' });
      }
    }

    // Validate bio length
    if (updateData.Bio && updateData.Bio.length > 500) {
      return res.status(400).json({ error: 'Bio cannot exceed 500 characters' });
    }

    // Handle OtherDetails
    if (updateData.OtherDetails) {
      // Validate OtherDetails
      if (typeof updateData.OtherDetails !== 'object') {
        return res.status(400).json({ error: 'OtherDetails must be an object' });
      }

      // Optional: Add specific validations for OtherDetails
      const MAX_DETAILS_LENGTH = 1000;
      Object.entries(updateData.OtherDetails).forEach(([key, value]) => {
        if (typeof value === 'string' && value.length > MAX_DETAILS_LENGTH) {
          return res.status(400).json({ 
            error: `${key} in OtherDetails cannot exceed ${MAX_DETAILS_LENGTH} characters` 
          });
        }
      });
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updateData }, 
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run mongoose validation
      }
    ).select('-Password');  // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(422).json({ error: 'Please fill all the fields' });
    }
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate the token with userId and FullName
    const token = generateAuthToken(user);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true, // Prevents client-side access
    });

    return res.status(200).json({ message: 'User Login Successfully', token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// export const logout = async (req, res) => {
//   res.clearCookie("token");
//   return res.status(200).json({ message: "User logout successfully" });
// };

export const logout = async (req, res) => {
  try {
    // Clear the auth token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: "strict",
    });

    // Send success response
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Logout failed" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.query.id;  
     
    if (!userId || userId === "undefined") {
      return res
        .status(400)
        .json({ error: "User ID is required and cannot be undefined" });
    }

    const user = await User.findById(userId).select("-Password");
     
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures',
      transformation: [
        { width: 500, height: 500, crop: 'limit' }, // Resize and limit image size
        { quality: 'auto' } // Optimize image quality
      ]
    });

    // Update user's profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { ProfilePicture: result.secure_url }, 
      { new: true }
    ).select('-Password');

    return res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: result.secure_url,
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return res.status(500).json({ 
      error: 'Failed to upload profile picture', 
      details: error.message 
    });
  }
};
export const getFriends=async (req,res) =>{
    try{
      const userId=req.params.userId;
      // Check if it's a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      const user=await friends.findOne({userId:userId});
      if(!user){
        return res.status(200).json({'friends':[]});
      }
      const userFriends=Array.from(user.friends.entries()).map(([friendId,friendData])=>({
        friendId,
        friendName:friendData.friendName
      }));
      return res.status(200).json({'friends':userFriends});


    }
    catch(error){
      console.error("Error fetching friends:", error);
    }
};

export const addFriend=async (req,res)=>{
    try{
      
      const {userId,friendId}=req.body;
      // Check if it's a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      // Check if it's a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ message: 'Invalid friend ID format' });
      }

      if(userId==friendId)
      {
        return res.status(400).json({ message: 'Cannot add yourself' });
      }

      let user=await friends.findOne({userId:userId});
      let userFriend=await friends.findOne({userId:friendId});
      if(!user){
        user=new friends({userId:userId,friends:{}});
        await user.save();
      }
      if(!userFriend)
      {
        userFriend=new friends({userId:friendId,friends:{}});
        await userFriend.save();
      }

      const userData=await User.findById(userId);
      const friendData=await User.findById(friendId);
      if(!userData)
      {
        return res.status(404).json({'message':'User not found'});
      }
      if(!friendData)
      {
        return res.status(404).json({'message':'Friend not found'});
      }
      const userName=userData.FullName;
      const friendName=friendData.FullName;
      
      user.friends.set(friendId,{friendName:friendName});
      await user.save();

      userFriend.friends.set(userId,{friendName:userName});
      await userFriend.save();

      res.json({'message':"friend added successfully"});


    }
    catch(error){
      console.error("Error adding friend:", error);
    }

}

export const removeFriend=async (req,res)=>{
  try{
    const {userId,friendId}=req.body;

    
    // Check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid friend ID format' });
    }

    const user=await friends.findOne({userId:userId});
    const userFriend=await friends.findOne({userId:friendId});
    if(!user){
      return res.status(404).json({'message':'User not found'});
    }

    if(!user.friends.has(friendId))
    {
      return res.status(400).json({ message: 'Friend not found in the list' });
    }

    user.friends.delete(friendId);
    await user.save();

    userFriend.friends.delete(userId);
    await userFriend.save();

    res.json({'message':"friend removed successfully"});


  }
  catch(error){
    console.error("Error adding friend:", error);
  }

}

export const getUsers=async (req,res)=>{
    try{
        const userId=req.params.userId;
        // Check if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const friendsData=await friends.findOne({userId:userId});
        if( !friendsData || friendsData.friends.length==0 )
        {
          
          // Find all users and select only the '_id' and 'name' fields
          const users = await User.find().select('_id FullName');
          return res.status(200).json({"users":users});
        }
        else
        {
          const userFriends=friendsData.friends;
          let users = await User.find().select('_id FullName');
          users=users.map(user=>({
            _id: user._id.toString(),
            FullName: user.FullName.toString()
          }))
          const NotFriends=users.filter(user=>{
            return !userFriends.has(user._id);
          })

          return res.status(200).json({"users":NotFriends});
        }
    }
    catch(error){
      console.error("Error fetching users:", error);
    }


}