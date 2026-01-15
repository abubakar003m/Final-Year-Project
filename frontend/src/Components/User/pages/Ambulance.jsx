import React, { useState } from "react";
import {
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AmbulanceBooking = () => {
  const navigate = useNavigate();

  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    emergencyType: "",
  });

  const handleChange = (e) => {
    setBookingInfo({ ...bookingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/patient/ambulance",
        bookingInfo
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: "130px", // Margin to avoid navbar overlap
          mb: 6,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            background: "#ffffff",
            boxShadow: "0px 6px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#1976d2",
              letterSpacing: "1px",
            }}
          >
            🚑 Book an Ambulance
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: "#555",
              mb: 4,
            }}
          >
            Fill in the form below and our ambulance will be on its way!
          </Typography>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={bookingInfo.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={bookingInfo.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={bookingInfo.address}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={bookingInfo.city}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={bookingInfo.state}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Zip */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zip"
                  value={bookingInfo.zip}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Emergency Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Emergency Type</InputLabel>
                  <Select
                    name="emergencyType"
                    value={bookingInfo.emergencyType}
                    label="Emergency Type"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="">Select an emergency type</MenuItem>
                    <MenuItem value="Accident">Accident</MenuItem>
                    <MenuItem value="Medical Emergency">
                      Medical Emergency
                    </MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "16px",
                    background: "#1976d2",
                    boxShadow: "0px 4px 15px rgba(25,118,210,0.3)",
                    "&:hover": {
                      background: "#125ab4",
                    },
                  }}
                >
                  Book Ambulance
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AmbulanceBooking;
