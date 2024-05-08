// authMiddleware.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config'); // Your secret key for JWT

// Middleware function to authenticate requests
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  if(req.originalUrl.includes("login") || req.originalUrl.includes("signUp")){
    next();
  }
  
  const token = req.headers['authorization'];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // If token is valid, attach the decoded user information to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  });
};

module.exports = {authMiddleware};
