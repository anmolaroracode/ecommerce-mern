const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]; // <-- FIXED

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Users.findById(decoded.user.id).select("-password"); // Exclude password
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("Token Verification Failed:", error.message);
            res.status(401).json({ message: "Token Verification Failed" });
        }
    } else {
        res.status(401).json({ message: "Not Authorized, No Token Provided" });
    }
};

const admin = (req, res, next)=>{
    if(req.user && req.user.role === "admin"){
      return  next();
    }
    res.status(403).json({message: "Only Admin Can Do It You Are Not Authorized"})
}

module.exports = { protect, admin };
