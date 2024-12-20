import React, { useEffect, useState } from "react";
import Header from "./Header";
import MoviesCarousel from "../utils/MoviesCarousel";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function Specials() {
  const [firebaseMovies, setFirebaseMovies] = useState([]);
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
        //   console.log("Firebase movies:", moviesList);
      } catch (error) {
        console.error("Error fetching Firebase movies:", error);
      }
    };

    fetchFirebaseMovies();
  }, []);
  return (
    <div className="noScrollBar relative top-0 z-0 min-h-screen w-screen overflow-x-hidden overflow-y-scroll bg-black bg-opacity-90">
      <Header />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-fit w-screen bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-500"></div>
      <div className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-white">
        MovieFlix Specials
      </div>
      <div className="relative top-20 z-10 mx-2 grid max-h-full max-w-full grid-cols-5 gap-1 px-2">
        {firebaseMovies.length > 0 ? (
          firebaseMovies.map((movie) => (
            <div key={movie.id}>
              <div className="mx-2 max-h-[25vh] max-w-[25vw] py-2 outline-1 hover:z-30 hover:ml-4 hover:max-h-fit hover:max-w-fit hover:scale-125">
                <MoviesCarousel movie={movie} isFirebaseMovie={true} />
              </div>
            </div>
          ))
        ) : (
          <div className="relative top-20 flex h-full w-full items-start justify-center">
            <p className="h-fit w-fit text-[28px] font-bold text-white">
              No movies available in Specials
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Specials;
