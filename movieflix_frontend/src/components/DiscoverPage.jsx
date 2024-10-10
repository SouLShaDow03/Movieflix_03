import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MoviesCarousel from "../utils/MoviesCarousel";
import { useInfiniteQuery } from "@tanstack/react-query";
import { requests } from "../utils/Requests.js";
import { tmdbInstance } from "../utils/axios";
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
      if (type.toLowerCase().trim() === "tv") {
        if (genreNumber) {
          url = requests.fetchTvShowsByGenre(genreNumber, pageParam);
          // console.log("fetch url : ", url);
        } else if (query) {
          url = requests.searchTvShows(query, pageParam);
        } else {
          // Handle other TV show cases, if needed
          throw new Error("No genre provided for TV shows");
        }
      }
      if (
        type.toLowerCase().trim() !== "tv" &&
        (type.toLowerCase().trim() === "movies" ||
          type.toLowerCase().trim() === "movie" ||
          type === "")
      ) {
        if (query) {
          url = requests.searchMulti(query, pageParam);
        } else if (genreNumber) {
          url = requests.fetchMovieByGenre(genreNumber, pageParam);
        } else if (queryMovies === "NowPlaying") {
          url = requests.fetchNowPlaying(pageParam);
        } else if (queryMovies === "Trending") {
          url = requests.fetchTrendingWeek(pageParam);
        } else if (queryMovies === "Indian") {
          url = requests.fetchDiscoverIndianMovies(pageParam);
        } else if (queryMovies === "Marathi") {
          url = requests.fetchMarathiMovies(pageParam);
        } else {
          throw new Error("No query parameter provided");
        }
      }
      // console.log("final url is : ", url);
      const response = await tmdbInstance.get(url);
      // console.log("fetched data:", response.data.results);
      return response.data.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
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
      <div className="absolute top-0 h-screen w-screen overflow-hidden bg-black bg-opacity-85">
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
