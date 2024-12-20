import { useDispatch } from "react-redux";
import { useCallback } from "react";
import Cookies from "js-cookie";

// Utility functions
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getUniqueAndFilteredMovies = (array) => {
  const seenTitles = new Set();
  return array.filter((movie) => {
    const title = movie.title || movie.name; // Use title for movies, name for TV shows
    if (
      seenTitles.has(title) ||
      !movie.backdrop_path ||
      !movie.poster_path ||
      !movie.id
    ) {
      return false;
    } else {
      seenTitles.add(title);
      return true;
    }
  });
};

const useFetchWithToken = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("authToken"); // Get the token from cookies

  // General fetch function
  const fetchDataWithToken = useCallback(
    async (url, action, processResults = (data) => data) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials with the request
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching data:", response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const processedData = processResults(data);
        // Conditionally dispatch if an action is provided
        if (action) {
          dispatch(action(processedData));
          // console.log("Fetched data after dispatch :", processedData);
          return processedData;
        } else {
          // console.log("Fetched data:", processedData);
          return processedData;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [dispatch, token],
  );

  return { fetchDataWithToken, shuffleArray, getUniqueAndFilteredMovies };
};

export default useFetchWithToken;
