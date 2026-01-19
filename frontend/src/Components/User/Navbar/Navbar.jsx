import { React, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Drawor from "./Drawor";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/Loginslice";
import logo from "../assets/logo.png";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Ai MediScan", path: "/services/disease-predictor" },
  { title: "Doctors", path: "/doctor" },
  { title: "Ai Doctor", path: "/services/chatbot" },
  { title: "Services", path: "/services" },
  // { title: "Ambulance", path: "/ambulance-booking" },

  { title: "Contact", path: "/contact" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const item = localStorage.getItem("jwt");
  const is_admin = localStorage.getItem("is_admin");

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNavClick = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
          paddingY: "6px",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LOGO */}
          <IconButton onClick={() => handleNavClick("/")} disableRipple>
            <img
              src={logo}
              alt="logo"
              style={{
                width: 90,
                height: 60,
                borderRadius: "14px",
                objectFit: "cover",
              }}
            />
          </IconButton>

          {/* MOBILE MENU */}
          {isMatch ? (
            <Drawor navLinks={navLinks} onNavigate={handleNavClick} />
          ) : (
            <>
              {/* NAV LINKS */}
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  color: "black",
                }}
              >
                {navLinks.map((link, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavClick(link.path)}
                      sx={{
                        textAlign: "center",
                        borderRadius: "8px",
                        px: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      {/* <ListItemText primary={link.title} sx={{ fontWeight: 500 }} /> */}
                      <ListItemText
  primary={link.title}
  primaryTypographyProps={{
    noWrap: true,
    sx: {
      fontWeight: 500,
      whiteSpace: "nowrap",
    },
  }}
/>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* USER SECTION */}
              <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
                {item && is_admin === "false" ? (
                  <>
                    <Tooltip title={localStorage.getItem("user")}>
                      <Button
                        onClick={handleClick}
                        sx={{
                          padding: 0,
                          minWidth: 0,
                          borderRadius: "50%",
                        }}
                      >
                        <Avatar />
                      </Button>
                    </Tooltip>

                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                      <MenuItem onClick={() => handleNavClick("/appointment")}>Appointment</MenuItem>
                      <MenuItem onClick={() => handleNavClick("/userprofile")}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    {/* LOGIN */}
                    <div>
                      <Button
                        onClick={handleClick}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          color: "black",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.07)" },
                        }}
                      >
                        Login
                      </Button>

                      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem onClick={() => handleNavClick("/login")}>Login as Patient</MenuItem>
                        <MenuItem onClick={() => handleNavClick("/doctorlogin")}>
                          Login as Doctor
                        </MenuItem>
                         <MenuItem onClick={() => handleNavClick("/login")}>Login as Admin</MenuItem>
                      </Menu>
                    </div>

                    {/* SIGN UP */}
                    <Button
                      variant="contained"
                      onClick={() => handleNavClick("/SignUp")}
                      sx={{
                        background: "#1976d2",
                        textTransform: "none",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px",
                        px: 3,
                        py: 1,
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
