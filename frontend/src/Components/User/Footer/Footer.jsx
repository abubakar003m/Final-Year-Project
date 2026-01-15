import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import HealingTwoToneIcon from "@mui/icons-material/HealingTwoTone";
import CallIcon from "@mui/icons-material/Call";
import { pink } from "@mui/material/colors";
import { NavLink } from "react-router-dom";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{ color: "black", opacity: 0.8 }}
      {...props}
    >
      Developed with ❤️ by Abubakar, Fahad, Sajal ©{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const Footer = () => {
  return (
    <footer>
      <Box
        sx={{
          bgcolor: "#fff",
          color: "#000",
          mt: 4,
          pt: 6,
          pb: 5,
          borderTop: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="flex-start"
          >
            {/* ---------------------------------- LEFT COLUMN ---------------------------------- */}
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 0,
            
                    fontWeight: 700,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#fff", border: "1px solid #ddd" }}>
                    <HealingTwoToneIcon color="primary" />
                  </Avatar>
                  AI based Clinical Support 
                </Typography>

                <Divider sx={{ borderColor: "rgba(0,0,0,0.2)", mb: 3 }} />

                {/* Address */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Avatar sx={{ bgcolor: pink[500] }}>
                    <LocationOnIcon />
                  </Avatar>
                  <a> Islamabad, Pakistan</a>
                </Stack>

                {/* Email */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 2 }}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Avatar sx={{ bgcolor: pink[500] }}>
                    <EmailIcon />
                  </Avatar>
                  <a
                    href="mailto:abubakar003m@gmail.com"
                    style={{
                      color: "#000",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    abubakar003m@gmail.com
                  </a>
                </Stack>

                {/* Phone */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 2 }}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Avatar sx={{ bgcolor: pink[500] }}>
                    <CallIcon />
                  </Avatar>
                  <a
                    href="tel:+923057165645"
                    style={{
                      color: "#000",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    +92-3057165645
                  </a>
                </Stack>
              </Box>
            </Grid>

            {/* ---------------------------------- RIGHT COLUMN ---------------------------------- */}
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Root>
                  <Divider>
                    <Chip
                      label="Our Services"
                      sx={{ bgcolor: "#000", color: "#fff" }}
                    />
                  </Divider>
                </Root>

                {/* Menu Links */}
                {[
                  { label: "Find a Doctor", to: "/doctor" },
                  { label: "All Services", to: "/services" },
                  { label: "Make an Appointment", to: "/doctor" },
                  { label: "Contact Us", to: "/contact" },
                ].map((link) => (
                  <Box key={link.label} sx={{ py: 1.2 }}>
                    <NavLink
                      to={link.to}
                      style={{
                        color: "#000",
                        textDecoration: "none",
                        fontSize: 15,
                        fontWeight: 500,
                      }}
                    >
                      {link.label}
                    </NavLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "rgba(0,0,0,0.15)", my: 4 }} />

          <Copyright />
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
