// src/routes/movieRoutes.js
require("dotenv").config();
const express = require("express");
const router = express.Router();

// Import all controller functions as an object
const controller = require("../controllers/controller.js"); // Adjust path as needed

// Define your routes using the controller object with the decryption middleware
router.get(
	"/trending/movie/day",

	controller.getTrendingMoviesToday
);
router.get("/trending/movie/week/:page", controller.getTrendingMoviesWeek);
router.get(
	"/movie/indian/:page",

	controller.getDiscoverIndianMovies
);
router.get("/movie/marathi/:page", controller.getMarathiMovies);
router.get("/movie/upcoming/:page", controller.getUpcomingMovies);
router.get(
	"/movie/now_playing/:page",

	controller.getNowPlayingMovies
);
router.get("/tv/:id", controller.getTvShowById);
router.get("/search/movie", controller.searchMovies);
router.get("/search/tv", controller.searchTvShows);
router.get("/omdb", controller.getOmdbData);
router.get("/omdb/search", controller.searchOmdbMovies);
router.get("/search", controller.searchMulti);
router.get("/movie/:id", controller.getMovieDetail);
router.get("/trending/tv/day", controller.getTrendingTvShow);
router.get("/:type/:itemId/videos", controller.getVideoData);
router.get("/tv/:id/recommendations", controller.getTvShowRecommendations);
router.get("/movie/:id/recommendations", controller.getMovieRecommendations);
router.get("/movies", controller.getMovieByGenre);
router.get("/tv", controller.getTvShowsByGenre);
// Export the router
module.exports = router; // Use CommonJS export
