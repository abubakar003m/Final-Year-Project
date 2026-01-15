import React from "react";
import { Drawer, List, Divider, ListItemButton, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Drawor = ({ navLinks, onNavigate }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = (path) => {
    setOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {navLinks.map((item, index) => (
            <ListItemButton key={index} onClick={() => handleClick(item.path)}>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={() => handleClick("/login")}>
            <ListItemText primary="Patient Login" />
          </ListItemButton>

           <ListItemButton onClick={() => handleClick("/doctorlogin")}>
            <ListItemText primary="Doctor Login" />
          </ListItemButton>
        
          <ListItemButton onClick={() => handleClick("/login")}>
            <ListItemText primary="Admin Login" />
          </ListItemButton>


          <ListItemButton onClick={() => handleClick("/SignUp")}>
            <ListItemText primary="Sign up" />
          </ListItemButton>
        </List>
      </Drawer>

      <IconButton sx={{ color: "black", marginLeft: "auto" }} onClick={() => setOpen(!open)}>
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default Drawor;
