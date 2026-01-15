import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";

const Report = () => {
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const { id } = useParams();
  const token = localStorage.getItem("jwt");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8080/patient/single-appointment/${id}`,
        { headers: { authorization: token } }
      );
      setDatas(data?.appointment || null);
    } catch {
      setErr("Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const isPaid = datas?.payment?.toLowerCase() === "paid";

  return (
    <Container maxWidth="lg">
      {/* 🔥 GLOBAL BLACK TEXT + NAVBAR MARGIN */}
      <Box
        sx={{
          mt: { xs: 10, md: 12 },
          mb: 4,
          color: "#000",
          "& .MuiTypography-root": { color: "#000" },
          "& .MuiListItemText-primary": { color: "#000", fontWeight: 600 },
          "& .MuiChip-label": { fontWeight: 800 },
        }}
      >
        <Paper elevation={8} sx={{ borderRadius: 4, overflow: "hidden" }}>
          {/* Header */}
          <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #ddd" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography variant="h4" fontWeight={900}>
                  Medical Report
                </Typography>
                <Typography variant="body2">
                  Appointment summary with patient details, disease information, and medicines.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<PaidOutlinedIcon />}
                  label={isPaid ? "Payment: Paid" : "Payment: Pending"}
                  color={isPaid ? "success" : "warning"}
                />
                {datas?.doctor?.ammount && (
                  <Chip
                    label={`Invoice: ${datas.doctor.ammount}`}
                    variant="outlined"
                  />
                )}
              </Stack>
            </Stack>
          </Box>

          {/* Body */}
          <Box sx={{ px: 3, py: 3 }}>
            {loading ? (
              <Stack alignItems="center" py={6} spacing={2}>
                <CircularProgress />
                <Typography fontWeight={700}>Loading report...</Typography>
              </Stack>
            ) : err ? (
              <Typography color="error" fontWeight={800}>
                {err}
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {/* Patient Details */}
                <Grid item xs={12} md={5}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonOutlineIcon />
                      <Typography fontWeight={900}>Patient Details</Typography>
                    </Stack>
                    <Divider sx={{ my: 2 }} />

                    <Typography><b>Name:</b> {datas?.user?.username}</Typography>
                    <Typography><b>Email:</b> {datas?.user?.email}</Typography>
                    <Typography><b>Phone:</b> {datas?.user?.phone}</Typography>
                    <Typography><b>Location:</b> {datas?.user?.location}</Typography>
                    <Typography><b>Age:</b> {datas?.user?.age}</Typography>
                  </Paper>
                </Grid>

                {/* Disease Details */}
                <Grid item xs={12} md={7}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <HealingOutlinedIcon />
                      <Typography fontWeight={900}>Disease Details</Typography>
                    </Stack>
                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography>
                          <b>Date:</b> {moment(datas?.date).format("DD/MM/YYYY")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><b>Disease:</b> {datas?.disease}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><b>Doctor:</b> {datas?.doctor?.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><b>Payment:</b> {datas?.payment}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          <b>About Disease:</b> {datas?.about}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Medicines */}
                    <Box mt={3}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MedicationOutlinedIcon />
                        <Typography fontWeight={900}>Medicines</Typography>
                      </Stack>

                      {datas?.medicine?.length ? (
                        <List>
                          {datas.medicine.map((med, i) => (
                            <ListItem
                              key={i}
                              sx={{
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                mb: 1,
                              }}
                            >
                              <ListItemText primary={med} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography>No medicines added.</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Report;



// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// import {
//   Typography,
//   Container,
//   Paper,
//   Avatar,
//   List,
//   ListItem,
//   ListItemText,
//   Grid,
// } from '@mui/material';

// const Report = () => {
//   const [datas, setDatas] = useState();
//   const { id } = useParams();
//   const token = localStorage.getItem('jwt');

//   const doctorDetails = async (id) => {
//     try {
//       const { data } = await axios.get(
//         `http://localhost:8080/patient/single-appointment/${id}`,
//         {
//           headers: {
//             authorization: token,
//           },
//         }
//       );

//       console.log(data.appointment);

//       setDatas(data?.appointment);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     doctorDetails(id);
//   }, []);

//   const containerStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '20px',
//   };
  
//   const titleStyle = {
//     textAlign: 'center',
//   };
  
//   const paperStyle = {
//     width: '100%',
//     maxWidth: '600px', // Adjust the maximum width as needed
//     margin: '10px',
//     padding: '20px',
//     boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
//   };

//   const listItemStyle = {
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     marginBottom: '5px',
//   };
  
//   const responsiveContainerStyle = {
//     '@media (min-width: 768px)': {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },
//   };
  
//   const responsivePaperStyle = {
//     flex: '1',
//     margin: '10px',
//   };
  


 

//   return (
//     // <Container style={containerStyle}>
//     //   <Typography variant="h4" style={titleStyle} gutterBottom>
//     //     Medical Report
//     //   </Typography>
    
//     //   <Container   elevation={3}  style={paperStyle}>
       
//     //    <Typography variant="h5">Patient Name:{datas?.user?.username}</Typography>
//     //    <Typography variant="subtitle1">Email: {datas?.user?.email}</Typography>
//     //    <Typography variant="subtitle1">Phone: {datas?.user?.phone}</Typography>
//     //    <Typography variant="subtitle1">
//     //      Location: {datas?.user?.location}
//     //    </Typography>
//     //    <Typography variant="subtitle1">Age: {datas?.user?.age}</Typography>
//     //  </Container>
//     //  <Container    elevation={3}   style={paperStyle}>
//     //    <Typography variant="h5">Disease Details</Typography>
//     //    <Typography variant="subtitle1">
//     //      Date: {new Date(datas?.date).toLocaleDateString()}
//     //    </Typography>
//     //    <Typography variant="subtitle1">Disease: {datas?.disease}</Typography>
//     //    <Typography variant="subtitle1">
//     //      Doctor: {datas?.doctor?.name}
//     //    </Typography>
//     //    <Typography variant="subtitle1">
//     //      Invoice: {datas?.doctor?.ammount}
//     //    </Typography>
//     //    <Typography variant="subtitle1">
//     //      About Disease: {datas?.about}
//     //    </Typography>
//     //    <Typography variant="subtitle1">Medicine:</Typography>
//     //    <List>
//     //      {datas?.medicine?.map((med, index) => (
//     //        <ListItem key={index} style={listItemStyle}>
//     //          <ListItemText primary={med} />
//     //        </ListItem>
//     //      ))}
//     //    </List>
//     //    <Typography variant="subtitle1">Payment: {datas?.payment}</Typography>
//     //  </Container>
     
     
//     // </Container>



//     <Container style={{ ...containerStyle, ...responsiveContainerStyle }}>
//     <Typography variant="h4" style={titleStyle} gutterBottom>
//       Medical Report
//     </Typography>

//     <Container elevation={3} style={{ ...paperStyle, ...responsivePaperStyle }}>

//       <Typography variant="h5">Patient Details</Typography>
//       <Typography variant="subtitle1">Patient Name: {datas?.user?.username}</Typography>
//       <Typography variant="subtitle1">Email: {datas?.user?.email}</Typography>
//       <Typography variant="subtitle1">Phone: {datas?.user?.phone}</Typography>
//       <Typography variant="subtitle1">Location: {datas?.user?.location}</Typography>
//       <Typography variant="subtitle1">Age: {datas?.user?.age}</Typography>
//     </Container>
//     <Container elevation={3} style={{ ...paperStyle, ...responsivePaperStyle }}>
//       <Typography variant="h5">Disease Details</Typography>
//       <Typography variant="subtitle1">Date: {new Date(datas?.date).toLocaleDateString()}</Typography>
//       <Typography variant="subtitle1">Disease: {datas?.disease}</Typography>
//       <Typography variant="subtitle1">Doctor: {datas?.doctor?.name}</Typography>
//       <Typography variant="subtitle1">Invoice: {datas?.doctor?.ammount}</Typography>
//       <Typography variant="subtitle1">About Disease: {datas?.about}</Typography>
//       <Typography variant="subtitle1">Medicine:</Typography>
//       <List>
//         {datas?.medicine?.map((med, index) => (
//           <ListItem key={index} style={listItemStyle}>
//             <ListItemText primary={med} />
//           </ListItem>
//         ))}
//       </List>
//       <Typography variant="subtitle1">Payment: {datas?.payment}</Typography>
//     </Container>
//   </Container>
//   );
// };

// export default Report;
