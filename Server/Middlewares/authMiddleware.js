import jwt from "jsonwebtoken";
// this chunk of code is not currently used anywhere. will may use it while adding/deleting data from DB by the user after login.

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedUser; // Attach user info to request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token. Access denied." });
    }
};

export default authMiddleware;
