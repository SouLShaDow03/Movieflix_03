import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decrypt } from "./CryptoUtils";
// import SkeletonLoader from "./SkeletonLoader";

const VideoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const encryptedVideoUrl = query.get("videoUrl");
  const videoUrl = encryptedVideoUrl ? decrypt(encryptedVideoUrl) : null;
  const [isLoaded, setisLoaded] = React.useState(false);

  // Function to get the YouTube video ID from the URL
  const extractYouTubeVideoId = (url) => {
    // console.log("Extracting YouTube video ID from URL:", url);
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
  };

  // Construct the YouTube embed URL with autoplay and other parameters
  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeVideoId(url);
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`;
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black">
      <button
        className="absolute right-4 top-4 z-50 m-2 rounded-full bg-black bg-opacity-35 px-4 py-2 text-lg text-white hover:bg-red-900"
        onClick={() => navigate(-1)}
      >
        X
      </button>
      <div className="relative h-screen w-screen">
        {/* {!isLoaded && <SkeletonLoader height={true} width={true} />} */}
        {!isLoaded && (
          <div className="absolute flex h-screen w-screen items-center justify-center bg-black">
            <span className="loader"></span>
          </div>
        )}
        {videoUrl && videoUrl.includes("youtube") ? (
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
            title="Video Player"
            onLoad={() => setisLoaded(true)}
          ></iframe>
        ) : (
          <iframe
            src={videoUrl}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
            referrerPolicy="origin"
            allowFullScreen
            title="Video Player"
            onLoad={() => setisLoaded(true)}
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
