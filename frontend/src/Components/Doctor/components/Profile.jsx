import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDoctor = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.get("http://localhost:8080/doctor-single", {
        headers: { authorization: localStorage.getItem("jwt") },
      });
      setDoctor(response?.data?.data || null);
    } catch (error) {
      console.error(error.message);
      setErrorMsg("Failed to load profile.");
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const expertiseList = useMemo(() => doctor?.expertise || [], [doctor]);
  const slotsList = useMemo(() => doctor?.date || [], [doctor]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 980,
            borderRadius: 4,
            p: 4,
            textAlign: "center",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2, fontWeight: 800, opacity: 0.8 }}>
            Loading profile...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 980,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
            Doctor Profile
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            View your public profile information.
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
          {errorMsg ? (
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, borderColor: "error.light" }}
            >
              <Typography sx={{ fontWeight: 800, color: "error.main" }}>
                {errorMsg}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                Please check your internet or login token.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3} alignItems="stretch">
              {/* Left Card */}
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{ borderRadius: 4, p: 2.5, height: "100%" }}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <Avatar
                      alt={doctor?.name || "Doctor"}
                      src={doctor?.image}
                      sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid",
                        borderColor: "divider",
                      }}
                      imgProps={{
                        onError: (e) => {
                          e.currentTarget.src = "";
                        },
                      }}
                    />

                    <Typography variant="h5" sx={{ fontWeight: 900, textAlign: "center" }}>
                      {doctor?.name || "—"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.75, textAlign: "center" }}
                    >
                      {doctor?.desc || "No description added yet."}
                    </Typography>

                    <Divider sx={{ width: "100%", my: 1.5 }} />

                    <Stack spacing={1.1} sx={{ width: "100%" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {doctor?.email || "—"}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {doctor?.contact || "—"}
                        </Typography>
                      </Stack>

                      {doctor?.ammount && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <BadgeOutlinedIcon fontSize="small" />
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            Fee: {doctor.ammount}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              {/* Right Info */}
              <Grid item xs={12} md={8}>
                <Stack spacing={2.5}>
                  {/* Expertise */}
                  <Paper variant="outlined" sx={{ borderRadius: 4, p: 2.5 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>
                      Expertise
                    </Typography>

                    {expertiseList?.length ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {expertiseList.map((x, i) => (
                          <Chip
                            key={i}
                            label={x}
                            size="small"
                            sx={{ fontWeight: 700, mb: 1 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No expertise added yet.
                      </Typography>
                    )}
                  </Paper>

                  {/* Available Slots */}
                  <Paper variant="outlined" sx={{ borderRadius: 4, p: 2.5 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>
                      Available Slots
                    </Typography>

                    {slotsList?.length ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {slotsList.map((x, i) => (
                          <Chip
                            key={i}
                            label={x}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 700, mb: 1 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No slots added yet.
                      </Typography>
                    )}
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DoctorProfile;

// import React, { useEffect, useState } from 'react';
// import { Container, Typography, Avatar, Grid, Chip, Box } from '@mui/material';
// import axios from 'axios';

// const DoctorProfile = () => {
//   const [doctor, setDoctor] = useState({});

//   const fetchDoctor = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/doctor-single', {
//         headers: {
//           authorization: localStorage.getItem('jwt'),
//         },
//       });

//       if (response) {
//         setDoctor(response.data.data);
//       }
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchDoctor();
//   }, []);

//   const avatarStyle = {
//     width: '150px',
//     height: '150px',
//   };

//   const containerStyle = {
//     paddingTop: '20px',
//     paddingBottom: '20px',
//   };

//   const chipStyle = {
//     marginRight: '8px',
//     fontSize: '16px',
//   };

//   return (
//     <Container maxWidth="md" sx={containerStyle}>
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={4} textAlign="center">
//           <Avatar alt={doctor.name} src={doctor?.image} sx={avatarStyle} />
//         </Grid>
//         <Grid item xs={12} sm={8}>
//           <Typography variant="h1" gutterBottom>
//             {doctor?.name}
//           </Typography>
//           <Typography variant="h3" paragraph>
//             {doctor?.desc}
//           </Typography>
//           <Box display="flex" alignItems="center" mt={1}>
//             <Typography variant="h2" fontWeight="bold">
//               Email:
//             </Typography>
//             <Typography variant="h2" ml={1}>
//               {doctor?.email}
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" mt={1}>
//             <Typography variant="h2" fontWeight="bold">
//               Contact:
//             </Typography>
//             <Typography variant="h2" ml={1}>
//               {doctor?.contact}
//             </Typography>
//           </Box>
//           {/* <Box mt={2}>
//             <Typography variant="body2" fontWeight="bold">
//               Description
//             </Typography>
//             <Typography variant="body2">{doctor?.desc}</Typography>
//           </Box> */}
//           {/* <Box mt={2}>
//             <Typography variant="h3" fontWeight="bold">
//               Expertise:
//             </Typography>
//             <Box display="flex" flexWrap="wrap" alignItems="center">
//               {doctor?.expertise?.map((expertise, index) => (
//                 <Chip
//                   key={index}
//                   label={expertise}
//                   variant="outlined"
//                   color="primary"
//                   size="medium"
//                   sx={chipStyle}
//                 />
//               ))}
//             </Box>
//           </Box> */}
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default DoctorProfile;




