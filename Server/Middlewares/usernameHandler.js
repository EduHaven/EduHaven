import User from "../Model/UserModel.js";
import { generateUsername } from "../utils/generateUsername.js";

// Attempt insert safely
export async function createUserWithUniqueUsername(base, userData) {
  for (let i = 0; i < 3; i++) {
    const Username = await generateUsername(base);

    try {
      const user = new User({ ...userData, Username });
      await user.save();
      return user;
    } catch (err) {
      if (err.code === 11000) {
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed to generate unique username after retries");
}

// a script to add missing usernames in old users (To Be Removed Later)
export async function handleMissingUsernames() {
  const usersWithoutUsername = await User.find({
    $or: [
      { Username: { $exists: false } },
      { Username: null },
      { Username: "" },
    ],
  });

  for (const user of usersWithoutUsername) {
    // 🔒 Guard: skip if Email missing/invalid
    if (
      !user.Email ||
      typeof user.Email !== "string" ||
      !user.Email.includes("@")
    ) {
      console.warn(`⚠️ Skipping user ${user._id}: invalid or missing Email`);
      continue;
    }

    const base = user.Email.split("@")[0];

    let updated = false;
    for (let i = 0; i < 3; i++) {
      const newUsername = await generateUsername(base);

      try {
        user.Username = newUsername;
        await user.save();
        console.log(`✅ Updated ${user.Email} → ${newUsername}`);
        updated = true;
        break;
      } catch (err) {
        if (err.code === 11000) {
          continue; // try again
        }
        throw err;
      }
    }

    if (!updated) {
      console.error(
        `❌ Failed to assign username after retries for ${user.Email || user._id}`
      );
    }
  }
}
