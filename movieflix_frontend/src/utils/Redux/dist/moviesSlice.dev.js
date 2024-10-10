"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setTrendingTvShows = exports.setMarathiMovies = exports.setIndianMovies = exports.setTrendingMovies = exports.setNowPlayingMovies = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  nowPlayingMovies: [],
  trendingMovies: [],
  indianMovies: [],
  marathiMovies: [],
  trendingTvShows: []
};
var moviesSlice = (0, _toolkit.createSlice)({
  name: 'movies',
  initialState: initialState,
  reducers: {
    setNowPlayingMovies: function setNowPlayingMovies(state, action) {
      state.nowPlayingMovies = action.payload;
    },
    setTrendingMovies: function setTrendingMovies(state, action) {
      state.trendingMovies = action.payload;
    },
    setIndianMovies: function setIndianMovies(state, action) {
      state.indianMovies = action.payload;
    },
    setMarathiMovies: function setMarathiMovies(state, action) {
      state.marathiMovies = action.payload;
    },
    setTrendingTvShows: function setTrendingTvShows(state, action) {
      state.trendingTvShows = action.payload;
    }
  }
});
var _moviesSlice$actions = moviesSlice.actions,
    setNowPlayingMovies = _moviesSlice$actions.setNowPlayingMovies,
    setTrendingMovies = _moviesSlice$actions.setTrendingMovies,
    setIndianMovies = _moviesSlice$actions.setIndianMovies,
    setMarathiMovies = _moviesSlice$actions.setMarathiMovies,
    setTrendingTvShows = _moviesSlice$actions.setTrendingTvShows;
exports.setTrendingTvShows = setTrendingTvShows;
exports.setMarathiMovies = setMarathiMovies;
exports.setIndianMovies = setIndianMovies;
exports.setTrendingMovies = setTrendingMovies;
exports.setNowPlayingMovies = setNowPlayingMovies;
var _default = moviesSlice.reducer;
exports["default"] = _default;