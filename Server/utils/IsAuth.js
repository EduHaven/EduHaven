import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
    const token = req.headers.activationToken;
    if (!token) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "You must be logged in" });
    }
}
