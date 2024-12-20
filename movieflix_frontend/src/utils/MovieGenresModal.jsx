import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const MovieGenresModal = ({ anchorEl, open, onClose }) => {
  const location = useLocation();
  const [type, setType] = React.useState("movies"); // Default to movies
  const [genres, setGenres] = React.useState([]);
  const [loading, setLoading] = React.useState(false); // Loading state

  React.useEffect(() => {
    // Set the genre type based on the current location
    const checkLocation = () => {
      if (location.pathname.includes("tv")) {
        setType("tv");
      } else if (
        location.pathname.includes("browse") ||
        location.pathname.includes("discover")
      ) {
        setType("movies");
      }
    };
    checkLocation();
  }, [location.pathname]);

  const fetchGenres = async (genreType) => {
    setLoading(true); // Start loading
    try {
      console.log("Fetching genres for type:", genreType);
      const response = await axios.get(
        `${process.env.REACT_APP_VERCEL_BACKEND_API_URL}/api/genres?type=${encodeURIComponent(genreType)}`,
      );
      console.log("Genres response:", response.data);
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Debounced fetchGenres function
  const debouncedFetchGenres = debounce(fetchGenres, 300);

  React.useEffect(() => {
    // Trigger fetch when type changes
    debouncedFetchGenres(type);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]); // Trigger fetch when type changes

  return (
    <Menu
      className="bg-black bg-opacity-15"
      anchorEl={anchorEl}
      id="movie-genres"
      open={open}
      onClose={onClose}
      slotProps={{
        elevation: 0,
        sx: {
          overflow: "hidden",
          borderRadius: "0px",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      MenuListProps={{
        className: "bg-black bg-opacity-90 text-white",
      }}
      transformOrigin={{ horizontal: "left", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <div className="col-span-1 grid h-fit w-fit grid-cols-3 gap-1">
        {loading ? ( // Show loading state
          <MenuItem className="flex justify-center">
            <span>Loading genres...</span>
          </MenuItem>
        ) : (
          genres.map((genre) => (
            <MenuItem
              key={genre.id}
              className="flex h-fit w-fit items-center justify-center"
            >
              <Link to={`/discover?genre=${genre.id}&type=${type}`}>
                <button className="hover:text-blue-500" onClick={onClose}>
                  {genre.name}
                </button>
              </Link>
            </MenuItem>
          ))
        )}
      </div>
    </Menu>
  );
};

export default MovieGenresModal;
