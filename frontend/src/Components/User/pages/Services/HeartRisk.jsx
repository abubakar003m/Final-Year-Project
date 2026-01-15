import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";

const HeartRisk = () => {
  return (
    <Container sx={{ mt: "130px", mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Heart Disease Risk Analyzer
      </Typography>

      <Typography sx={{ mt: 2, color: "#444", fontSize: 18 }}>
        This AI model uses medical metrics to calculate your heart disease risk score.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="error" size="large">
          Analyze Now
        </Button>
      </Box>
    </Container>
  );
};

export default HeartRisk;
