/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import movieflix_logo from "../assets/images/MovieFlix-Logo.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { RiNotification3Line } from "react-icons/ri";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useAuth } from "../utils/AuthContext";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../firebase-config";
import { getAuth } from "firebase/auth";
import pfp from "../assets/images/pfp.jpg";
import AccountMenu from "../utils/AccountMenu";
import debounce from "lodash.debounce";
import MovieGenresModal from "../utils/MovieGenresModal";
import { useSearch } from "../utils/SearchContext"; // Import the useSearch hook

const Header = () => {
  const { setIsAuthenticated, setUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isBrowse = location.pathname === "/browse";
  const isDiscoverPage = location.pathname === "/discover";
  const isTV = location.pathname === "/tv";
  const isLikedPage = location.pathname === "/liked";
  const isWatchListPage = location.pathname === "/watchlist";
  const isMovieUploads = location.pathname.includes("/upload");
  const isSpecials = location.pathname.includes("/specials");
  const isMyUploads = location.pathname.includes("/myuploads");
  const [scrollExceeded, setScrollExceeded] = useState(false);
  const {
    isSearchBarOpen,
    searchQuery,
    setSearchQuery,
    openSearchBar,
    closeSearchBar,
    toggleSearchBar,
    handleFocus,
    handleBlur
  } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [userName, setUserName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const searchBarRef = useRef(null);
  const intervalIdRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenGenresModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseGenresModal = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = debounce((query) => {
    setLocalQuery(query);
    setSearchQuery(query); // Update context state
    navigate(`/discover?q=${encodeURIComponent(query)}`, {
      state: { searchBarOpen: true },
    });
  }, 80);

  useEffect(() => {
    setLocalQuery(searchQuery); // Update local state when context state changes
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight * 0.15;
      setScrollExceeded(scrollPosition > viewportHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      // console.log("is discover page : ",isDiscoverPage);
      if (user) {
        // console.log("user : ", user.displayName);
        setUserName(user.displayName);
        // console.log("pfp userName : ", userName);
        setProfilePic(user.photoURL);
        setUserProfile(user.photoURL);
      } else {
        setProfilePic(pfp);
      }
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";

    if (path.includes("discover") || path.includes("search")) {
      setSearchQuery(query);
      openSearchBar();
    } else if (path.includes("browse")) {
      closeSearchBar();
    }
  }, [location, openSearchBar, closeSearchBar, setSearchQuery]);

  const toggleSearchBarHandler = () => {
    toggleSearchBar();
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = setInterval(() => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(document.activeElement)
      ) {
        closeSearchBar();
        setLocalQuery(""); // Reset local query when closing
        clearInterval(intervalIdRef.current);
      }
    }, 3000);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    handleSearchChange(query); // Apply debounced search function
  };

  const handleLogOut = async () => {
    try {
      await signOut(firebaseAuth);
      await Cookies.remove("user");
      setIsAuthenticated(false);
      setUserProfile(null); // Clear userProfile on logout
      setProfilePic(null);
      toast.success("Logged Out !!", {
        duration: 4000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Error logging out. Please try again.", {
        duration: 4000,
      });
      console.error("Logout Error:", error);
    }
  };

  return (
    <div
      className={`z-50 flex w-screen items-center justify-between px-6 ${
        (isBrowse ||
          isDiscoverPage ||
          isTV ||
          isWatchListPage ||
          isLikedPage ||
          isMovieUploads ||
          isSpecials ||
          isMyUploads) &&
        scrollExceeded
          ? "fixed top-0 rounded-lg bg-black bg-opacity-75"
          : "bg-transparent"
      } ${!isBrowse ? "absolute top-0 select-none bg-transparent" : ""}`}
    >
      <div className="left relative z-20 flex w-fit select-none">
        <div
          className={`mobile-logo ${
            isBrowse ||
            isDiscoverPage ||
            isTV ||
            isWatchListPage ||
            isLikedPage ||
            isMovieUploads ||
            isSpecials ||
            isMyUploads
              ? "sm:pl-13 md:pl-13 max-md:pl-13 lg:pl-13 sm:mx-4 sm:w-28 sm:pt-7 md:mx-4 md:w-28 md:pt-7 lg:mx-4 lg:w-28 lg:pt-7 max-sm:w-24 max-sm:pt-6 max-md:mx-4 max-md:w-28 max-md:pt-7"
              : "lg:ml-10 lg:w-64 lg:pl-20 lg:pt-4 max-md:ml-10 max-md:w-56 max-md:pl-20 max-md:pt-4"
          }`}
        >
          <Link to="" reloadDocument>
            <img src={movieflix_logo} alt="MovieFlix Logo" />
          </Link>
        </div>
        {(isBrowse ||
          isDiscoverPage ||
          isTV ||
          isWatchListPage ||
          isLikedPage ||
          isMovieUploads ||
          isSpecials ||
          isMyUploads) && (
          <div
            className={`${
              isBrowse ||
              isDiscoverPage ||
              isTV ||
              isWatchListPage ||
              isLikedPage ||
              isMovieUploads ||
              isSpecials ||
              isMyUploads
                ? "relative top-7 flex h-fit w-fit flex-nowrap gap-7 font-medium text-white max-sm:top-6 max-sm:ml-[-1rem] max-sm:w-[16rem] max-sm:gap-2 max-sm:text-[11px]"
                : ""
            }`}
          >
            <Link className="hover:text-gray-500" to="/browse">
              <button>Home</button>
            </Link>
            <Link className="hover:text-gray-500" to={`/tv`}>
              <button>TV Shows</button>
            </Link>
            <button
              className="hover:text-gray-500"
              onClick={handleOpenGenresModal}
            >
              Categories
            </button>
            <MovieGenresModal
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseGenresModal}
            />
          </div>
        )}
      </div>
      <div className="right z-20 w-[35%]">
        {(isBrowse ||
          isDiscoverPage ||
          isTV ||
          isWatchListPage ||
          isLikedPage ||
          isMovieUploads ||
          isSpecials ||
          isMyUploads) && (
          <div className="relative flex items-center gap-2">
            <button
              className={`relative cursor-pointer items-start justify-start ${
                isSearchBarOpen ? "ml-[25%]" : "ml-[65%]"
              }`}
              type="button"
              onClick={toggleSearchBarHandler}
            >
              <SearchRoundedIcon style={{ fill: "white" }} />
            </button>
            {isSearchBarOpen && (
              <div className="relative">
                <input
                  ref={searchBarRef}
                  value={localQuery}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  type="text"
                  className={`h-fit transform rounded-md bg-gray-800 bg-opacity-50 p-2 font-medium text-white transition-[max-width] duration-[800] ease-in-out ${
                    isSearchBarOpen
                      ? "mx-1 max-w-[15rem] translate-x-2 opacity-100 duration-300"
                      : "max-w-[0rem] -translate-x-[50%] opacity-0 duration-300"
                  }`}
                  placeholder="Search.."
                />
              </div>
            )}
            <span className="relative mx-2 h-fit w-fit cursor-pointer items-end justify-end text-2xl">
              <RiNotification3Line fill="white" />
            </span>
            <AccountMenu
              profilePic={profilePic}
              logOut={handleLogOut}
              userName={userName}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
