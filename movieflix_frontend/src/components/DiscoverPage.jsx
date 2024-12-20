import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MoviesCarousel from "../utils/MoviesCarousel";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { genreMapping } from "../utils/GenreMapping.js";
import Error from "./error.jsx";
import { useInView } from "react-intersection-observer";
import { useSearch } from "../utils/SearchContext"; // Import useSearch hook

const DiscoverPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  // const searchQuery = params.get("search") || "";
  const genreNumber = params.get("genre");
  const queryMovies = params.get("movies");
  const type = params.get("type") || "";
  const { isSearchBarOpen, setSearchQuery: setContextSearchQuery } =
    useSearch(); // Use context
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    // Set the query from context if the search bar is open
    if (isSearchBarOpen) {
      setContextSearchQuery(query);
    } else {
      // Reset search query if search bar is not open
      setContextSearchQuery("");
    }
  }, [isSearchBarOpen, query, setContextSearchQuery]);

  // Effect to determine if redirection should be set
  useEffect(() => {
    // Check if `query`, `genreNumber`, and `queryMovies` are empty
    if (!query && !genreNumber && !queryMovies) {
      setShouldRedirect(true);
    } else if (!query && genreNumber && !queryMovies) {
      setShouldRedirect(false);
    } else if (!query) {
      if (!genreNumber && !queryMovies && !type) {
        setShouldRedirect(true);
      }
    } else {
      setShouldRedirect(false);
    }
  }, [query, genreNumber, queryMovies, type]);

  // Effect to handle redirection
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        navigate("/browse", { replace: true });
      }, 7000);

      // Clear the timer if component unmounts or redirection condition changes
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  const fetchData = async ({ pageParam = 1 }) => {
    try {
      let url;

      // TV Shows Logic
      if (type.toLowerCase().trim() === "tv") {
        if (genreNumber) {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/tv?genre=${genreNumber}&page=${pageParam}`;
          console.log("Fetching TV data with genre:", genreNumber, "URL:", url);
        } else if (query) {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/search?query=${encodeURIComponent(query)}&page=${pageParam}`;
          console.log("Fetching TV data with query:", query, "URL:", url);
        } else {
          throw new Error("No genre or query provided for TV shows");
        }
      }

      // Movies Logic
      if (
        type.toLowerCase().trim() === "movies" ||
        type.toLowerCase().trim() === "movie" ||
        type === ""
      ) {
        if (query) {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/search?query=${encodeURIComponent(query)}&page=${pageParam}`;
          console.log("Fetching Movie data with query:", query, "URL:", url);
        } else if (genreNumber) {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/movies?genre=${genreNumber}&page=${pageParam}`;
          console.log(
            "Fetching Movie data with genre:",
            genreNumber,
            "URL:",
            url,
          );
        } else if (queryMovies === "NowPlaying") {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/movie/now_playing/${pageParam}`;
          console.log("Fetching Now Playing movies, URL:", url);
        } else if (queryMovies === "Trending") {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/trending/movie/week/${pageParam}`;
          console.log("Fetching Trending movies, URL:", url);
        } else if (queryMovies === "Indian") {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/movie/indian/${pageParam}`;
          console.log("Fetching Indian movies, URL:", url);
        } else if (queryMovies === "Marathi") {
          url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/movie/marathi/${pageParam}`;
          console.log("Fetching Marathi movies, URL:", url);
        } else {
          throw new Error("No query or genre provided for Movies");
        }
      }

      if (!url) {
        throw new Error("URL not properly constructed");
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching data:", response.status, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching movies or TV shows:", error);
      throw error;
    }
  };

  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["moviesData", query, genreNumber, queryMovies],
      queryFn: fetchData,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 0 ? undefined : pages.length + 1,
      enabled: !!query || !!genreNumber || !!queryMovies,
    });

  useEffect(() => {
    const handleBackButton = debounce(() => {
      setContextSearchQuery(""); // Reset search query on back button
      navigate("/browse", { replace: true });
    }, 800);

    window.addEventListener("popstate", handleBackButton);

    return () => window.removeEventListener("popstate", handleBackButton);
  }, [navigate, setContextSearchQuery]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="absolute top-0 h-screen w-screen overflow-hidden bg-black">
        <Header />
        <div className="relative top-0 flex min-h-full max-w-full items-center justify-center bg-black">
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  if (error || !data || data.pages.flat().length === 0) {
    return (
      <div className="relative top-0 h-fit w-fit overflow-hidden bg-black bg-opacity-85">
        <Header />
        {/* <Error /> */}
        {!query && (
          <div className="relative top-20 flex h-full w-full items-start justify-center">
            <p className="h-fit w-fit text-[28px] font-bold text-white">
              Search Something :(
            </p>
          </div>
        )}
        {!query &&
          type === "tv" &&
          (genreNumber === 28 || genreNumber === 12) && (
            <div className="relative top-20 flex h-full w-full items-start justify-center">
              <p className="h-fit w-fit text-[28px] font-bold text-white">
                Genre Not Available for Tv Shows!!!
              </p>
            </div>
          )}
      </div>
    );
  }

  const filteredMovies = data.pages
    .flat()
    .filter((movie) => movie.backdrop_path);

  return (
    <div className="absolute top-0 z-0 min-h-screen w-screen overflow-x-hidden overflow-y-scroll bg-black bg-opacity-90">
      <Header />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-fit w-screen bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-500"></div>

      {(genreNumber || queryMovies) && (
        <div className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-white">
          {genreMapping[genreNumber] || queryMovies}{" "}
          {type === "tv" ? "Shows" : "Movies"}
        </div>
      )}

      {query && (
        <div className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-white">
          Search Results for {query}
        </div>
      )}

      <div className="relative top-20 z-10 mx-2 grid max-h-full max-w-full grid-cols-5 gap-1 px-2">
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <div className="mx-2 max-h-[25vh] max-w-[25vw] py-2 outline-1 hover:z-30 hover:ml-4 hover:max-h-fit hover:max-w-fit hover:scale-125">
              <MoviesCarousel movie={movie} />
            </div>
          </div>
        ))}
      </div>

      <div ref={ref} className="h-16"></div>
    </div>
  );
};

export default DiscoverPage;
