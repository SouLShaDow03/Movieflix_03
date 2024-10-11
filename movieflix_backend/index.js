require("dotenv").config();
const cors = require("cors");
const express = require("express");
const movieRoutes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Options
const corsOptions = {
	origin: [
		"http://localhost:3000",
		"https://movieflix-03.web.app",
		"https://postman-echo.com",
	], // Allow specific origins
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
	credentials: true, // Allow cookies to be sent
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", movieRoutes); // Base route for movie-related endpoints

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
