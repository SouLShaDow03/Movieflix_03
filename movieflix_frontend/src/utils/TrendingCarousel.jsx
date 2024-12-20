/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { LuBadgeInfo } from "react-icons/lu";
import imdb_logo from "../assets/images/imdb_logo.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Mousewheel, Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { genreMapping } from "../utils/GenreMapping.js";
import { encrypt } from "./CryptoUtils.js";
import SkeletonLoader from "./SkeletonLoader";
import MovieModal from "./MovieModal.jsx";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TrendingCarousel = ({ type = "movie" }) => {
  const [items, setItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (movie) => {
    setSelectedItem(movie); // Set the selected movie
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const getOmdbData = async (title, year) => {
    try {
      // Fetch data from the backend API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/omdb?title=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("TrendingCarousel omdbdata response:", data.results);
      return {
        imdbRating: data.imdbRating || "N/A",
        omdbGenres: separateGenres(data.Genre) || "N/A",
        omdbYear: data.Year || "N/A",
      };
    } catch (error) {
      console.error("Error fetching OMDB data:", error.message);
      return { imdbRating: "N/A", omdbGenres: "N/A", omdbYear: "N/A" };
    }
  };

  const getVideoData = async (type, itemId) => {
    // console.warn("Trending Video Data:", type, itemId);
    const url = `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/${type}/${itemId}/videos`; // Change this to your backend API endpoint
    try {
      const response = await fetch(url);
      // console.warn("Trending Video Data:", response);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const videos = data.results;
      // Filter for trailers
      const trailer = videos.find(
        (video) => video.type === "Trailer" || video.type === "Teaser",
      );

      if (trailer) {
        return {
          youtubeUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
          vidSrcUrl: `https://vidsrc.in/embed/${type}?tmdb=${itemId}`,
        };
      }

      // If no trailer, return the first video
      return videos.length > 0
        ? {
            youtubeUrl: `https://www.youtube.com/watch?v=${videos[0].key}`,
            vidSrcUrl: `https://vidsrc.in/embed/${type}?tmdb=${itemId}`,
          }
        : { youtubeUrl: null, vidSrcUrl: null };
    } catch (error) {
      console.error("Error fetching video data:", error.message);
      return { youtubeUrl: null, vidSrcUrl: null };
    }
  };

  const separateGenres = (genres) => {
    if (!genres) return ["N/A"];
    return genres.split(", ").slice(0, 2);
  };

  const extractYear = (dateString) => {
    return dateString.split("-")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setItems([]);
        const endpoint =
          type === "movie"
            ? `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/trending/movie/day`
            : `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/trending/tv/day`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          // Log the status code and the response text for debugging
          const errorText = await response.text(); // Get the raw response text
          console.error("Error fetching data:", response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Await the JSON parsing
        if (Array.isArray(data.results)) {
          const shuffledItems = shuffleArray(data.results).slice(0, 6);
          const itemsWithAdditonalData = await Promise.all(
            shuffledItems.map(async (item) => {
              const year = extractYear(
                item.release_date || item.first_air_date,
              );
              const omdbData = await getOmdbData(item.title || item.name, year);
              const videoData = await getVideoData(type,item.id); // Await videoData here
              return { ...item, omdbData, videoData };
            }),
          );
          setItems(itemsWithAdditonalData);
        }
      } catch (error) {
        console.error("Error fetching movies : ", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoPlay = async (item) => {
    try {
      const videoUrl = item.videoData.vidSrcUrl || item.videoData.youtubeUrl;
      // console.log("Video URL:", videoUrl);
      const encryptedUrl = encrypt(videoUrl);
      // console.log("Encrypted url : ", encryptedUrl);
      navigate(`/video?videoUrl=${encodeURIComponent(encryptedUrl)}`);
    } catch (error) {
      console.error("Error handling video play:", error);
    }
  };

  const RenderTruncatedText = ({ text, maxLength }) => {
    const [isExpanded, setisExpanded] = useState(false);
    const handleToggle = () => {
      setisExpanded(!isExpanded);
    };
    const shouldTruncate = text.length > maxLength;
    return (
      <div className="w-fit flex-col">
        <p className="text-[1rem] font-normal max-sm:text-[0.8rem]">
          {isExpanded || !shouldTruncate
            ? text
            : `${text.substring(0, maxLength)} ...`}
        </p>
        {/* {shouldTruncate && (
          <button
            onClick={handleToggle}
            className="relative my-2 text-blue-500"
          >
            {isExpanded ? "Show Less" : <LuBadgeInfo size="1.4rem" />}
          </button>
        )} */}
      </div>
    );
  };

  return (
    <div className="relative h-full w-full">
      {selectedItem && (
        <MovieModal
          open={open}
          handleClose={handleClose}
          movie={selectedItem}
        />
      )}
      <div
        className="absolute z-20 h-full w-full select-none overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Swiper
          slidesPerView={1}
          // loop={true}
          direction="horizontal"
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          modules={[Mousewheel, Autoplay, Pagination]}
          className="relative h-full w-full"
          onAutoplayStop={() => setIsPaused(true)}
          onAutoplayStart={() => setIsPaused(false)}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative h-full w-full text-white text-opacity-100 opacity-100">
                {/* Gradient overlay inside each slide */}
                <div className="pointer-events-none absolute left-0 top-0 z-[10] h-full w-full bg-gradient-to-r from-black/70 to-transparent"></div>
                {/* Slide content */}
                <div className="absolute bottom-[12%] left-[2.5rem] z-10">
                  <div className="flex h-fit w-fit flex-shrink-0 flex-nowrap items-center gap-2">
                    <span className="text-[2.2rem] font-bold sm:text-[1.5rem] md:text-[1.5rem] max-sm:text-[1.5rem] max-md:text-[1.5rem]">
                      {item.title || item.name}
                    </span>
                    <span className="top-1 flex h-[16px] w-[30px] items-center gap-1">
                      <img src={imdb_logo} alt="imdb_logo" />
                      <span className="text-[14px] font-bold">
                        {item.omdbData.imdbRating !== "N/A"
                          ? `${item.omdbData.imdbRating}/10`
                          : "N/A"}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span>
                      <RenderTruncatedText
                        text={item.overview}
                        maxLength={150}
                      />
                    </span>
                    <div className="relative z-50 my-1 flex w-fit flex-nowrap items-center justify-center gap-2">
                      <button
                        className="relative flex h-[2rem] w-[4.2rem] items-center justify-center gap-1 rounded-md bg-white font-medium text-black transition-opacity duration-[900] hover:bg-red-600 hover:bg-opacity-45 hover:text-white"
                        onClick={() => handleVideoPlay(item)}
                      >
                        <FaPlay className="z-50"></FaPlay>
                        Play
                      </button>
                      <button
                        className="relative my-2 text-blue-500"
                        onClick={() => handleOpen(item)}
                      >
                        <LuBadgeInfo size="1.4rem" />
                      </button>
                      <p className="relative ml-2 text-[14px] font-semibold text-white">
                        {item.omdbData.omdbYear !== "N/A"
                          ? `${item.omdbData.omdbYear}`
                          : "Year: N/A"}
                      </p>
                      <p className="relative -top-3 text-[2.5rem] font-semibold text-white">
                        .
                      </p>
                      <div className="relative text-[14px] font-semibold text-white">
                        {item.omdbData.omdbGenres !== "N/A"
                          ? item.omdbData.omdbGenres.map((genre, index) => {
                              const genreCode = Object.keys(genreMapping).find(
                                (key) => genreMapping[key] === genre,
                              );
                              return (
                                <Link
                                  key={index}
                                  to={`/discover?genre=${genreCode}&type=${type}`}
                                  className="mx-1 hover:text-blue-300 hover:underline"
                                >
                                  {genre}
                                </Link>
                              );
                            })
                          : "Genre: N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {!isLoaded && <SkeletonLoader height={true} width={true} />}
                <img
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt={item.title || item.name}
                  className={`h-full w-full object-cover object-center ${isLoaded ? "opacity-100" : "opacity-0"}`}
                  loading="lazy"
                  onLoad={() => setIsLoaded(true)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TrendingCarousel;
