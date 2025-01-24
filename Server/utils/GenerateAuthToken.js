import jwt from "jsonwebtoken";

// export default function generateAuthToken(user) {
//   return jwt.sign({ user }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
// }

const generateAuthToken = (userId, fullName) => {
  const token = jwt.sign({ userId, fullName }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export default generateAuthToken;