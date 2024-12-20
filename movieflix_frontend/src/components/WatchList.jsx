import React, { useEffect, useState, useCallback } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Poster from "../utils/Poster";
import Header from "./Header";

const WatchList = () => {
  const [watchlist, setwatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchList = useCallback(async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "USERS", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const watchlistMovies = userDoc.data().watchlist || [];
        setwatchlist(watchlistMovies);
      } else {
        console.error("User document does not exist");
        setwatchlist([]);
      }
    } catch (error) {
      console.error("Error fetching watchlist movies: ", error);
      setError("Failed to load watchlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchList();
  }, [fetchWatchList]);

  if (loading) {
    return (
      <div className="absolute top-0 h-screen w-screen overflow-hidden bg-black">
        <Header />
        <div className="relative top-0 flex min-h-full max-w-full items-center justify-center bg-black">
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 z-0 min-h-screen w-screen overflow-x-hidden overflow-y-scroll bg-black bg-opacity-90">
      <Header />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-fit w-screen bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-500"></div>
      <h2 className="relative left-6 top-20 z-10 ml-2 h-fit w-fit text-[38px] font-bold text-white">
        My WatchList
      </h2>
      {error && (
        <p className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-red-500">
          {error}
        </p>
      )}
      {watchlist.length === 0 && !error ? (
        <p className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-white">
          Add some movies to your watchlist :(
        </p>
      ) : (
        <div className="min-w-screen relative top-20 m-2 grid min-h-screen grid-cols-6 gap-3 overflow-hidden p-2">
          {watchlist.map((movieId) => (
            <div
              key={movieId}
              className="relative z-30 mx-5 flex max-h-[50vh] max-w-fit items-center justify-start overflow-hidden hover:scale-110 hover:cursor-pointer max-sm:max-h-[25vh]"
            >
              <Poster movieId={movieId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
