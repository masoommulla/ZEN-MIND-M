import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TherapistAuth from '../models/TherapistAuth.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    console.log('❌ No token provided for:', req.method, req.path);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's a therapist token
    if (decoded.role === 'therapist') {
      req.user = await TherapistAuth.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log('❌ Therapist not found for token:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'Therapist not found'
        });
      }
      console.log(`✅ Auth (Therapist): ${req.user.name} (${req.user.email}) → ${req.method} ${req.path}`);
    } else {
      // Regular user token
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log('❌ User not found for token:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      console.log(`✅ Auth (User): ${req.user.name} (${req.user.email}) → ${req.method} ${req.path}`);
    }

    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};