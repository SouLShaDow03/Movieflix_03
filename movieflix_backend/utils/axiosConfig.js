// backend/axiosConfig.js
const axios = require("axios");
const axiosRetry = require("axios-retry").default;

// Create an Axios instance for TMDB
const tmdbInstance = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	timeout: 15000,
});

// Apply retry logic to TMDB instance
axiosRetry(tmdbInstance, {
	retries: 10, // Maximum retry attempts
	retryDelay: (retryCount) => {
		// Exponential backoff with jitter
		return Math.pow(2, retryCount) * 100 + Math.random() * 100;
	},
	retryCondition: (error) => {
		// Retry on network errors or 5xx errors
		return (
			axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
		);
	},
});

// Create an Axios instance for OMDB
const omdbInstance = axios.create({
	baseURL: "http://www.omdbapi.com",
	timeout: 7000,
});

// Apply retry logic to OMDB instance
axiosRetry(omdbInstance, {
	retries: 10,
	retryDelay: (retryCount) =>
		Math.pow(2, retryCount) * 100 + Math.random() * 100,
	retryCondition: (error) =>
		axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
});

module.exports = { tmdbInstance, omdbInstance };
