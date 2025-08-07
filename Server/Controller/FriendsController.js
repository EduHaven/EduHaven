import User from "../Model/UserModel.js";

export const friendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "FirstName LastName ProfilePicture"
    );
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const userList = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.friends || [] } },
        { _id: { $nin: currentUser.sentRequests || [] } },
        { _id: { $nin: currentUser.friendRequests || [] } },
      ],
    }).select("FirstName LastName ProfilePicture Bio");

    res.json(users);
  } catch (err) {
    console.error("Error in userList:", err);
    res.status(500).json({ error: err.message });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    const currentUser = await User.findById(userId);
    const friendUser = await User.findById(friendId);

    if (userId.toString() === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!friendUser) {
      return res.status(404).json({ message: "Friend not found." });
    }

    if (currentUser.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends." });
    }

    if (
      currentUser.sentRequests.includes(friendId) ||
      friendUser.friendRequests.includes(userId)
    ) {
      return res.status(400).json({ message: "Request already sent." });
    }

    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friendRequests: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { sentRequests: friendId },
    });

    res.json({ message: "Friend request sent." });
  } catch (err) {
    console.error("Error in backend:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const incomingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friendRequests",
      "FirstName LastName Bio ProfilePicture"
    );
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    const user = await User.findById(userId);
    if (!user.friendRequests.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "No pending request from this user." });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: friendId },
      $addToSet: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { sentRequests: userId },
      $addToSet: { friends: userId },
    });

    res.json({ message: "Friend request accepted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { sentRequests: userId },
    });

    res.json({ message: "Friend request rejected." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    // Remove friend from both users
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.json({ message: "Friend removed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const viewSentRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "sentRequests",
      "FirstName LastName Bio ProfilePicture"
    );
    res.json(user.sentRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeSentRequest = async(req, res) =>{
  
}