import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import TrendingCarousel from "../utils/TrendingCarousel.jsx";
import MoviesCarousel from "../utils/MoviesCarousel.jsx";
import Poster from "../utils/Poster.jsx";
import { MdArrowForwardIos } from "react-icons/md";
import * as moviesActions from "../utils/Redux/moviesSlice.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Browse = () => {
  const dispatch = useDispatch();
  const [firebaseMovies, setFirebaseMovies] = React.useState([]);
  const nowPlayingMovies = useSelector(
    (state) => state.movies.nowPlayingMovies,
  );
  // eslint-disable-next-line no-unused-vars
  const trendingMovies = useSelector((state) => state.movies.trendingMovies);
  const indianMovies = useSelector((state) => state.movies.indianMovies);
  const marathiMovies = useSelector((state) => state.movies.marathiMovies);
  // const trendingTvShows = useSelector((state) => state.movies.trendingTvShows);
  const actionMovies = useSelector((state) => state.movies.actionMovies);
  const animationMovies = useSelector((state) => state.movies.animationMovies);
  const mysteryMovies = useSelector((state) => state.movies.mysteryMovies);
  const crimeMovies = useSelector((state) => state.movies.crimeMovies);

  const nowPlayingIndex = [...Array(3).keys()];
  const moviesIndex = [...Array(8).keys()];
  const trendingIndex = [...Array(5).keys()];

  const svgPaths = [
    // SVG path for rank-1
    "M35.377 152H72V2.538L2 19.362v30.341l33.377-8.459V152z",

    // SVG path for rank-2
    "M3.72 152H113v-30.174H50.484l4.355-3.55 29.453-24.012c5.088-4.124 9.748-8.459 13.983-13.004 4.16-4.464 7.481-9.339 9.972-14.629 2.449-5.203 3.678-11.113 3.678-17.749 0-9.428-2.294-17.627-6.875-24.645-4.597-7.042-10.941-12.494-19.07-16.376C77.803 3.957 68.496 2 58.036 2 47.591 2 38.37 4.023 30.347 8.06c-8.015 4.032-14.457 9.578-19.352 16.654-4.492 6.493-7.389 13.803-8.693 21.952h34.055c1.236-3.52 3.398-6.52 6.459-8.97 3.54-2.834 8.277-4.224 14.147-4.224 5.93 0 10.552 1.537 13.76 4.681 3.181 3.12 4.791 7.024 4.791 11.594 0 4.151-1.16 7.934-3.468 11.298-2.192 3.194-5.987 7.124-11.405 11.84L3.72 122.465V152z",

    // SVG path for rank-3
    "M3.809 41.577h33.243c1.3-2.702 3.545-4.947 6.674-6.72 3.554-2.015 7.83-3.01 12.798-3.01 5.555 0 10.14 1.11 13.723 3.376 3.839 2.427 5.782 6.283 5.782 11.315 0 4.553-1.853 8.395-5.473 11.38-3.547 2.926-8.18 4.37-13.821 4.37H41.44v28.366h16.77c5.572 0 10.275 1.227 14.068 3.711 4.02 2.633 6.071 6.581 6.071 11.616 0 5.705-1.943 9.975-5.853 12.562-3.658 2.42-8.292 3.61-13.863 3.61-5.205 0-9.82-.94-13.827-2.836-3.698-1.75-6.32-4.272-7.785-7.529H2.33c2.096 12.089 7.761 21.65 17.028 28.78C29.242 148.175 42.594 152 59.476 152c10.706 0 20.175-1.783 28.42-5.337 8.185-3.528 14.575-8.486 19.208-14.884 4.595-6.346 6.896-13.938 6.896-22.837 0-6.952-1.93-13.494-5.81-19.666-3.815-6.07-9.68-10.367-17.683-12.908l-5.46-1.735 5.353-2.04c6.659-2.538 11.667-6.338 15.083-11.412 3.431-5.096 5.142-10.806 5.142-17.181 0-8.471-2.262-15.778-6.787-21.985-4.574-6.275-10.7-11.17-18.408-14.696C77.683 3.775 69.109 2 59.687 2 44.084 2 31.515 5.816 21.91 13.415c-9 7.119-15.025 16.486-18.101 28.162z",

    // SVG path for rank-4
    "M72 152h35.333v-30.977H128V92.497h-20.667V2H69.89L2 92.712v28.311h70V152zM36.202 92.188l35.93-47.998v47.998h-35.93z",

    // SVG path for rank-5
    "M105.588 32.174V2H13.534l-8.3 88.357h32.463c2.145-2.362 4.866-4.254 8.143-5.675 3.585-1.554 7.543-2.328 11.859-2.328 6.247 0 11.418 1.745 15.418 5.255 4.061 3.564 6.104 8.37 6.104 14.265 0 6.041-2.044 10.89-6.121 14.387-3.999 3.43-9.162 5.132-15.401 5.132-4.299 0-8.17-.694-11.601-2.095-3.11-1.268-5.577-2.946-7.368-5.042H2.592c3.308 11.593 9.782 20.623 19.46 27.164C32.472 148.464 45.64 152 61.602 152c10.12 0 19.294-1.99 27.548-5.966 8.198-3.949 14.711-9.718 19.572-17.335 4.844-7.59 7.278-16.95 7.278-28.123 0-9.182-2.013-17.314-6.032-24.431-4.02-7.118-9.514-12.7-16.51-16.775-6.99-4.072-14.849-6.109-23.612-6.109-11.06 0-20.099 3.483-27.234 10.461l-3.892 3.806 3.273-35.354h63.595z",
  ];

  useEffect(() => {
    const fetchFirebaseMovies = async () => {
      try {
        const moviesCollection = collection(db, "UPLOADS");
        const movieSnapshot = await getDocs(moviesCollection);
        const moviesList = movieSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFirebaseMovies(moviesList);
        console.log("Firebase movies:", moviesList);
      } catch (error) {
        console.error("Error fetching Firebase movies:", error);
      }
    };

    fetchFirebaseMovies();
  }, []);

  // Fetch and process data function
  const fetchData = async (url, action) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Log the status code and the response text for debugging
        const errorText = await response.text(); // Get the raw response text
        console.error("Error fetching data:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Await the JSON parsing
      // console.log("Browse page response:", data);
      const shuffledMovies = shuffleArray(data.results);
      const uniqueMovies = getUniqueAndFilteredMovies(shuffledMovies);
      dispatch(action(uniqueMovies));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchTrendingMovies = async (url, action) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Log the status code and the response text for debugging
        const errorText = await response.text(); // Get the raw response text
        console.error("Error fetching data:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Await the JSON parsing
      const uniqueMovies = getUniqueAndFilteredMovies(data.results);
      dispatch(action(uniqueMovies));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchMoviesByGenre = async (
    id,
    action,
    page = 1,
    accumulatedMovies = [],
  ) => {
    try {
      const url = `/api/movies?genre=${id}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        // Log the status code and the response text for debugging
        const errorText = await response.text(); // Get the raw response text
        console.error("Error fetching data:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Await the JSON parsing
      const uniqueMovies = getUniqueAndFilteredMovies(data.results);
      const combinedMovies = [...accumulatedMovies, ...uniqueMovies];
      dispatch(action(combinedMovies));
      if (combinedMovies.length >= moviesIndex.length) {
        return;
      }
      if ((await response.json()).data.total_pages > page) {
        fetchMoviesByGenre(id, action, page + 1, combinedMovies);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Filter unique and valid movies
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

  useEffect(() => {
    const page = 1;
    fetchData(
      `/api/movie/now_playing/${page}`,
      moviesActions.setNowPlayingMovies,
    );
    // fetchData(requests.fetchTrendingWeek, moviesActions.setTrendingMovies);
    fetchTrendingMovies(
      `/api/trending/movie/week/${page}`,
      moviesActions.setTrendingMovies,
    );
    fetchData(`/api/movie/indian/${page}`, moviesActions.setIndianMovies);
    fetchData(`/api/movie/marathi/${page}`, moviesActions.setMarathiMovies);
    fetchData(`/api/trending/tv/day`, moviesActions.setTrendingTvShows);
    fetchMoviesByGenre(28, moviesActions.setActionMovies);
    fetchMoviesByGenre(16, moviesActions.setAnimationMovies);
    fetchMoviesByGenre(9648, moviesActions.setMysteryMovies);
    fetchMoviesByGenre(80, moviesActions.setCrimeMovies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="relative z-0 h-fit w-fit overflow-hidden bg-black bg-opacity-65">
      <Header />
      {/* black transition */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 min-h-[440vh] w-[80vw] bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-500"></div>
      {/* background screen increasing component */}
      <div className="absolute top-0 z-[-1] flex h-[440vh] w-screen bg-black bg-opacity-80"></div>
      <div className="relative top-2 grid h-fit grid-cols-[70vw_30vw]">
        <div className="relative ml-3 overflow-hidden rounded-2xl border border-white shadow-custom-red-bottom-right">
          <TrendingCarousel type="movie" />
        </div>
        <div className="relative ml-6 flex h-fit w-[25vw] flex-shrink-0 flex-col gap-2">
          <div className="relative flex items-start justify-start gap-2 p-2">
            <span className="relative flex h-fit w-fit text-2xl font-semibold text-white">
              Now Playing
            </span>
            <span className="relative mt-1 text-2xl">
              <Link to={`/discover?movies=NowPlaying`}>
                <button>
                  <MdArrowForwardIos fill="white" />
                </button>
              </Link>
            </span>
          </div>
          {nowPlayingIndex.map((index) => (
            <div
              key={index}
              className="relative h-[23vh] flex-shrink-0 overflow-hidden rounded-2xl shadow-md shadow-black hover:scale-110 hover:border-2 hover:border-white focus:border-white"
            >
              <MoviesCarousel movie={nowPlayingMovies[index]} />
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-7 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative h-fit w-fit text-[2.2rem] font-bold text-white">
            Trending Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?movies=Trending">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative grid grid-cols-5 gap-3">
          {trendingIndex.map((index) => (
            <div key={index}>
              {trendingMovies[index] ? (
                <>
                  <div className="pointer-events-none absolute z-40 flex h-[40vh] w-[30vh] place-items-end justify-start">
                    <svg
                      id={`rank-${index + 1}`}
                      width="35%"
                      height="35%"
                      viewBox="0 0 80 154"
                      class={`svg-icon svg-icon-rank-${index + 1} top-10-rank`}
                    >
                      <path
                        stroke="#595959"
                        strokeLinecap="square"
                        strokeWidth="4"
                        d={svgPaths[index % svgPaths.length]} // Loop through SVG paths
                      />
                    </svg>
                  </div>
                  <div className="relative z-30 mx-5 max-h-[50vh] max-w-fit overflow-hidden hover:scale-110 hover:cursor-pointer max-sm:max-h-[25vh]">
                    <Poster
                      movie={trendingMovies[index]}
                      movieId={trendingMovies[index].id}
                    />
                  </div>
                </>
              ) : (
                <div className="mx-5 max-h-[50vh] max-w-fit">
                  {/* Optionally show a loading skeleton or placeholder here */}
                  Loading...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Indian Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?movies=Indian">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {moviesIndex.map((index) => (
              <SwiperSlide
                key={index}
                className="relative max-h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={indianMovies[index]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Marathi Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?movies=Marathi">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {moviesIndex.map((index) => (
              <SwiperSlide
                key={index}
                className="relative h-[25vh] w-[25vw] flex-shrink-0 rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={marathiMovies[index]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Movieflix Specials
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/specials">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 overflow-x-auto p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {firebaseMovies.slice(0, 8).map((movieURL, index) => (
              <SwiperSlide
                key={index}
                className="relative h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={movieURL} isFirebaseMovie={true} />{" "}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Action Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?genre=28">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 overflow-x-auto p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {moviesIndex.map((index) => (
              <SwiperSlide
                key={index}
                className="relative h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={actionMovies[index]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Animation Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?genre=16">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 overflow-x-auto p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {moviesIndex.map((index) => (
              <SwiperSlide
                key={index}
                className="relative h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={animationMovies[index]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Mystery Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?genre=9648">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 overflow-x-auto p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {moviesIndex.map((index) => (
              <SwiperSlide
                key={index}
                className="relative h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={mysteryMovies[index]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative z-20 mx-3 mt-8 h-fit w-screen">
        <div className="relative flex items-start justify-start gap-2 p-2">
          <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
            Crime Movies
          </span>
          <span className="relative pt-4 text-2xl">
            <Link to="/discover?genre=80">
              <button>
                <MdArrowForwardIos fill="white" />
              </button>
            </Link>
          </span>
        </div>
        <div className="relative flex h-fit w-full flex-nowrap space-x-4 overflow-x-auto p-3">
          <Swiper
            spaceBetween={10}
            slidesPerView={"4"}
            direction="horizontal"
            modules={[Mousewheel]}
            mousewheel={{ releaseOnEdges: true }}
            className="h-[25vh] w-full"
          >
            {moviesIndex.map((index) => (
              <SwiperSlide
                key={index}
                className="relative h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
              >
                <MoviesCarousel movie={crimeMovies[index]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Browse;
