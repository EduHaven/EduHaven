import User from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import generateAuthToken from "../utils/GenerateAuthToken.js";

export const signup = async (req, res) => {

  try {

    const { FullName, Email, Password } = req.body;

    if (!FullName || !Email || !Password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const userExists = await User.findOne({ Email: Email });
    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }
    const haspass = await bcrypt.hash(Password, 12);
    const user = new User({
      FullName,
      Email,
      Password: haspass,
      UserProfile: "https://cdn-icons-png.flaticon.com/512/219/219986.png",
    });

    await user.save();

    const token = generateAuthToken(user._id);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),

    });

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate the token with userId and FullName
    const token = generateAuthToken(user._id, user.FullName);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true, // Prevents client-side access
    });

    return res.status(200).json({ message: "User Login Successfully", token, user });
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
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch user details and exclude the password field
    const user = await User.findById(userId).select("-Password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user);
    res.status(200).json(user); // Send user data as a response
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};