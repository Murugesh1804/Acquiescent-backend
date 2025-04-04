import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = "1234567890";

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>"
  } else {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password"); 
    
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
