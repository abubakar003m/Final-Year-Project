import { Grid, Box } from "@mui/material";
import Navbar from "./Components/User/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Footer from "./Components/User/Footer/Footer";

import "./App.css";

// User Pages
import Screen from "./Components/User/pages/homecontent/Homepage";
import Contact from "./Components/User/pages/Contact";
import Services from "./Components/User/pages/Services";
import About from "./Components/User/pages/About/About";
import Doctor from "./Components/User/pages/Doctor/Doctor";
import LoginForm from "./Components/User/Login/Login";
import SignUpForm from "./Components/User/Login/Signin";
import AmbulanceBooking from "./Components/User/pages/Ambulance";
import PagenotFound from "./Components/User/pages/PagenotFound";
import UserProfile from "./Components/User/pages/userProfile";

// Doctor pages
import Form from "./Components/User/pages/Doctor/Form";
import Appointment from "./Components/User/pages/Doctor/Appointment";
import Room from "./Components/User/pages/Doctor/Room";

// Service pages you created
import ChatbotService from "./Components/User/pages/Services/ChatbotService";
import DiseasePredictor from "./Components/User/pages/Services/DiseasePredictor";
import HeartRisk from "./Components/User/pages/Services/HeartRisk";

// Authentication
import Doctorlogin from "./Components/User/Login/Doctorlogin";
import PrivateRoutes from "./Privateroutes";
import Report from "./Components/User/pages/Report";

// Admin / Doctor Dashboards
import Dashboard from "./Components/Admin/Dashboard";
import DDashboard from "./Components/Doctor/Dashboard";

import { useState } from "react";

function App() {
  const [is_admin] = useState(localStorage.getItem("is_admin"));
  const [is_doctor] = useState(localStorage.getItem("is_doctor"));

  return (
    <Grid container>
      {/* If doctor logged in */}
      {is_doctor ? (
        <Grid item xs={12}>
          <DDashboard />
        </Grid>
      ) : is_admin === "true" ? (
        /* If admin logged in */
        <Grid item xs={12}>
          <Dashboard />
        </Grid>
      ) : (
        /* Normal User Layout */
        <>
          {/* Navbar */}
          <Grid item xs={12}>
            <Navbar />
          </Grid>

          {/* Main Content */}
          <Grid
            item
            xs={12}
            sx={{ minHeight: "80vh", backgroundColor: "#dcfcec" }}
          >
            <Box>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Screen />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/doctor" element={<Doctor />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/doctorlogin" element={<Doctorlogin />} />
                <Route path="/signup" element={<SignUpForm />} />

                {/* NEW SERVICES ROUTES */}
                <Route path="/services/chatbot" element={<ChatbotService />} />
                <Route
                  path="/services/disease-predictor"
                  element={<DiseasePredictor />}
                />
                <Route path="/services/heart-risk" element={<HeartRisk />} />

                {/* PRIVATE ROUTES */}
                <Route element={<PrivateRoutes />}>
                  <Route path="/form/:id" element={<Form />} />
                  <Route path="/appointment" element={<Appointment />} />
                  <Route path="/room/:roomID" element={<Room />} />
                  <Route
                    path="/ambulance-booking"
                    element={<AmbulanceBooking />}
                  />
                  <Route path="/report/:id" element={<Report />} />
                  <Route path="/userprofile" element={<UserProfile />} />
                </Route>

                {/* PAGE NOT FOUND */}
                <Route path="*" element={<PagenotFound />} />
              </Routes>
            </Box>
          </Grid>

          {/* Footer */}
          <Grid item xs={12} sx={{ height: "10vh" }}>
            <Footer />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default App;
