import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { FaPlay } from "react-icons/fa";
import { encrypt } from "./CryptoUtils";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import SkeletonLoader from "./SkeletonLoader";
import {
  getFirestore,
  doc,
  getDoc,
  // setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { requests } from "./Requests";
import { omdbInstance, tmdbInstance } from "./axios";
import { genreMapping } from "./GenreMapping";
import MoviesCarousel from "./MoviesCarousel";
import imdb_logo from "../assets/images/imdb_logo.png";
import { db, storage } from "../firebase-config";
import { ref, deleteObject } from "firebase/storage";
// import moviesSlice from "./Redux/moviesSlice";
const MovieModal = ({
  open,
  handleClose,
  movie,
  isFirebaseMovie = false,
  type = "movie",
}) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoData, setVideoData] = useState({});
  const [like, setLike] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [recommendations, setrecommendations] = useState({});
  const [currentType, setCurrentType] = useState(type);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const typeFromQuery = searchParams.get("type");
  const isTvPage = location.pathname.includes("/tv") || typeFromQuery === "tv";
  // eslint-disable-next-line no-unused-vars
  const [firebaseMovies, setFirebaseMovies] = useState([]);
  const isMyUploads = location.pathname.includes("/myuploads");
  // const isDiscover = location.pathname.includes("/discover");
  // const isTvMedia = (isTvPage || isDiscover) || movie.media_type === "tv";

  useEffect(() => {
    if (isTvPage) {
      setCurrentType("tv"); // Update the local state instead of modifying the prop
    } else {
      setCurrentType(type); // Default back to the original prop value if not "tv"
    }
  }, [location, isTvPage, type]);

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

  const getOmdbData = async (title, year) => {
    const url = requests.fetchOmdbData(title, year);
    try {
      const response = await omdbInstance.get(url);
      if (response.data) {
        // Return the full response data along with formatted fields
        return {
          ...response.data, // Spread the entire data object
          omdbruntime: handleRuntime(response.data.Runtime) || "N/A",
          imdbRating: response.data.imdbRating || "N/A", // Set default for imdbRating
          omdbGenres: separateGenres(response.data.Genre) || "N/A", // Format and set default for genres
          omdbYear: response.data.Year || "N/A", // Set default for Year
        };
      }
    } catch (error) {
      console.error("Error fetching OMDB data: ", error.message);
      return { imdbRating: "N/A", omdbGenres: "N/A", omdbYear: "N/A" }; // Return defaults if there's an error
    }
  };

  const separateGenres = (genres) => {
    if (!genres) return ["N/A"];
    // Split by comma and trim any extra whitespace
    return genres.split(",").map((genre) => genre.trim());
  };

  // const extractYear = (dateString) => {
  //    if (!dateString) return ["N/A"];
  //   return dateString.split("-")[0];
  // };

  const handleRuntime = (runtime) => {
    if (!runtime || runtime === "N/A") return "N/A";

    // Extract minutes from the runtime string (e.g., "94 min")
    const matches = runtime.match(/(\d+) min/);
    if (matches) {
      const minutes = parseInt(matches[1], 10);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      return `${hours}h ${remainingMinutes}m`;
    }

    // Fallback if the format is unexpected
    return runtime;
  };
  const fetchData = async (movie) => {
    try {
      setVideoData({});
      // console.log("movie : ", movie);
      // const endpoint =
      //   movie.media_type === "tv" || movie.media_type === "series"
      //     ? requests.fetchTvShowById(movie.id)
      //     : requests.fetchMovieById(movie.id);
      const findEndpoint = () => {
        if (isTvPage) {
          // console.log("Is Tv Page : ", isTvPage);
          if (
            movie.media_type === "tv" ||
            movie.media_type === "series" ||
            !movie.media_type
          ) {
            const endpoint = requests.fetchTvShowById(movie.id);
            // console.log("endpoint (tv page) : ", endpoint);
            searchParams.append("type", "tv");
            return endpoint;
          }
        } else {
          // console.log("Is Tv Page : ", isTvPage);
          if (movie.media_type === "tv" || movie.media_type === "series") {
            const endpoint = requests.fetchTvShowById(movie.id);
            // console.log("endpoint (non-tv, tv media): ", endpoint);
            searchParams.append("type", "tv");
            return endpoint;
          } else {
            const endpoint = requests.fetchMovieById(movie.id);
            // console.log("endpoint (non-tv, movie media): ", endpoint);
            searchParams.append("type", "movies");
            return endpoint;
          }
        }
        return null; // Default return in case no conditions are met
      };

      const endpoint = findEndpoint();
      if (!endpoint) {
        console.error("No valid endpoint found");
        return;
      }
      const [tmdbResponse, omdbResponse] = await Promise.all([
        tmdbInstance.get(endpoint),
        getOmdbData(
          movie.title || movie.name,
          movie.release_date || movie.first_air_date,
        ),
      ]);

      if (tmdbResponse.data) {
        await setVideoData({ ...tmdbResponse.data, ...omdbResponse });
        // await console.log("video data : ", videoData);
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  const fetchRecommendations = async (movie) => {
    try {
      setrecommendations({});
      const endpoint =
        movie.media_type === "tv" || movie.media_type === "series"
          ? requests.fetchTvShowRecommendations(movie.id)
          : requests.fetchMovieRecommendations(movie.id);
      const response = await tmdbInstance.get(endpoint);
      if (Array.isArray(response.data.results)) {
        const filteredRecommendations = response.data.results.filter(
          (recommendation) =>
            recommendation.backdrop_path &&
            recommendation.backdrop_path.trim() !== "" &&
            (recommendation.title || recommendation.name),
        );
        setrecommendations(filteredRecommendations);
        // console.log("Recommendations Data : ", recommendations);
      } else {
        console.error("Data is not an Array : ", response.data.results);
      }
    } catch (error) {
      console.error("Error in recommendations : ", error);
    }
  };

  // Fetch whether the movie is liked or in the watchlist when the modal opens
  React.useEffect(() => {
    const checkMovieStatus = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDocRef = doc(db, "USERS", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const { likedMovies = [], watchlist = [] } = userDoc.data();
          setLike(likedMovies.includes(movie.id));
          setInWatchlist(watchlist.includes(movie.id));
        }
      } catch (error) {
        console.error("Error checking movie status:", error);
      }
    };

    if (open && movie) {
      fetchData(movie); // Fetch data when modal opens
      fetchRecommendations(movie);
      checkMovieStatus(); // Check if the movie is liked or in the watchlist
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, movie]);

  const handleLike = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, "USERS", user.uid);

      if (like) {
        // If already liked, remove from favorites
        await updateDoc(userDocRef, {
          likedMovies: arrayRemove(movie.id),
        });
        toast.success(`${movie.title || movie.name} removed from favorites`, {
          duration: 2000,
        });
      } else {
        // If not liked, add to favorites
        console.log("Data to be added : ", movie.id);
        await updateDoc(userDocRef, {
          likedMovies: arrayUnion(movie.id),
        });
        toast.success(`${movie.title || movie.name} added to favorites`, {
          duration: 2000,
        });
      }

      setLike((prevLike) => !prevLike); // Toggle the `like` state
    } catch (error) {
      console.error("Error updating liked status:", error);
      toast.error("Error updating favorites. Please try again.", {
        duration: 2000,
      });
    }
  };

  const handleWatchlist = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, "USERS", user.uid);

      if (inWatchlist) {
        // If already in watchlist, remove from watchlist
        await updateDoc(userDocRef, {
          watchlist: arrayRemove(movie.id),
        });
        toast.success(`${movie.title || movie.name} removed from watchlist`, {
          duration: 2000,
        });
      } else {
        // If not in watchlist, add to watchlist
        await updateDoc(userDocRef, {
          watchlist: arrayUnion(movie.id),
        });
        toast.success(`${movie.title || movie.name} added to watchlist`, {
          duration: 2000,
        });
      }

      setInWatchlist((prevInWatchlist) => !prevInWatchlist); // Toggle the `inWatchlist` state
    } catch (error) {
      console.error("Error updating watchlist status:", error);
      toast.error("Error updating watchlist. Please try again.", {
        duration: 2000,
      });
    }
  };

  // React.useEffect(() => {
  //   console.log("Like:", like, "In Watchlist:", inWatchlist);
  // }, [like, inWatchlist]);

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

  const getVideoData = async (movieId) => {
    // const url = isTvMedia
    //   ? `/tv/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
    //   : `/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
    const url = `/${currentType}/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
    try {
      const response = await tmdbInstance.get(url);
      const videos = response.data.results;
      const trailer = videos.find(
        (video) => video.type === "Trailer" || video.type === "Teaser",
      );
      const youtubeUrl = trailer
        ? `${process.env.REACT_APP_YOUTUBE_BASE_URL}${trailer.key}`
        : videos.length > 0
          ? `${process.env.REACT_APP_YOUTUBE_BASE_URL}${videos[0].key}`
          : null;

      const vidSrcUrl = `${process.env.REACT_APP_VIDSRC_BASE_URL}${movieId}`;
      const validVidSrcUrl = await checkUrlStatus(vidSrcUrl);
      const validYoutubeUrl = await checkUrlStatus(youtubeUrl);

      //  console.log("Video Data:", { validVidSrcUrl, validYoutubeUrl });

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
      const videoData = await getVideoData(movie.id);
      console.log("Video Data:", videoData);
      const videoUrl = isFirebaseMovie
        ? movie.movieUrl
        : videoData.vidSrcUrl || videoData.youtubeUrl;

      // console.log("Video URL:", firebaseMovies[1].movieUrl);
      if (videoUrl) {
        const encryptedUrl = encrypt(videoUrl);
        navigate(`/video?videoUrl=${encodeURIComponent(encryptedUrl)}`);
      } else {
        toast.error("Movie/Show not available!", { duration: 4000 });
      }
    } catch (error) {
      console.error("Error handling video play:", error);
      toast.error("Error loading video, please try again.", { duration: 4000 });
    }
  };

  const handleRemoval = async (movie) => {
    try {
      // Check if movie object has the required properties
      if (!movie || !movie.id || !movie.name) {
        throw new Error("Movie data is incomplete.");
      }

      // Delete movie file from Firebase Storage
      const movieRef = ref(storage, `movies/${movie.name}.mp4`); // Assuming movie files are stored with .mp4 extension
      await deleteObject(movieRef);
      console.log("Movie file deleted from Storage.");

      // Delete thumbnail file from Firebase Storage
      const thumbnailRef = ref(storage, `thumbnails/${movie.name}.png`); // Assuming thumbnail files are stored with .png extension
      await deleteObject(thumbnailRef);
      console.log("Thumbnail file deleted from Storage.");

      // Now delete movie document from Firestore
      await deleteDoc(doc(db, "UPLOADS", movie.id));
      console.log("Movie document deleted from Firestore.");

      // Optionally, refresh the movie list in your component here
      // refreshMovieList(); // Call your function to refresh the list

      toast.success("Movie removed successfully", {
        duration: 4000,
      });
    } catch (error) {
      console.error("Error removing movie: ", error);
      toast.error("Failed to remove movie", {
        duration: 4000,
      });

      // Attempt to delete the Firestore document if it exists (if deletion of files was successful)
      if (error.code !== "storage/object-not-found") {
        try {
          await deleteDoc(doc(db, "UPLOADS", movie.id));
          console.log(
            "Movie document deleted from Firestore (cleanup after error).",
          );
        } catch (firestoreError) {
          console.error(
            "Error deleting movie document from Firestore: ",
            firestoreError,
          );
        }
      }
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "850px",
            height: "90%",
            maxHeight: "950px",
          }}
          className="overflow-hidden rounded-xl bg-black bg-opacity-85 shadow-lg"
        >
          {/* modal container */}
          <div className="noScrollBar absolute top-0 h-full w-full overflow-y-auto bg-[#181818]">
            {/* image container */}
            <div className="relative top-0 z-10 max-h-full overflow-hidden">
              {/* button start */}
              <div className="absolute z-40 flex min-h-[5vh] w-full items-center justify-end">
                <button
                  className="relative m-2 flex h-9 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-black bg-opacity-45 text-[30px]"
                  onClick={handleClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                  >
                    <path
                      fill="white"
                      d="M15.1 3.1L12.9.9L8 5.9L3.1.9L.9 3.1l5 4.9l-5 4.9l2.2 2.2l4.9-5l4.9 5l2.2-2.2l-5-4.9z"
                    />
                  </svg>
                </button>
              </div>
              {/* button end */}
              <div className="absolute top-0 z-20 h-full w-full bg-gradient-to-t from-[#181818] to-transparent"></div>
              {!isLoaded && <SkeletonLoader height={65} width={true} />}
              <img
                src={
                  isFirebaseMovie
                    ? movie.thumbnailUrl
                    : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                }
                alt={isFirebaseMovie ? movie.name : movie.title || movie.name}
                className={`relative max-h-[65vh] w-full object-fill object-center`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
              />
              <div className="noScrollBar absolute bottom-0 z-30 m-5 flex h-[20vh] max-w-fit flex-col items-start justify-start overflow-y-auto p-5 text-white">
                {/* title div */}
                <div>
                  <Typography
                    id="transition-modal-title"
                    component="h2"
                    style={{ fontSize: "32px", fontWeight: "bold" }}
                    className=""
                  >
                    {movie.title || movie.name}
                  </Typography>
                </div>
                <div className="relative flex h-fit w-fit items-center gap-2">
                  <button
                    className="flex h-[2.5rem] w-[6.2rem] items-center justify-start gap-3 rounded-md bg-white pl-4 font-medium text-black transition-opacity duration-[900] hover:bg-red-600 hover:bg-opacity-45 hover:text-white"
                    onClick={() => handleVideoPlay(movie)}
                  >
                    <FaPlay className="z-50"></FaPlay>
                    Play
                  </button>
                  <button
                    className="h-fit w-fit"
                    type="button"
                    onClick={handleWatchlist}
                  >
                    {inWatchlist ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="white"
                          d="m17.114 7.598l3.17-3.19q.147-.166.348-.166t.366.166q.165.165.165.356q0 .192-.165.357l-3.32 3.313q-.241.243-.564.243t-.566-.242L15.335 7.22q-.14-.14-.14-.341t.14-.347q.146-.166.356-.156q.211.01.357.156zM12 16.923l-3.738 1.608q-.808.348-1.535-.134Q6 17.916 6 17.052V5.616q0-.672.472-1.144T7.616 4h5.067q.373 0 .55.314q.177.313.034.661q-.136.367-.201.735Q13 6.077 13 6.5q0 1.742 1.157 3.012T17 10.958q.07.011.124.014q.055.003.107.003q.31.02.54.234q.229.214.229.518v5.325q0 .864-.727 1.345q-.727.482-1.535.134z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2.5em"
                        height="2.5em"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" stroke="white" stroke-width="1.5">
                          <circle cx="12" cy="12" r="10" opacity="0.5" />
                          <path
                            stroke-linecap="round"
                            d="M15 12h-3m0 0H9m3 0V9m0 3v3"
                          />
                        </g>
                      </svg>
                    )}
                  </button>
                  <button
                    className="h-fit w-fit"
                    type="button"
                    onClick={handleLike}
                  >
                    {like ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 2048 2048"
                      >
                        <path
                          fill="white"
                          d="M1856 640q39 0 74 15t61 41t42 61t15 75q0 32-10 61l-256 768q-10 29-28 53t-42 42t-52 26t-60 10h-512q-179 0-345-69q-72-29-144-44t-151-15H0V768h417q65 0 122-24t104-70l622-621q25-25 50-39t61-14q33 0 62 12t51 35t34 51t13 62q0 81-18 154t-53 146q-20 43-34 87t-19 93z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 2048 2048"
                      >
                        <path
                          fill="white"
                          d="M1856 640q39 0 74 15t61 41t42 61t15 75q0 32-10 61l-256 768q-10 29-28 53t-42 42t-52 26t-60 10h-512q-179 0-345-69q-72-29-144-44t-151-15H0V768h417q65 0 122-24t104-70l622-621q25-25 50-39t61-14q33 0 62 12t51 35t34 51t13 62q0 81-18 154t-53 146q-20 43-34 87t-19 93zm-256 1024q20 0 37-12t24-32q5-14 18-54t33-96t42-124t46-137t44-134t39-118t27-86t10-39q0-26-19-45t-45-19h-576q0-53 2-98t10-89t22-86t37-91q28-58 42-118t15-126q0-14-9-23t-23-9q-6 0-10 4t-9 9L734 765q-32 32-68 56t-78 41q-80 34-171 34H128v640h320q178 0 345 69q144 59 295 59z"
                        ></path>
                      </svg>
                    )}
                  </button>
                  {isMyUploads && (
                    <button
                      className="h-fit w-fit"
                      type="button"
                      onClick={() => handleRemoval(movie)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" stroke="red" stroke-width="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M7.5 12h9" />
                        </g>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="relative z-10 mx-5 grid grid-cols-2 gap-2 overflow-y-auto px-5 text-white">
              <div className="relative">
                <div className="relative mb-2 flex h-fit w-fit items-start gap-4">
                  <Typography
                    variant="body1"
                    className="mb-2 bg-inherit text-[#B0B0B0]"
                  >
                    {videoData.Year || "N/A"}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="mb-2 bg-inherit text-[#B0B0B0]"
                  >
                    {videoData.omdbruntime || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="flex items-center justify-center border-2 bg-inherit text-white"
                  >
                    <p className="px-1 text-[10px]">HD</p>
                  </Typography>
                  <Typography
                    variant="body2"
                    className="flex size-6 items-center justify-center"
                  >
                    <img src={imdb_logo} alt="imdb logo" />
                  </Typography>
                  <Typography
                    variant="body2"
                    className="left-[-2] flex size-6 items-center justify-center"
                  >
                    <p>{videoData.imdbRating || "N/A"}</p>
                  </Typography>
                </div>
                <Typography
                  id="transition-modal-description"
                  variant="body2"
                  className="mb-4"
                >
                  {isFirebaseMovie
                    ? movie?.overview
                    : videoData.overview || "No description available."}
                </Typography>
              </div>
              <div className="relative left-16 w-[75%]">
                <div className="relative flex max-h-fit max-w-full flex-col items-center justify-center">
                  <div className="relative flex h-fit w-fit flex-col items-start gap-4">
                    <Typography
                      variant="body2"
                      className="flex gap-1 text-[#B0B0B0]"
                    >
                      Actors:{" "}
                      <p className="text-white">{videoData.Actors || "N/A"}</p>
                    </Typography>
                    <Typography
                      variant="body2"
                      className="flex gap-1 text-[#B0B0B0]"
                    >
                      Genres:{" "}
                      {isFirebaseMovie
                        ? Array.isArray(movie.genres) && movie.genres.length > 0
                          ? movie.genres.map((genre, index) => {
                              // Use find to match the genre with the correct genreCode from genreMapping
                              const genreCode = Object.keys(genreMapping).find(
                                (key) =>
                                  genreMapping[key].toLowerCase() ===
                                  genre.toLowerCase(),
                              );
                              return (
                                <Link
                                  key={index}
                                  to={`/discover?genre=${genreCode ? genreCode : "unknown"}&type=movie`}
                                  className="text-white hover:text-blue-300 hover:underline"
                                >
                                  {genre}
                                </Link>
                              );
                            })
                          : "N/A"
                        : Array.isArray(videoData.genres) &&
                            videoData.genres.length > 0
                          ? videoData.genres.map((genre, index) => {
                              // Assuming genreMapping is defined and contains genre names
                              const genreCode = Object.keys(genreMapping).find(
                                (key) =>
                                  genreMapping[key].toLowerCase() ===
                                  genre.name.toLowerCase(),
                              );
                              // console.log("genre code:", genreCode); // For debugging

                              return isTvPage ? (
                                <Link
                                  key={index}
                                  to={`/discover?genre=${genreCode ? genreCode : "unknown"}&type=tv`}
                                  className="text-white hover:text-blue-300 hover:underline"
                                >
                                  {genre.name}
                                </Link>
                              ) : (
                                <Link
                                  key={index}
                                  to={`/discover?genre=${genreCode ? genreCode : "unknown"}&type=movie`}
                                  className="text-white hover:text-blue-300 hover:underline"
                                >
                                  {genre.name}
                                </Link>
                              );
                            })
                          : "N/A"}
                    </Typography>

                    <Typography
                      variant="body2"
                      className="flex gap-1 text-[#B0B0B0]"
                    >
                      Director:{" "}
                      <p className="text-white">
                        {videoData.Director || "N/A"}
                      </p>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative m-5 flex h-fit w-full flex-col p-5">
              <div className="h-fit w-fit text-[24px] font-bold text-white">
                More Like This
              </div>
              <div className="grid h-fit w-full grid-cols-3 gap-3 pr-4">
                {Array.isArray(recommendations) ? (
                  recommendations.slice(0, 9).map((movie1) => (
                    <div
                      key={movie1.id}
                      className="mx-2 max-h-[25vh] max-w-[25vw] py-2 outline-1 hover:z-30 hover:ml-4 hover:max-h-fit hover:max-w-fit hover:scale-125"
                    >
                      <MoviesCarousel movie={movie1} />
                    </div>
                  ))
                ) : (
                  <p className="text-[16px] font-bold text-white">
                    No recommendations available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MovieModal;
