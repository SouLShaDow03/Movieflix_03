// src/controllers/movieController.js
const { tmdbInstance, omdbInstance } = require("../utils/axiosConfig");
const tmdbKey = process.env.TMDB_API_KEY;
const omdbKey = process.env.OMDB_API_KEY;

// Controller function to fetch trending movies today
const getTrendingMoviesToday = async (req, res) => {
	try {
		const response = await tmdbInstance.get(
			`/trending/movie/day?api_key=${tmdbKey}&region=IN&original_language=hi&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching trending movies:", error);
		res.status(500).json({ error: "Error fetching trending movies" });
	}
};

// Controller function to fetch trending movies for the week
const getTrendingMoviesWeek = async (req, res) => {
	const { page } = req.params; // Assume page is passed as a query parameter
	try {
		const response = await tmdbInstance.get(
			`/trending/movie/week?api_key=${tmdbKey}&language=en-US&page=${page}&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching trending movies for the week:", error);
		res
			.status(500)
			.json({ error: "Error fetching trending movies for the week" });
	}
};

const getDiscoverIndianMovies = async (req, res) => {
	const { page } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/discover/movie?api_key=${tmdbKey}&include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=revenue.desc&with_origin_country=IN&with_original_language=hi&year=2024`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching trending movies for the week:", error);
		res
			.status(500)
			.json({ error: "Error fetching trending movies for the week" });
	}
};

const getMarathiMovies = async (req, res) => {
	const { page } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/discover/movie?api_key=${tmdbKey}&region=IN&with_original_language=mr&page=${page}&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching trending movies for the week:", error);
		res
			.status(500)
			.json({ error: "Error fetching trending movies for the week" });
	}
};
// Controller function to fetch upcoming movies
const getUpcomingMovies = async (req, res) => {
	const { page } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/movie/upcoming?api_key=${tmdbKey}&language=en-US&page=${page}&page=1&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching upcoming movies:", error);
		res.status(500).json({ error: "Error fetching upcoming movies" });
	}
};

// Controller function to fetch now playing movies
const getNowPlayingMovies = async (req, res) => {
	const { page } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/movie/now_playing?api_key=${tmdbKey}&language=en-US&page=${page}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching now playing movies:", error);
		res.status(500).json({ error: "Error fetching now playing movies" });
	}
};

// Controller function to fetch movie by ID
/* const getMovieById = async (req, res) => {
	const { id } = req.params; // Assuming ID is passed as a URL parameter
	try {
		const response = await tmdbInstance.get(
			`/movie/${id}?api_key=${tmdbKey}&language=en-US&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching movie by ID:", error);
		res.status(500).json({ error: "Error fetching movie by ID" });
	}
}; */

// Controller function to fetch movie recommendations
const getMovieRecommendations = async (req, res) => {
	const { id } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/movie/${id}/recommendations?api_key=${tmdbKey}&language=en-US&page=1`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching movie recommendations:", error);
		res.status(500).json({ error: "Error fetching movie recommendations" });
	}
};

// Controller function to fetch TV shows by ID
const getTvShowById = async (req, res) => {
	const { id } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/tv/${id}?api_key=${tmdbKey}&language=en-US&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching TV show by ID:", error);
		res.status(500).json({ error: "Error fetching TV show by ID" });
	}
};

const getMovieByGenre = async (req, res) => {
	const { genre, page } = req.query;
	try {
		const response = await tmdbInstance.get(
			`/discover/movie?api_key=${tmdbKey}&include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=year.desc&with_genres=${genre}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching movie by genre:", error);
		res.status(500).json({ error: "Error fetching movie by genre" });
	}
};

// Controller function to search for movies
const searchMovies = async (req, res) => {
	const { query, page } = req.query;
	try {
		const response = await tmdbInstance.get(
			`/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(
				query
			)}&include_adult=false&language=en-US&page=${page}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error searching for movies:", error);
		res.status(500).json({ error: "Error searching for movies" });
	}
};

// Controller function to search for TV shows
const searchTvShows = async (req, res) => {
	const { query, page } = req.query;
	try {
		const response = await tmdbInstance.get(
			`/search/tv?api_key=${tmdbKey}&query=${encodeURIComponent(
				query
			)}&include_adult=false&language=en-US&page=${page}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error searching for TV shows:", error);
		res.status(500).json({ error: "Error searching for TV shows" });
	}
};

// Controller function to fetch OMDB data
const getOmdbData = async (req, res) => {
	const { title, year } = req.query; // Assume you pass title and year as query parameters
	try {
		const response = await omdbInstance.get(
			`/?t=${encodeURIComponent(title)}&y=${encodeURIComponent(
				year
			)}&apiKey=${omdbKey}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching OMDB data:", error);
		res.status(500).json({ error: "Error fetching OMDB data" });
	}
};

// Controller function to search OMDB movies
const searchOmdbMovies = async (req, res) => {
	const { query, page } = req.query; // Assume you pass query and page as query parameters
	try {
		const response = await omdbInstance.get(
			`/?s=${encodeURIComponent(
				query
			)}&apiKey=${omdbKey}&page=${page}&type=movie`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error searching OMDB movies:", error);
		res.status(500).json({ error: "Error searching OMDB movies" });
	}
};

const getTrendingTvShow = async (req, res) => {
	try {
		const response = await tmdbInstance.get(
			`/trending/tv/week?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching trending TV shows:", error);
		res.status(500).json({ error: "Error fetching trending TV shows" });
	}
};

const getTvShowsByGenre = async (req, res) => {
	const { genre, page } = req.query;
	try {
		const response = await tmdbInstance.get(
			`/discover/tv?api_key=${tmdbKey}&include_adult=false&include_null_first_air_dates=false&sort_by=popularity.desc&with_genres=${genre}&language=en-US&page=${page}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching TV shows by genre:", error);
		res.status(500).json({ error: "Error fetching TV shows by genre" });
	}
};

const getMovieDetail = async (req, res) => {
	const { id } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/movie/${id}?api_key=${tmdbKey}&language=en-US`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching movie detail:", error);
		res.status(500).json({ error: "Error fetching movie detail" });
	}
};

const searchMulti = async (req, res) => {
	const { query, page } = req.query;
	try {
		const response = await tmdbInstance.get(
			`/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(
				query
			)}&include_adult=false&language=en-US&page=${page}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error searching for movies:", error);
		res.status(500).json({ error: "Error searching for movies" });
	}
};

const getTvShowRecommendations = async (req, res) => {
	const { id } = req.params;
	try {
		const response = await tmdbInstance.get(
			`/tv/${id}/recommendations?api_key=${tmdbKey}&language=en-US&page=1`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching TV show recommendations:", error);
		res.status(500).json({ error: "Error fetching TV show recommendations" });
	}
};

// In your controller file
const getVideoData = async (req, res) => {
	const { type, itemId } = req.params; // Get type and itemId from route parameters
	const url = `/${type}/${itemId}/videos?api_key=${tmdbKey}`; // Using tmdbKey from the environment

	try {
		const response = await tmdbInstance.get(url);
		res.json(response.data); // Send the response data back to the client
	} catch (error) {
		console.error("Error fetching video data:", error.message);
		res.status(500).json({ error: "Error fetching video data" });
	}
};

const getGenres = async (req, res) => {
	let { type } = req.query;
	console.log("type", type);

	// Determine the type based on the query parameter
	if (!type || type === "movies") {
		type = "movie"; // Set type to 'movie' if 'movies' or empty
	} else if (type === "tv") {
		type = "tv"; // Set type to 'tv' if specified as 'tv'
	}

	try {
		const response = await tmdbInstance.get(
			`/genre/${type}/list?api_key=${tmdbKey}&language=en-US`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching genres:", error);
		res.status(500).json({ error: "Error fetching genres" });
	}
};

module.exports = {
	getTrendingMoviesToday,
	getTrendingMoviesWeek,
	getUpcomingMovies,
	getNowPlayingMovies,
	getDiscoverIndianMovies,
	getMarathiMovies,
	getMovieByGenre,
	getMovieRecommendations,
	getTvShowById,
	searchMovies,
	searchTvShows,
	getOmdbData,
	searchOmdbMovies,
	getTvShowRecommendations,
	getMovieDetail,
	getTrendingTvShow,
	getTvShowsByGenre,
	searchMulti,
	getVideoData,
	getGenres,
};
