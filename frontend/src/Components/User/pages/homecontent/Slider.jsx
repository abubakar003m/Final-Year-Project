import React from "react";
import { Typography, Container, Grid } from "@mui/material";
import { styled } from "@mui/system";
import img from "../../assets/h1_hero.png";

// Gradient + Image
const StyledSliderArea = styled("div")`
  position: relative;
  background: linear-gradient(
      to right,
      rgba(173, 216, 230, 0),
      rgba(255, 255, 255, 0)
    ),
    url(${img});
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0px;
  margin-top:70px;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    height: auto;
    padding: 60px 20px;
  }
`;

const AnimatedSpan = styled("span")`
  animation: fade-in 2s ease-in-out infinite;
  font-weight: 800;
  color: #000;

  @keyframes fade-in {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const StyledHeroCaption = styled("div")`
  text-align: left;
  padding: 10px;

  @media (max-width: 600px) {
    text-align: center;
  }
`;

const Screen = () => {
  const words = ["Health", "Fitness", "Wellness"];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentWord = words[currentIndex];

  return (
    <StyledSliderArea>
      <Container maxWidth="lg">
        <Grid container justifyContent="flex-start">
          <Grid item xs={12} md={8} lg={7}>
            <StyledHeroCaption>

              {/* Tagline */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#000",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  mb: 3, // 👈 Added margin bottom
                  fontSize: {
                    xs: "26px",
                    sm: "32px",
                    md: "38px",
                    lg: "42px",
                  },
                }}
              >
                A Smart Solution for Better Healthcare:
              </Typography>

              {/* Main Heading */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  color: "#000",
                  mb: 3, // 👈 Added margin bottom
                  fontSize: {
                    xs: "32px",
                    sm: "40px",
                    md: "46px",
                    lg: "52px",
                  },
                  lineHeight: 1.2,
                }}
              >
                We care about your{" "}
                <strong>
                  <AnimatedSpan>{currentWord}</AnimatedSpan>
                </strong>
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  mb: 10, // 👈 Added margin bottom
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                    md: "20px",
                  },
                  maxWidth: "600px",
                  color: "#000",
                  opacity: 0.9,
                  lineHeight: 1.5,
                  mx: { xs: "auto", sm: 0 },
                }}
              >
                An AI-powered healthcare platform that protects your
                well-being, diagnoses early risks, and guides you to better
                health.
              </Typography>

            </StyledHeroCaption>
          </Grid>
        </Grid>
      </Container>
    </StyledSliderArea>
  );
};

export default Screen;
