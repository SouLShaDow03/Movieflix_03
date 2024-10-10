import * as React from "react";
// import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router-dom";

const MovieGenresModal = ({ anchorEl, open, onClose }) => {
  const location = useLocation();
  const [type, settype] = React.useState("");

  
  React.useEffect(() => {
    const checkLocation = () => {
      if (location.pathname.includes("tv")) {
        settype("tv");
      } else if (location.pathname.includes("browse") || (location.pathname.includes("discover"))) {
        settype("movies");
      }
    };
    checkLocation();
  }, [location.pathname]);
  return (
    <React.Fragment>
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
        {" "}
        <div className="col-span-1 grid h-fit w-fit grid-cols-3 gap-1">
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=28&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Action
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=12&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Adventure
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=16&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Animation
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=35&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Comedy
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=80&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Crime
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=99&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Documentary
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=18&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Drama
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=10751&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Family
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=14&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Fantasy
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=36&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                History
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=27&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Horror
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?movies=Indian`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Indian
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=10402&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Music
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=9648&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Mystery
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=10749&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Romance
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=878&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Science Fiction
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=10770&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                TV Movie
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=53&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Thriller
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=10752&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                War
              </button>
            </Link>
          </MenuItem>
          <MenuItem className="flex h-fit w-fit items-center justify-center">
            <Link to={`/discover?genre=37&type=${type}`}>
              <button className="hover:text-blue-500" onClick={onClose}>
                Western
              </button>
            </Link>
          </MenuItem>
        </div>
      </Menu>
    </React.Fragment>
  );
};

export default MovieGenresModal;
