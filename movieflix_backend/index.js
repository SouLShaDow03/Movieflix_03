// index.js
require("dotenv").config();
const express = require("express");
const movieRoutes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", movieRoutes); // Base route for movie-related endpoints

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
