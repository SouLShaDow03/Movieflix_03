/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import MovieModal from "./MovieModal";
import SkeletonLoader from "./SkeletonLoader"; // Import SkeletonLoader component

const Poster = ({ movie = {}, movieId }) => {
  const [movieData, setMovieData] = useState(movie || {});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(
    movieId && Object.keys(movie).length === 0,
  ); // Only set loading if movieId is provided and no movie data

  // Fetch movie details only if movieId is present and no movie is passed
  const fetchMovieDetails = useCallback(async () => {
    // if (!movieId || Object.keys(movie).length > 0) return;
    try {
      setLoading(true); // Trigger loading while fetching
      const url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/movie/${movieId}`;
      const response = await fetch(url);
      if (!response.ok) {
        // Log the status code and the response text for debugging
        const errorText = await response.text(); // Get the raw response text
        console.error("Error fetching data:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Await the JSON parsing
      // console.log("Movie data : ", data);
      setMovieData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId && Object.keys(movieData).length === 0) {
      fetchMovieDetails(); // Only fetch when there’s a movieId and no movie data
    }
  }, [fetchMovieDetails, movieData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="relative grid min-h-fit max-w-full grid-cols-1 gap-1 overflow-hidden">
      {loading ? (
        <SkeletonLoader height={40} width={100} /> // Adjust height and width as needed
      ) : (
        <div
          key={movieData.id}
          className="relative z-20 h-fit select-none text-white"
          onClick={handleOpen}
        >
          {movieData.poster_path && (
            <img
              className="max-h-[40vh] w-full object-cover"
              src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`}
              alt={movieData.title || movieData.name}
            />
          )}
        </div>
      )}
      <MovieModal open={open} handleClose={handleClose} movie={movieData} />
    </div>
  );
};

export default Poster;
