import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
 
import dotenv from 'dotenv';
import Admin from '../models/adminModel.js';
import Student from "../models/userModel.js"
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
 
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
       console.log(decoded)
      req.user = await Admin.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(404);
        throw new Error('User not found');
      }

      next(); 
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
const protectStudent = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
       console.log(decoded)
      req.user = await Student.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(404);
        throw new Error('User not found');
      }

      next(); 
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
 
const authorizeAdmin = (req, res, next) => {
  const allowedRoles = ['admin', 'superadmin']; // Specify allowed roles

  if (req.user && allowedRoles.includes(req.user.role)) {
    req.admin=req.user
    next();  
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Only admins and superadmins are allowed.',
    });
  }
};


// **Authorize Specific Role Middleware**
// Ensures the user has a specific role (dynamic)
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next(); // User is authorized
    } else {
      res.status(403);
      throw new Error(`Access denied. Requires one of the following roles: ${roles.join(', ')}`);
    }
  };
};

export { protect, authorizeAdmin, authorizeRole,protectStudent };
