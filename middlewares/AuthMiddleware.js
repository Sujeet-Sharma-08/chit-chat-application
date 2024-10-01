import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Safely access the cookies object
    // console.log("token from middleware", token)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access!, please log in!',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.existingUser = decoded; 
    
    // calling next middleware or function
    next();

  } catch (error) {
    
    // Handle specific token errors (like expiration)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired, please log in again!',
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, please log in again!',
      });
    } else {
      // Handle any other errors
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
};
