import React from "react";
import Screen from "./Slider";
import {
  Avatar,
  Grid,
  Typography,
  useTheme,
  Container,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import Gallery from "./Gallery";
import Image from "mui-image";
import h1_hero from "../../assets/feature-img.png";

const Homepage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "#f7fafd",
        color: "#000",
        minHeight: "100vh",
        pb: { xs: 6, md: 10 },
        overflowX: "hidden",
      }}
    >
      {/* Slider Section */}
      <Box
        sx={{
          mb: { xs: 4, md: 8 },
        }}
      >
        <Screen />
      </Box>

      <Container maxWidth="lg">
        {/* Responsive Hero Section */}
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{
            alignItems: "center",
            mb: { xs: 8, md: 10 },
          }}
        >
          {/* Left Image Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 5,
                overflow: "hidden",
                position: "relative",
                minHeight: { xs: 290, md: 520 },
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                background: "#fff",
              }}
            >
              <Image
                src={h1_hero}
                fit="cover"
                duration={400}
                style={{ width: "100%", height: "100%" }}
              />

              {/* Gradient Depth Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.6) 90%)",
                }}
              />
            </Paper>
          </Grid>

          {/* Right Text Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                position: "relative",
                background: "#ffffff",
                overflow: "hidden",
              }}
            >
              {/* Decorative Floating Quote */}
              <Typography
                aria-hidden
                sx={{
                  position: "absolute",
                  top: -20,
                  left: 20,
                  fontSize: { xs: 80, md: 120 },
                  lineHeight: 1,
                  color: "rgba(0,0,0,0.08)",
                  fontFamily: "Georgia, serif",
                }}
              >
                “
              </Typography>

              {/* Main Quote */}
              <Typography
                sx={{
                  fontSize: { xs: 18, md: 22 },
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  maxWidth: 550,
                  mt: 4,
                  color: "#1e1e1e",
                }}
              >
                I am at an age where I just want to be fit and healthy—our bodies
                are our responsibility! Care for your body, and it will care for
                you.
              </Typography>

              {/* Author Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
                <Avatar
                  alt="Doctor"
                  sx={{
                    width: 58,
                    height: 58,
                    border: "2px solid rgba(0,0,0,0.12)",
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    Featured Specialist
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "rgba(0,0,0,0.65)",
                    }}
                  >
                    Health & Wellness Expert
                  </Typography>
                </Box>
              </Box>

              {/* Wellness Chips */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.2,
                  flexWrap: "wrap",
                  mt: 3,
                }}
              >
                {["Eat Clean", "Stay Active", "Sleep Well"].map((t) => (
                  <Box
                    key={t}
                    sx={{
                      px: 1.6,
                      py: 0.9,
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.10)",
                      bgcolor: "#f1f5f9",
                      fontSize: 13,
                      color: "#333",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    {t}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Gallery Section Title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 36 },
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#000",
            }}
          >
            Gallery
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.65)", mt: 1 }}>
            A quick look at our facilities, team, and care in action.
          </Typography>
        </Box>

        {/* Gallery Component */}
        <Box sx={{ mt: 3 }}>
          <Gallery />
        </Box>
      </Container>
    </Box>
  );
};

export default Homepage;
