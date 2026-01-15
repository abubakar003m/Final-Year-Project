import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";

const ChatbotService = () => {
  return (
    <Container sx={{ mt: "130px", mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        AI Healthcare Chatbot
      </Typography>

      <Typography sx={{ mt: 2, color: "#444", fontSize: 18 }}>
        Our AI chatbot helps users get instant health guidance, symptom analysis,
        and answers to general medical questions.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" size="large">
          Start Chatting
        </Button>
      </Box>
    </Container>
  );
};

export default ChatbotService;
