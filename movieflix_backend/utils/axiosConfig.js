// backend/axiosConfig.js
const axios = require("axios");

// Create an Axios instance for TMDB
const tmdbInstance = axios.create({
	baseURL: "https://api.themoviedb.org/3",
});

// Create an Axios instance for OMDB
const omdbInstance = axios.create({
	baseURL: "http://www.omdbapi.com",
});

// Export the Axios instances
module.exports = { tmdbInstance, omdbInstance };
