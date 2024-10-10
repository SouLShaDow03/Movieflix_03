import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Poster from "../utils/Poster";
import Header from "./Header";

const LikedMovies = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedMovies = async () => {
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
        const likedMovies = userDoc.data().likedMovies || [];
        setFavourites(likedMovies);
      } else {
        console.error("User document does not exist");
        setFavourites([]);
      }
    } catch (error) {
      console.error("Error fetching liked movies: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedMovies();
  }, []);

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
      <h2 className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-white w-fit h-fit">
        Liked Movies
      </h2>
      {favourites.length === 0 ? (
        <p className="relative left-6 top-20 z-10 ml-2 text-[38px] font-bold text-white">
          No liked movies found :(
        </p>
      ) : (
        <div className="relative top-20 m-2 grid grid-cols-6 overflow-hidden gap-3 p-2 min-h-screen min-w-screen">
          {favourites.map((movieId) => (
            <div key={movieId}>
              <div className="relative z-30 mx-5 flex max-h-[50vh] max-w-fit items-center justify-start overflow-hidden hover:scale-110 hover:cursor-pointer max-sm:max-h-[25vh]">
                <Poster movieId={movieId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedMovies;
