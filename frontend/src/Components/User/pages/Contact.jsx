import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ContactUsPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, message, contact };

    try {
      const response = await axios.post(
        "http://localhost:8080/patient/patientmessage",
        data
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Box py={6} mt={6} >
      <Container maxWidth="md">
        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#000" }}
        >
          Contact Us
        </Typography>

        {/* Contact Info */}
        <Paper
          elevation={3}
          sx={{ padding: 3, borderRadius: 4, background: "#ffffff" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Email sx={{ color: "#333" }} />
                <Typography variant="body1" sx={{ color: "#000" }}>
                  Email: abubakar003m@gmail.com
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone sx={{ color: "#333" }} />
                <Typography variant="body1" sx={{ color: "#000" }}>
                  Phone: +92-305-7165645
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Address */}
          <Box mt={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#000" }}
            >
              Address
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn sx={{ color: "#333" }} />
                  <Typography variant="body1" sx={{ color: "#000" }}>
                    Islamabad
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn sx={{ color: "#333" }} />
                  <Typography variant="body1" sx={{ color: "#000" }}>
                   Pakistan
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Map */}
          <Box mt={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#000" }}
            >
              Map
            </Typography>

            <Box height={400} mt={2}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.257!2d73.0479!3d33.6844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQxJzA0LjAiTiA3M8KwMDInNTAuNCJF!5e0!3m2!1sen!2s!4v0000000000000"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Box>
          </Box>

          {/* Contact Form */}
          <Box mt={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#000" }}
            >
              Contact Form
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputLabelProps={{ style: { color: "#000" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{ style: { color: "#000" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Number"
                    variant="outlined"
                    fullWidth
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    InputLabelProps={{ style: { color: "#000" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    InputLabelProps={{ style: { color: "#000" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{ padding: "10px", backgroundColor: "#000", color: "#fff" }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactUsPage;
