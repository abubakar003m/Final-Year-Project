import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const servicesList = [
  {
    title: "AI Healthcare Chatbot",
    description:
      "Ask questions, get quick medical info, symptom guidance, and AI-powered suggestions.",
    image:
      "https://cdn-icons-png.flaticon.com/512/4712/4712100.png",
    path: "/services/chatbot",
  },
  {
    title: "AI Health Report Analyzer",
    description:
      "AI assistant designed to explain medical reports and guide next steps",
    image:
      "https://cdn-icons-png.flaticon.com/512/2966/2966485.png",
    path: "/services/disease-predictor",
  },
    {
    title: "Book Appoinment",
    description:
      "Book an appointment with a doctor for expert guidance and follow-up care.",
    image:
      "https://cdn-icons-png.flaticon.com/512/1484/1484822.png",
    path: "/doctor",
  },
  // {
  //   title: "Heart Disease Risk",
  //   description:
  //     "AI model that calculates your heart disease risk using medical metrics.",
  //   image:
  //     "https://cdn-icons-png.flaticon.com/512/1484/1484822.png",
  //   path: "/services/heart-risk",
  // },
];

const OurServicesPage = () => {
  const navigate = useNavigate();

  return (
    <Box py={6} sx={{ mt: "120px" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#000" }}
        >
          Our AI Healthcare Services
        </Typography>

        <Grid container spacing={4} sx={{ mt: 3 }} justifyContent="center" >
          {servicesList.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0px 4px 14px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <CardMedia
                  component="img"
                  image={service.image}
                  height="200"
                  alt={service.title}
                  sx={{ objectFit: "contain", p: 2 }}
                />

                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#444" }}>
                    {service.description}
                  </Typography>
                </CardContent>

                <Box textAlign="center" pb={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ px: 4, borderRadius: 2 }}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(service.path);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OurServicesPage;
