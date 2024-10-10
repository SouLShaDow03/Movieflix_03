"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omdbKey = exports.requests = exports.tmdbKey = void 0;
var tmdbKey = process.env.REACT_APP_TMDB_API_KEY;
exports.tmdbKey = tmdbKey;
var omdbKey = process.env.REACT_APP_OMDB_API_KEY;
exports.omdbKey = omdbKey;
var requests = {
  //Tmdb Requests
  // fetchLatestMovies : `/movie/latest?api_key=${tmdbKey}&region=IN&original_language=hi`,
  fetchTrendingToday: "/trending/movie/day?api_key=".concat(tmdbKey, "&region=IN&original_language=hi"),
  fetchTrendingWeek: "/trending/movie/week?api_key=".concat(tmdbKey, "&region=IN&original_language=hi"),
  fetchDiscoverIndianMovies: "/discover/movie?api_key=".concat(tmdbKey, "&region=IN&with_original_language=hi"),
  fetchMarathiMovies: "/discover/movie?api_key=".concat(tmdbKey, "&region=IN&with_original_language=mr"),
  fetchUpcomingMovies: "/movie/upcoming?api_key=".concat(tmdbKey, "&language=en-US&page=1"),
  fetchNowPlaying: "/movie/now_playing?api_key=".concat(tmdbKey, "&language=en-US"),
  fetchTrendingTvShow: "/trending/tv/week?api_key=".concat(tmdbKey, "&language=en-US&page=1"),
  fetchAnimeShows: "/discover/tv?api_key=".concat(tmdbKey, "&language=en-US&page=1&with_genres=16"),
  //search movie 
  searchMovie: function searchMovie(query) {
    return "/search/movie?api_key=".concat(tmdbKey, "&query=").concat(encodeURIComponent(query), "&include_adult=true&language=en-US&page=1");
  },
  // Omdb requests 
  fetchOmdbData: function fetchOmdbData(title, year) {
    return "/?t=".concat(encodeURIComponent(title), "&y=").concat(encodeURIComponent(year), "&apiKey=").concat(omdbKey);
  }
};
exports.requests = requests;