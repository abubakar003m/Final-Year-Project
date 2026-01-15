import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Stack } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import "react-pro-sidebar/dist/css/styles.css";

import { MenuOutlined, Edit, HelpOutlined } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      icon={icon}
      onClick={() => setSelected(title)}
      style={{ color: colors.grey[100] }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ auto highlight based on route (more professional)
  const pathToTitle = {
    "/Users": "Users",
    "/editprofile": "Edit Profile",
  };
  const [selected, setSelected] = useState(pathToTitle[location.pathname] || "Users");

  return (
    <Box
      sx={{
        minHeight: "100vh",

        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },

        "& .pro-sidebar": {
          borderRight: `1px solid ${colors.primary[500]}`,
        },

        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },

        // ✅ Nice menu item design
        "& .pro-inner-item": {
          margin: "6px 12px",
          borderRadius: "14px",
          padding: "10px 14px !important",
          transition: "0.2s ease",
        },

        "& .pro-inner-item:hover": {
          background: `${colors.primary[500]} !important`,
          color: "#fff !important",
        },

        "& .pro-menu-item.active .pro-inner-item": {
          background: `${colors.primary[500]} !important`,
          color: "#fff !important",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="circle">
          {/* Header */}
          <MenuItem
            icon={<MenuOutlined />}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              margin: "10px 12px 18px 12px",
              borderRadius: 16,
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: "100%" }}
              >
                <Box
                  onClick={() => navigate("/")}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                    Doctor Panel
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    Manage appointments & profile
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{
                    color: colors.grey[100],
                    borderRadius: 2,
                  }}
                >
                  <MenuOutlined />
                </IconButton>
              </Stack>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Typography
              variant="caption"
              sx={{
                mx: 2,
                mb: 1,
                opacity: 0.7,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Navigation
            </Typography>
          )}

          <Box sx={{ px: isCollapsed ? 0 : 0.5 }}>
            <Item
              title="Users"
              to="/Users"
              icon={<HelpOutlined />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Edit Profile"
              to="/editprofile"
              icon={<Edit />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          {!isCollapsed && (
            <Box sx={{ mt: 3, px: 2, pb: 2, opacity: 0.75 }}>
              <Typography variant="caption">© {new Date().getFullYear()} Doctor Panel</Typography>
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar1;


// import React from "react";
// import { useState } from "react";
// import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { tokens } from "../../theme";
// import "react-pro-sidebar/dist/css/styles.css";
// import { Edit, HomeOutlined, Message } from "@mui/icons-material";

// import { HelpOutlined } from "@mui/icons-material";

// import { MenuOutlined } from "@mui/icons-material";

// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{
//         color: colors.grey[100],
//       }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link to={to} />
//     </MenuItem>
//   );
// };

// const Sidebar1 = () => {
//   const Navigate=useNavigate()
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");

//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: `${colors.primary[400]} !important`,
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//         minHeight: "100vh",
//       }}
//     >
//       <ProSidebar collapsed={isCollapsed}>
//         <Menu iconShape="square">
//           {/* LOGO AND MENU ICON */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlined /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: colors.grey[100],
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h3" onClick={()=>{
//                   Navigate("/")

//                 }} color={colors.grey[100]}>
//                  Doctor Pannel
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlined />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             {/* <Item
//               title="Doctors"
//               to="/"
//               icon={<HomeOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             /> */}

//             <Item
//               title="Users"
//               to="/Users"
//               icon={<HelpOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {/* <Item
//               title="Enqiry"
//               to="/Enquery"
//               icon={<Message />}
//               selected={selected}
//               setSelected={setSelected}
//             /> */}

//             {/* <Item
//               title="Ambulance Service"
//               to="/ambulance"
//               icon={<Message />}
//               selected={selected}
//               setSelected={setSelected}
//             /> */}

// {/* <Item
//               title="Add Doctor"
//               to="/AddDoctor"
//               icon={<Message />}
//               selected={selected}
//               setSelected={setSelected}
//             /> */}

//              <Item
//               title=" Edit Profile"
//               to="/editprofile"
//               icon={<Edit />}
//               selected={selected}
//               setSelected={setSelected}
//             /> 



//           </Box>
//         </Menu>
//       </ProSidebar>
//     </Box>
//   );
// };

// export default Sidebar1;
