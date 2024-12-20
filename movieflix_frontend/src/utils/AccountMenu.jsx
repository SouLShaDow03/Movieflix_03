import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
// import PersonAdd from "@mui/icons-material/PersonAdd";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AccountMenu = ({ profilePic, logOut, userName }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    // console.log("UserName : ", userName);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setTimeout(() => {
      navigate("/liked");
    }, 100);
  };
  const handleUnlike = () => {
    setIsLiked((prev) => !prev);
  };
  const handleWatchList = () => {
    setTimeout(() => {
      navigate("/watchlist");
    }, 100);
  };

  const handleUploads = () => {
    if (!isAdmin) {
      toast.error("You are not an admin to make uploads."); // Show error toast
      return; // Exit the function if not admin
    }

    setTimeout(() => {
      navigate("/upload"); // Navigate only if admin
    }, 100);
  };
  const handleMyUploads = () => {
    if (!isAdmin) {
      toast.error("You are not an admin to make uploads."); // Show error toast
      return; // Exit the function if not admin
    }

    setTimeout(() => {
      navigate("/myuploads"); // Navigate only if admin
    }, 100);
  };

  useEffect(() => {
    console.warn("ProfilePic in account menu : ", profilePic);
  }, [profilePic]);
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
        <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            // sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              key={profilePic}
              sx={{ width: 30, height: 30 }}
              src={profilePic}
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        className="bg-black bg-opacity-35"
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        slotProps={{
          elevation: 0,
          sx: {
            overflow: "hidden",
            borderRadius: "10px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
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
          className: "bg-black bg-opacity-80 text-white", // Tailwind classes here
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar src={profilePic} className="mr-2" /> {userName}
        </MenuItem>
        <Divider sx={{ color: "white", border: "14px" }} />
        <MenuItem onMouseDown={handleLike} onMouseUp={handleUnlike}>
          <ListItemIcon>
            {/* <PersonAdd fontSize="small" sx={{ color: "white" }} /> */}
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19.463 3.994c-2.682-1.645-5.023-.982-6.429.074c-.576.433-.864.65-1.034.65s-.458-.217-1.034-.65C9.56 3.012 7.219 2.349 4.537 3.994C1.018 6.153.222 13.274 8.34 19.284C9.886 20.427 10.659 21 12 21s2.114-.572 3.66-1.717c8.118-6.008 7.322-13.13 3.803-15.289"
                  color="white"
                />
              </svg>
            )}
          </ListItemIcon>
          Liked Movies
        </MenuItem>
        <MenuItem onClick={handleWatchList}>
          <ListItemIcon>
            {/* <Settings fontSize="small" sx={{ color: "white" }} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
            >
              <path
                fill="white"
                d="M1 3h16v2H1Zm0 6h6v2H1Zm0 6h8v2H1Zm8-4.24h3.85L14.5 7l1.65 3.76H20l-3 3.17l.9 4.05l-3.4-2.14L11.1 18l.9-4.05Z"
              />
            </svg>
          </ListItemIcon>
          WatchList
        </MenuItem>
        <MenuItem onClick={handleUploads}>
          <ListItemIcon>
            {/* <Settings fontSize="small" sx={{ color: "white" }} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.1em"
              height="1.1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="white"
                stroke-width="2"
                d="M6 14.182v3.273h12v-3.273M12 6v8M8.182 9.818L12 6l3.818 3.818"
              />
            </svg>
          </ListItemIcon>
          Upload Movies
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleMyUploads}>
            <ListItemIcon>
              {/* <Settings fontSize="small" sx={{ color: "white" }} /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <mask id="lineMdCloudAltUploadLoop0">
                  <g
                    fill="none"
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path
                      stroke-dasharray="64"
                      stroke-dashoffset="64"
                      d="M7 19h11c2.21 0 4 -1.79 4 -4c0 -2.21 -1.79 -4 -4 -4h-1v-1c0 -2.76 -2.24 -5 -5 -5c-2.42 0 -4.44 1.72 -4.9 4h-0.1c-2.76 0 -5 2.24 -5 5c0 2.76 2.24 5 5 5Z"
                    >
                      <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.6s"
                        values="64;0"
                      />
                      <set
                        fill="freeze"
                        attributeName="opacity"
                        begin="0.7s"
                        to="0"
                      />
                    </path>
                    <g fill="#fff" stroke="none" opacity="0">
                      <circle cx="12" cy="10" r="6">
                        <animate
                          attributeName="cx"
                          begin="0.7s"
                          dur="30s"
                          repeatCount="indefinite"
                          values="12;11;12;13;12"
                        />
                      </circle>
                      <rect width="9" height="8" x="8" y="12" />
                      <rect width="15" height="12" x="1" y="8" rx="6">
                        <animate
                          attributeName="x"
                          begin="0.7s"
                          dur="21s"
                          repeatCount="indefinite"
                          values="1;0;1;2;1"
                        />
                      </rect>
                      <rect width="13" height="10" x="10" y="10" rx="5">
                        <animate
                          attributeName="x"
                          begin="0.7s"
                          dur="17s"
                          repeatCount="indefinite"
                          values="10;9;10;11;10"
                        />
                      </rect>
                      <set
                        fill="freeze"
                        attributeName="opacity"
                        begin="0.7s"
                        to="1"
                      />
                    </g>
                    <g fill="#000" fill-opacity="0" stroke="none">
                      <circle cx="12" cy="10" r="4">
                        <animate
                          attributeName="cx"
                          begin="0.7s"
                          dur="30s"
                          repeatCount="indefinite"
                          values="12;11;12;13;12"
                        />
                      </circle>
                      <rect width="9" height="6" x="8" y="12" />
                      <rect width="11" height="8" x="3" y="10" rx="4">
                        <animate
                          attributeName="x"
                          begin="0.7s"
                          dur="21s"
                          repeatCount="indefinite"
                          values="3;2;3;4;3"
                        />
                      </rect>
                      <rect width="9" height="6" x="12" y="12" rx="3">
                        <animate
                          attributeName="x"
                          begin="0.7s"
                          dur="17s"
                          repeatCount="indefinite"
                          values="12;11;12;13;12"
                        />
                      </rect>
                      <set
                        fill="freeze"
                        attributeName="fill-opacity"
                        begin="0.7s"
                        to="1"
                      />
                    </g>
                    <g fill="#fff" stroke="none">
                      <path d="M10.5 16h3v0h-3z">
                        <animate
                          fill="freeze"
                          attributeName="d"
                          begin="0.7s"
                          dur="0.2s"
                          values="M10.5 16h3v0h-3z;M10.5 16h3v-4h-3z"
                        />
                      </path>
                      <path d="M8 13h8l-4 0z">
                        <animate
                          fill="freeze"
                          attributeName="d"
                          begin="0.9s"
                          dur="0.1s"
                          values="M8 13h8l-4 0z;M8 13h8l-4 -4z"
                        />
                        <animateMotion
                          begin="1s"
                          calcMode="linear"
                          dur="1.5s"
                          keyPoints="0;0.25;0.5;0.75;1"
                          keyTimes="0;0.1;0.5;0.8;1"
                          path="M0 0v-1v2z"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  </g>
                </mask>
                <rect
                  width="24"
                  height="24"
                  fill="red"
                  mask="url(#lineMdCloudAltUploadLoop0)"
                />
              </svg>
            </ListItemIcon>
            My Uploads
          </MenuItem>
        )}
        <Divider sx={{ color: "white", border: "14px" }} />
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
export default AccountMenu;
