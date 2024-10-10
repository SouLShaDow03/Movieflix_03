import React, { useEffect } from 'react'
import Header from "./Header";
import TrendingCarousel from '../utils/TrendingCarousel';
import { Link } from 'react-router-dom';
import { MdArrowForwardIos } from 'react-icons/md';
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import MoviesCarousel from '../utils/MoviesCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { requests } from '../utils/Requests';
import { tmdbInstance } from '../utils/axios';
import * as tvActions from "../utils/Redux/tvSlice.js";

const TvShows = () => {
  const dispatch = useDispatch();
  const tvShowIndex = [...Array(8).keys()];
  const ActionAndAdventure = useSelector((state) => state.tv.ActionAndAdventure);
  const Animation = useSelector((state) => state.tv.Animation);
  const Comedy = useSelector((state) => state.tv.Comedy);
  const Crime = useSelector((state) => state.tv.Crime);
  const Kids = useSelector((state) => state.tv.Kids);

   const getUniqueAndFilteredShows = (array) => {
     const seenTitles = new Set();
     return array.filter((show) => {
       const title = show.title || show.name; // Use title for movies, name for TV shows
       if (
         seenTitles.has(title) ||
         !show.backdrop_path ||
         !show.poster_path ||
         !show.id
       ) {
         return false;
       } else {
         seenTitles.add(title);
         return true;
       }
     });
   };

  const fetchMoviesByGenre = async (
    id,
    action,
    page = 1,
    accumulatedMovies = [],
  ) => {
    try {
      const url = requests.fetchTvShowsByGenre(id, page);
      const response = tmdbInstance.get(url);
      const uniqueMovies = getUniqueAndFilteredShows(
        (await response).data.results,
      );
      const combinedMovies = [...accumulatedMovies, ...uniqueMovies];
      dispatch(action(combinedMovies));
      if (combinedMovies.length >= tvShowIndex.length) {
        return;
      }
      if ((await response).data.total_pages > page) {
        fetchMoviesByGenre(id, action, page + 1, combinedMovies);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchMoviesByGenre(10759, tvActions.setActionAndAdventure);
    fetchMoviesByGenre(16, tvActions.setAnimation);
    fetchMoviesByGenre(35, tvActions.setComedy);
    fetchMoviesByGenre(80, tvActions.setCrime);
    fetchMoviesByGenre(10751, tvActions.setKids);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
    return (
      <div className="noScrollBar absolute top-0 h-screen w-screen overflow-x-hidden bg-black">
        <Header />
        {/* <div className='relative top-20 flex items-center justify-center mx-auto text-white'>TvShows</div> */}
        <div className="relative top-20 mx-auto flex h-[70vh] w-[90vw] justify-center rounded-2xl shadow-lg shadow-red-400">
          <TrendingCarousel type="tv" />
        </div>
        <div className="relative top-20 z-20 mx-3 mt-8 h-fit w-screen">
          <div className="relative flex items-start justify-start gap-2 p-2">
            <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
              Action & Adventure Shows
            </span>
            <span className="relative pt-4 text-2xl">
              <Link to="/discover?genre=10759&type=tv">
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
              {tvShowIndex.map((index) => (
                <SwiperSlide
                  key={index}
                  className="relative max-h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
                >
                  <MoviesCarousel movie={ActionAndAdventure[index]} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="relative top-20 z-20 mx-3 mt-8 h-fit w-screen">
          <div className="relative flex items-start justify-start gap-2 p-2">
            <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
              Animation
            </span>
            <span className="relative pt-4 text-2xl">
              <Link to="/discover?genre=16&type=tv">
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
              {tvShowIndex.map((index) => (
                <SwiperSlide
                  key={index}
                  className="relative max-h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
                >
                  <MoviesCarousel movie={Animation[index]} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="relative top-20 z-20 mx-3 mt-8 h-fit w-screen">
          <div className="relative flex items-start justify-start gap-2 p-2">
            <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
              Comedy
            </span>
            <span className="relative pt-4 text-2xl">
              <Link to="/discover?genre=35&type=tv">
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
              {tvShowIndex.map((index) => (
                <SwiperSlide
                  key={index}
                  className="relative max-h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
                >
                  <MoviesCarousel movie={Comedy[index]} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="relative top-20 z-20 mx-3 mt-8 h-fit w-screen">
          <div className="relative flex items-start justify-start gap-2 p-2">
            <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
             Crime
            </span>
            <span className="relative pt-4 text-2xl">
              <Link to="/discover?genre=80&type=tv">
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
              {tvShowIndex.map((index) => (
                <SwiperSlide
                  key={index}
                  className="relative max-h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
                >
                  <MoviesCarousel movie={Crime[index]} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="relative top-20 z-20 mx-3 mt-8 h-fit w-screen">
          <div className="relative flex items-start justify-start gap-2 p-2">
            <span className="relative mx-3 h-fit w-fit text-[2.2rem] font-bold text-white">
              Kids
            </span>
            <span className="relative pt-4 text-2xl">
              <Link to="/discover?genre=10751&type=tv">
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
              {tvShowIndex.map((index) => (
                <SwiperSlide
                  key={index}
                  className="relative max-h-[25vh] w-[25vw] flex-shrink-0 overflow-hidden rounded-2xl border-white shadow-md shadow-black hover:border-2"
                >
                  <MoviesCarousel movie={Kids[index]} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    );
}

export default TvShows