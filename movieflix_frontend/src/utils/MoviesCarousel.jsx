import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
// import { LuBadgeInfo } from "react-icons/lu";
import MovieModal from "./MovieModal"; // Import the MovieModal component
import SkeletonLoader from "../utils/SkeletonLoader";
import { encrypt } from "./CryptoUtils";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const MoviesCarousel = ({
  movie = {},
  isFirebaseMovie = false,
  type = "movie",
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [firebaseMovies, setFirebaseMovies] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentType, setCurrentType] = useState(type);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const typeFromQuery = searchParams.get("type");
  const isTvPage = location.pathname.includes("/tv") || typeFromQuery === "tv";
  const navigate = useNavigate();

  useEffect(() => {
    if (isTvPage) {
      setCurrentType("tv"); // Update the local state instead of modifying the prop
    } else {
      setCurrentType(type); // Default back to the original prop value if not "tv"
    }
  }, [location, isTvPage, type]);

  const handleOpen = (movie) => {
    setOpen(true);
    console.log(movie.id);
    console.log("Movies : ", movie);
  };

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

    if (isFirebaseMovie) {
      fetchFirebaseMovies();
    }
  }, [isFirebaseMovie]);
  const checkUrlStatus = async (url) => {
    try {
      // Check if the URL is a YouTube URL and if it's empty or null
      if (url.includes("youtube")) {
        if (!url || url.trim() === "") {
          console.error("YouTube URL is empty or null.");
          return null;
        }
        // console.log("YouTube URL detected, bypassing fetch:", url);
        return url; // Bypass fetch for YouTube URLs
      }

      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return url;
      } else {
        console.error(`URL check failed with status: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error("Error checking URL:", error.message);
      return null;
    }
  };
  const getVideoData = async (videoDataId) => {
    const url = `/api/${currentType}/${videoDataId}/videos`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const videos = data.results;
      const trailer = videos.find(
        (video) => video.type === "Trailer" || video.type === "Teaser",
      );
      const youtubeUrl = trailer
        ? `${process.env.REACT_APP_YOUTUBE_BASE_URL}${trailer.key}`
        : videos.length > 0
          ? `${process.env.REACT_APP_YOUTUBE_BASE_URL}${videos[0].key}`
          : null;

      const vidSrcUrl = `${process.env.REACT_APP_VIDSRC_BASE_URL}${videoDataId}`;
      const validVidSrcUrl = await checkUrlStatus(vidSrcUrl);
      const validYoutubeUrl = await checkUrlStatus(youtubeUrl);

      // console.log("Video Data:", { validVidSrcUrl, validYoutubeUrl });

      return {
        youtubeUrl: validYoutubeUrl,
        vidSrcUrl: validVidSrcUrl,
      };
    } catch (error) {
      console.error("Error fetching video data:", error.message);
      return { youtubeUrl: null, vidSrcUrl: null };
    }
  };

  const handleVideoPlay = async (movie) => {
    try {
      // console.log("Movie data:", movie);
      const videoData = await getVideoData(movie.id);
      // console.log("Video Data:", videoData);

      const videoUrl = isFirebaseMovie
        ? movie.movieUrl
        : videoData.vidSrcUrl || videoData.youtubeUrl;
      // console.log("Video URL:", videoUrl);

      if (videoUrl) {
        const encryptedUrl = encrypt(videoUrl);
        // console.log("Encrypted URL:", encryptedUrl);
        navigate(`/video?videoUrl=${encodeURIComponent(encryptedUrl)}`);
      } else {
        toast.error("Movie/Show not available!", { duration: 4000 });
      }
    } catch (error) {
      console.error("Error handling video play:", error);
      toast.error("Error loading video, please try again.", { duration: 4000 });
    }
  };

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-2xl">
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-r from-black opacity-60"></div>
      <div
        key={movie.id}
        className="group relative h-full w-full"
        onClick={() => {
          handleOpen(movie);
        }}
      >
        <div className="absolute top-0 z-10 flex h-full w-full transform flex-col justify-end gap-2 overflow-hidden opacity-0 transition-transform group-hover:-translate-y-4 group-hover:opacity-100">
          <div className="relative ml-2">
            <span className="h-fit w-fit select-none text-[1.1rem] font-bold text-white transition-opacity duration-[1200]">
              {isFirebaseMovie ? movie.name : movie.title || movie.name}
            </span>
            <span className="flex space-x-2">
              <button
                className="flex h-[1.7rem] w-[3.8rem] items-center justify-center gap-1 rounded-md bg-white font-medium text-black transition-opacity duration-[1200]"
                onClick={() => handleVideoPlay(movie)}
              >
                <FaPlay className="size-3" /> Play
              </button>
              {/* <button
                className="transition-opacity duration-[1200]"
                onClick={() => {
                  handleOpen(movie);
                }}
              >
                <LuBadgeInfo fill="blue" className="size-5" />
              </button> */}
            </span>
          </div>
        </div>
        {/* Show the skeleton loader while the image is loading */}
        {!isLoaded && <SkeletonLoader height={25} width={25} />}
        <div className="relative z-0 h-full w-full select-none">
          <img
            className={`h-full w-full object-cover object-center transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={
              isFirebaseMovie
                ? movie.thumbnailUrl
                : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            }
            alt={isFirebaseMovie ? movie.name : movie.title || movie.name}
            loading="lazy"
            onLoad={() => setIsLoaded(true)} // Update isLoaded when the image is fully loaded
          />
        </div>
      </div>

      {/* Use the MovieModal component */}
      <MovieModal
        open={open}
        handleClose={handleClose}
        movie={movie}
        isFirebaseMovie={isFirebaseMovie}
      />
    </div>
  );
};

export default MoviesCarousel;
