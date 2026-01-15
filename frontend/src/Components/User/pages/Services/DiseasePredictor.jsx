import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";

const DiseasePredictor = () => {
  return (
    <Container sx={{ mt: "130px", mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Disease Predictor
      </Typography>

      <Typography sx={{ mt: 2, color: "#444", fontSize: 18 }}>
        Enter symptoms and let our AI-powered model predict potential diseases and provide insights.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" size="large">
          Start Prediction
        </Button>
      </Box>
    </Container>
  );
};

export default DiseasePredictor;
