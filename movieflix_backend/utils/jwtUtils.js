// src/utils/jwtUtils.js
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // Ensure you have this key in your environment variables

// Function to generate a token
const generateToken = (userId) => {
	return jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" }); // Token expires in 1 hour
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1]; // Extract token after 'Bearer '
	if (!token) {
		return res.status(401).json({ error: "Token is required" });
	}
	jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: "Invalid token" });
		}
		req.userId = decoded.id; // Save user ID in request for further use
		next();
	});
};

module.exports = {
	generateToken,
	verifyToken,
};
