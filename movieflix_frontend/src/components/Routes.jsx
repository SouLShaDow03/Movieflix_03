import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  // useLocation,
} from "react-router-dom";
import Login from "./Login";
import Browse from "./Browse";
import Signup from "./Signup";
import Error from "./error";
import VideoPlayer from "../utils/VideoPlayer";
import DiscoverPage from "./DiscoverPage";
import { useAuth } from "../utils/AuthContext";
import TvShows from "./TvShows";
import WatchList from "./WatchList";
import LikedMovies from "./LikedMovies";
import MovieUpload from "./MovieUpload";
import Specials from "./Specials";
import MyUploads from "./MyUploads";
// import MovieInfo from "../utils/MovieInfo";

const Body = () => {
  const { isAuthenticated, isLoading,isAdmin } = useAuth();
  if (isLoading) {
    return (
      <div className="absolute flex h-screen w-screen items-center justify-center bg-black">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/browse" />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/browse" /> : <Signup />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/browse" /> : <Login />}
        />
        <Route
          path="/browse"
          element={isAuthenticated ? <Browse /> : <Navigate to="/login" />}
        />
        <Route
          path="/tv"
          element={isAuthenticated ? <TvShows /> : <Navigate to="/login" />}
        />
        <Route
          path="/discover"
          element={
            isAuthenticated ? <DiscoverPage /> : <Navigate to="/browse" />
          }
        />
        <Route
          path="/video"
          element={
            isAuthenticated ? <VideoPlayer /> : <Navigate to="/browse" />
          }
        />
        {/* <Route
          path="/video/:id"
          element={isAuthenticated ? <MovieInfo /> : <Navigate to="/browse" />}
        /> */}
        <Route
          path="/discover/:genre"
          element={
            isAuthenticated ? <DiscoverPage /> : <Navigate to="/browse" />
          }
        />
        <Route
          path="/discover/:movies"
          element={
            isAuthenticated ? <DiscoverPage /> : <Navigate to="/browse" />
          }
        />
        <Route
          path="/watchlist"
          element={isAuthenticated ? <WatchList /> : <Navigate to="/browse" />}
        />{" "}
        <Route
          path="/liked"
          element={
            isAuthenticated ? <LikedMovies /> : <Navigate to="/browse" />
          }
        />
        <Route
          path="/upload"
          element={
            isAuthenticated && isAdmin ? (
              <MovieUpload />
            ) : (
              <Navigate to="/browse" />
            )
          }
        />
        <Route
          path="/specials"
          element={isAuthenticated ? <Specials /> : <Navigate to="/browse" />}
        />
        <Route
          path="/myuploads"
          element={isAuthenticated && isAdmin ? <MyUploads /> : <Navigate to="/browse" />}
        />
        <Route path="/error" element={<Error />} />
        {/* Default path */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  );
};

export default Body;
