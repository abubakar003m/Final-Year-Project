import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  Paper,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Form.css";

const AppointmentForm = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    doctor: "",
    disease: "",
    date: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const doctorDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/public/doctor/${id}`,
        {
          headers: { authorization: token },
        }
      );

      setDoctor(data.data);
      setAppointmentData((prev) => ({ ...prev, doctor: id }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    doctorDetails();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submithandler = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/patient/appointment",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }

    setAppointmentData({
      doctor: id,
      disease: "",
      date: "",
    });
  };

  return (
    <>
      {doctor && (
        <Box
          sx={{
          
            minHeight: "100vh",
            mt: "120px",
            pb: 5,
            px: { xs: 2, md: 6 },
          }}
        >
          {/* DOCTOR DETAILS CARD */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              p: { xs: 2, md: 4 },
              mb: 5,
            }}
          >
            <Grid container spacing={4}>
              {/* Left Image */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    width: "100%",
                    height: "350px",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={doctor?.image}
                    alt={doctor?.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>

              {/* Right Details */}
              <Grid
  item
  xs={12}
  md={7}
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    px: 2,
  }}
>
  {/* Doctor Name */}
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
      textAlign: "center",
      color: "#000",
      mb: 2,
    }}
  >
    {doctor?.name}
  </Typography>

  <Divider sx={{ mb: 3 }} />

  {/* Info Block */}
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#000" }}>
      Description:
      <span style={{ fontWeight: 400 }}> {doctor?.desc || "N/A"}</span>
    </Typography>

    <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#000" }}>
      Email:
      <span style={{ fontWeight: 400 }}> {doctor?.email}</span>
    </Typography>

    <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#000" }}>
      Phone:
      <span style={{ fontWeight: 400 }}> {doctor?.contact}</span>
    </Typography>

    <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#000" }}>
      Fee:
      <span style={{ fontWeight: 400 }}> {doctor?.ammount}</span>
    </Typography>
  </Box>

  {/* Expertise Section */}
  <Typography
    variant="h6"
    sx={{
      mt: 4,
      fontWeight: 700,
      textAlign: "center",
      color: "#000",
    }}
  >
    Expertise
  </Typography>

  <List sx={{ pl: 3 }}>
    {doctor?.expertise?.map((item, index) => (
      <ListItem key={index} sx={{ display: "list-item", color: "#000" }}>
        {item}
      </ListItem>
    ))}
  </List>

  {/* Available Time */}
  <Typography
    variant="h6"
    sx={{
      mt: 4,
      fontWeight: 700,
      textAlign: "center",
      color: "#000",
    }}
  >
    Available Time
  </Typography>

  <List sx={{ pl: 3 }}>
    {doctor?.date?.map((item, index) => (
      <ListItem key={index} sx={{ display: "list-item", color: "#000" }}>
        {item}
      </ListItem>
    ))}
  </List>
</Grid>

            </Grid>
          </Paper>

          {/* APPOINTMENT FORM */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 4,
                textTransform: "uppercase",
              }}
            >
              Book Appointment
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="disease"
                  label="Disease"
                  value={appointmentData.disease}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <DatePicker
                  className="form-control"
                  selected={appointmentData.date}
                  onChange={(date) =>
                    setAppointmentData({ ...appointmentData, date: date })
                  }
                  placeholderText="Select a date"
                  minDate={new Date()}
                  required
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={submithandler}
                  sx={{ px: 5, py: 1.5, fontSize: 16 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default AppointmentForm;
