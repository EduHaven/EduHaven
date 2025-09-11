import jwt from "jsonwebtoken";

const generateAuthToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      FirstName: user.FirstName,
      LastName: user.LastName,
      profileImage: user.ProfilePicture,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
};

export default generateAuthToken;
