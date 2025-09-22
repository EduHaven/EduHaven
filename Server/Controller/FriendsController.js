import User from "../Model/UserModel.js";

export const friendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "Email FirstName LastName ProfilePicture Username"
    );
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const userList = async (req, res) => {
  try {
    const { page = 1, limit = 20, all = false } = req.query;
    const currentUser = await User.findById(req.user._id);

    if (all) {
      const users = await User.find({
        $and: [
          { _id: { $ne: currentUser._id } },
          { _id: { $nin: currentUser.friends || [] } },
          { _id: { $nin: currentUser.sentRequests || [] } },
          { _id: { $nin: currentUser.friendRequests || [] } },
        ],
      })
        .sort({ createdAt: -1 })
        .select("FirstName LastName ProfilePicture Bio OtherDetails");

      return res.json(users);
    }

    const query = {
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.friends || [] } },
        { _id: { $nin: currentUser.sentRequests || [] } },
        { _id: { $nin: currentUser.friendRequests || [] } },
      ],
    };

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select("FirstName LastName ProfilePicture Bio OtherDetails")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const hasMore = page * limit < totalUsers; // true if more users remain

    res.json({ users, hasMore });
  } catch (err) {
    console.error("Error in userList:", err);
    res.status(500).json({ error: err.message });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    const [currentUser, friendUser] = await Promise.all([
      User.findById(userId),
      User.findById(friendId),
    ]);

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

    await Promise.all([
      User.findByIdAndUpdate(friendId, {
        $addToSet: { friendRequests: userId },
      }),
      User.findByIdAndUpdate(userId, {
        $addToSet: { sentRequests: friendId },
      }),
    ]);

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

export const getFriendsCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const count = user.friends.length;
    res.json({ count: count });
  } catch (err) {
    console.error("Error fetching friends count:", err);
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

// Enhanced getUserStats function
export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .select(
        "sessionCount totalStudyHours stats ProfilePicture FirstName LastName Bio friends"
      )
      .populate({
        path: "friends",
        select: "FirstName LastName ProfilePicture",
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userInfo: {
        firstName: user.FirstName,
        lastName: user.LastName,
        bio: user.Bio,
        profilePicture: user.ProfilePicture,
      },
      stats: {
        totalSessions: user.sessionCount || 0,
        totalHours: user.totalStudyHours || 0,
        streak: user.stats?.streak || 0,
        lastActive: user.stats?.lastActive || null,
        friends: user.friends || [],
      },
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Error fetching user stats",
    });
  }
};

export const removeSentRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { sentRequests: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friendRequests: userId },
    });

    res.json({ message: "Friend request canceled successfully." });
  } catch (err) {
    console.error("Error removing sent request:", err.message);
    res.status(500).json({ error: err.message });
  }
};
