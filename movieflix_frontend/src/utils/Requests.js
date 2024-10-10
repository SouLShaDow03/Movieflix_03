const tmdbKey = process.env.REACT_APP_TMDB_API_KEY;
const omdbKey = process.env.REACT_APP_OMDB_API_KEY;

const requests = {
  // TMDB Requests
  fetchTrendingToday: `/trending/movie/day?api_key=${tmdbKey}&region=IN&original_language=hi&include_adult=false`,
  fetchTrendingWeek: (page) =>
    `/trending/movie/week?api_key=${tmdbKey}&language=en-US&page=${page}&include_adult=false`,
  fetchDiscoverIndianMovies: (page) =>
    `/discover/movie?api_key=${tmdbKey}&include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=revenue.desc&with_origin_country=IN&with_original_language=hi&year=2024`,
  fetchMarathiMovies: (page) =>
    `/discover/movie?api_key=${tmdbKey}&region=IN&with_original_language=mr&page=${page}&include_adult=false`,
  fetchUpcomingMovies: `/movie/upcoming?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false`,
  fetchNowPlaying: (page) =>
    `/movie/now_playing?api_key=${tmdbKey}&language=en-US&page=${page}`,
  fetchTrendingTvShow: `/trending/tv/week?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false`,
  fetchMovieById: (id) =>
    `/movie/${id}?api_key=${tmdbKey}&language=en-US&include_adult=false`,
  fetchMovieByGenre: (genreId, page = 1) =>
    `/discover/movie?api_key=${tmdbKey}&include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=year.desc&with_genres=${genreId}`,
  fetchTrendingTVShowsToday: `/trending/tv/day?api_key=${tmdbKey}&region=IN`,
  fetchTvShowsByGenre: (genreId, page = 1) =>
    `/discover/tv?api_key=${tmdbKey}&include_adult=false&include_null_first_air_dates=false&sort_by=popularity.desc&with_genres=${genreId}&language=en-US&page=${page}`,
  fetchMovieDetail: (id) => `/movie/${id}?api_key=${tmdbKey}&language=en-US`,
  searchMovie: (query, page = 1) =>
    `/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`,
  searchTvShows: (query, page = 1) =>
    `/search/tv?api_key=${tmdbKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`,
  searchMulti: (query, page = 1) =>
    `/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`,
  fetchMovieRecommendations: (id) =>
    `/movie/${id}/recommendations?api_key=${tmdbKey}&language=en-US&page=1`,
  fetchTvShowById: (id) =>
    `/tv/${id}?api_key=${tmdbKey}&language=en-US&include_adult=false`,
  fetchTvShowRecommendations: (id) =>
    `/tv/${id}/recommendations?api_key=${tmdbKey}&language=en-US&page=1`,

  // OMDB Requests
  fetchOmdbData: (title, year) =>
    `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${encodeURIComponent(year)}&apiKey=${omdbKey}`,
  searchOmdbMovie: (query, page = 1) =>
    `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apiKey=${omdbKey}&page=${page}&type=movie`,
};

export { tmdbKey, requests, omdbKey };
