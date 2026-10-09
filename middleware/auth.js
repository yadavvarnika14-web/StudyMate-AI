// middleware/auth.js
// This file contains a piece of code that runs BEFORE our protected routes.
// It checks if the user has a valid JWT token.

const jwt = require('jsonwebtoken');

// The secret key used to sign and verify tokens.
// In production, this should be an environment variable.
const SECRET = process.env.JWT_SECRET;

  function authenticateToken(req, res, next) {
    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    
    // The format is usually "Bearer <token>", so we split by space and take the second part
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token, return a 401 Unauthorized error
    if (!token) {
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using our secret key
        const decoded = jwt.verify(token, SECRET);
        
        // Attach the user ID from the token to the request object
        // This allows our route handlers to know WHO is making the request
        req.userId = decoded.userId;
        
        // Move to the next middleware or route handler
        next();
    } catch (err) {
        // If the token is invalid or expired, return a 403 Forbidden error
        return res.status(403).json({ success: false, error: 'Invalid token.' });
    }
}

module.exports = authenticateToken;
