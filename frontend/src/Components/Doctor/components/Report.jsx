import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import toast from "react-hot-toast";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Divider,
  TextField,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

function Report() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("jwt");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Date state
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);     // editable date
  const [originalDate, setOriginalDate] = useState(null);     // for cancel
  const [savingDate, setSavingDate] = useState(false);

  // Report generator
  const [medicineInput, setMedicineInput] = useState("");
  const [medicine, setMedicine] = useState([]);
  const [about, setAbout] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    try {
      const response = await axios.get(`http://localhost:8080/single/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });

      const appt = response?.data?.appointment || null;
      setData(appt);

      // Init date
      const d = appt?.date ? new Date(appt.date) : null;
      setSelectedDate(d);
      setOriginalDate(d);

      // Existing report values if present
      setMedicine(Array.isArray(appt?.medicine) ? appt.medicine : []);
      setAbout(appt?.about || "");
    } catch (error) {
      console.error(error);
      setErr("Failed to load appointment.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formattedDate = useMemo(() => {
    return data?.date ? moment(data.date).format("DD/MM/YYYY") : "—";
  }, [data]);

  // ----- DATE HANDLERS -----
  const handleEditDate = () => {
    setIsEditingDate(true);
    // ensure picker starts with current date
    setSelectedDate(originalDate || new Date());
  };

  const handleCancelDate = () => {
    setSelectedDate(originalDate);
    setIsEditingDate(false);
  };

  const handleSaveDate = async () => {
    if (!selectedDate) return toast.error("Please select a date");

    setSavingDate(true);
    try {
      await axios.patch(
        `http://localhost:8080/update-date`,
        { _id: id, date: selectedDate },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      toast.success("Date updated successfully");
      setIsEditingDate(false);
      await fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update date");
    } finally {
      setSavingDate(false);
    }
  };

  // ----- MEDICINE HANDLERS -----
  const handleAddMedicine = () => {
    const val = medicineInput.trim();
    if (!val) return;
    setMedicine((prev) => [...prev, val]);
    setMedicineInput("");
  };

  const handleRemoveMedicine = (idx) => {
    setMedicine((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:8080/update-medicine`,
        { _id: id, medicine, about },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Report generated successfully");
        navigate("/");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    }
  };

  return (
    <Container maxWidth="lg">
      {/* ✅ Navbar margin */}
      <Box sx={{ mt: { xs: 10, md: 12 }, mb: 4, color: "#000" }}>
        <Paper elevation={10} sx={{ borderRadius: 4, overflow: "hidden" }}>
          {/* Header */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              background: "rgba(0,0,0,0.03)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Generate Medical Report
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Edit appointment date and add medicines + notes.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<ArrowBackOutlinedIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 900,
                  textTransform: "none",
                  px: 2.5,
                  boxShadow: 3,
                }}
              >
                Back
              </Button>
            </Stack>
          </Box>

          {/* Body */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={2}>
                <CircularProgress />
                <Typography sx={{ fontWeight: 800 }}>Loading appointment...</Typography>
              </Stack>
            ) : err ? (
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "error.light" }}>
                <Typography sx={{ fontWeight: 900, color: "error.main" }}>{err}</Typography>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {/* Patient Info */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ borderRadius: 4, p: 2.5, height: "100%" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonOutlineIcon />
                        <Typography sx={{ fontWeight: 900 }}>Patient Information</Typography>
                      </Stack>
                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={1.5}>
                        <Grid item xs={12} sm={6}>
                          <Typography><b>Name:</b> {data?.user?.username || "—"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><b>Email:</b> {data?.user?.email || "—"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><b>Phone:</b> {data?.user?.phone || "—"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><b>Age:</b> {data?.user?.age || "—"}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography><b>Address:</b> {data?.user?.location || "—"}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Appointment Details + DATE FIXED */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ borderRadius: 4, p: 2.5, height: "100%" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalHospitalOutlinedIcon />
                        <Typography sx={{ fontWeight: 900 }}>Appointment Details</Typography>
                      </Stack>
                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography><b>Doctor:</b> {data?.doctor?.name || "—"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><b>Disease:</b> {data?.disease || "—"}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                          {/* ✅ visible action card */}
                          <Paper
                            variant="outlined"
                            sx={{
                              borderRadius: 3,
                              p: 2,
                              // bgcolor: "#fafafa",
                            }}
                          >
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                              alignItems={{ xs: "stretch", sm: "center" }}
                              justifyContent="space-between"
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonthOutlinedIcon color="primary" />
                                <Typography sx={{ fontWeight: 900 }}>
                                  Appointment Date:
                                </Typography>
                                {!isEditingDate && (
                                  <Chip
                                    label={formattedDate}
                                    sx={{ fontWeight: 900 }}
                                    variant="outlined"
                                  />
                                )}
                              </Stack>

                              {!isEditingDate ? (
                                <Button
                                  variant="contained"
                                  startIcon={<EditOutlinedIcon />}
                                  onClick={handleEditDate}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 900,
                                    textTransform: "none",
                                    px: 3,
                                    boxShadow: 3,
                                  }}
                                >
                                  Edit Date
                                </Button>
                              ) : (
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveOutlinedIcon />}
                                    onClick={handleSaveDate}
                                    disabled={savingDate}
                                    sx={{
                                      borderRadius: 2,
                                      fontWeight: 900,
                                      textTransform: "none",
                                      px: 3,
                                      boxShadow: 3,
                                    }}
                                  >
                                    {savingDate ? "Saving..." : "Save"}
                                  </Button>

                                  <Button
                                    variant="outlined"
                                    startIcon={<CloseOutlinedIcon />}
                                    onClick={handleCancelDate}
                                    sx={{
                                      borderRadius: 2,
                                      fontWeight: 900,
                                      textTransform: "none",
                                      px: 2.5,
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Stack>
                              )}
                            </Stack>

                            {/* ✅ Proper DatePicker input (not inline) */}
                            {isEditingDate && (
                              <Box sx={{ mt: 2 }}>
                                <DatePicker
                                  selected={selectedDate}
                                  onChange={(d) => setSelectedDate(d)}
                                  minDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  wrapperClassName="datePicker"
                                  customInput={
                                    <TextField fullWidth label="Select new appointment date" />
                                  }
                                />
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Report Generator */}
                <Box sx={{ mt: 3 }}>
                  <Paper variant="outlined" sx={{ borderRadius: 4, p: 2.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <DescriptionOutlinedIcon />
                      <Typography sx={{ fontWeight: 900 }}>Report Generator</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                      Add medicines and write notes about the disease.
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12} md={6}>
                          <TextField fullWidth label="Patient" value={data?.user?.username || ""} disabled />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField fullWidth label="Doctor" value={data?.doctor?.name || ""} disabled />
                        </Grid>

                        {/* Medicines */}
                        <Grid item xs={12}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <MedicationOutlinedIcon />
                            <Typography sx={{ fontWeight: 900 }}>Medicines</Typography>
                          </Stack>

                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                            <TextField
                              fullWidth
                              label="Add medicine"
                              value={medicineInput}
                              onChange={(e) => setMedicineInput(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="contained"
                              onClick={handleAddMedicine}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 900,
                                textTransform: "none",
                                px: 3,
                                boxShadow: 3,
                              }}
                            >
                              Add
                            </Button>
                          </Stack>

                          <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {medicine.length ? (
                              medicine.map((m, idx) => (
                                <Chip
                                  key={`${m}-${idx}`}
                                  label={m}
                                  onDelete={() => handleRemoveMedicine(idx)}
                                  sx={{ fontWeight: 800 }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                No medicines added yet.
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        {/* About */}
                        <Grid item xs={12}>
                          <Typography sx={{ fontWeight: 900, mb: 1 }}>About Disease / Notes</Typography>
                          <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            placeholder="Write symptoms, diagnosis, and advice..."
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 900,
                              textTransform: "none",
                              px: 4,
                              boxShadow: 3,
                            }}
                          >
                            Generate Report
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Paper>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Report;



// import React, { useEffect, useState } from 'react';
// import { TextField, Button, Container, Grid, Typography } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import moment from 'moment';
// import toast from 'react-hot-toast';


// function Report() {
//   const navigate = useNavigate();

//   const [isEditingDate, setIsEditingDate] = useState(false);
// const [selectedDate, setSelectedDate] = useState(new Date());

//     const { id } = useParams();
//     console.log(id)
//     const [data,setDatas] = useState();
//   const [patientName, setPatientName] = useState('');
//   const [doctorName, setDoctorName] = useState('');
//   const [totalAmount, setTotalAmount] = useState('');
//   const [medicine, setmedicine] = useState([]);
//   const [Medicine, setMedicine] = useState('');
//  const [about, setAbout] = useState([]);
//  const [date,setDate]=useState(new Date())

//  console.log(data)


//  const fetchdata = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/single/${id}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           authorization: localStorage.getItem('jwt'),
//         },
//       });

//       setDatas(response.data.appointment    );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => { 
//     fetchdata();
//     }, [isEditingDate]);

// const handlesave=async()=>{
//   setIsEditingDate(!isEditingDate);
//   if(isEditingDate){
//   }
//   try {

//     const response = await axios.patch(`http://localhost:8080/update-date`, {_id:id,date:selectedDate}, {
//       headers: {
//         'Content-Type': 'application/json',
//         authorization: localStorage.getItem('jwt'),
//       },
//     });
//     console.log(response.date)
//   }
//   catch(error){
//     console.log(error)
//   }
// }
//   const handleAddDisease = () => {
//     if (Medicine !== '') {
//         setmedicine([...medicine, Medicine]);
//       setMedicine('');
//     }
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();

//     try {
//         const response = await axios.patch(`http://localhost:8080/update-medicine`, {_id:id,medicine,about}, {
//           headers: {
//             'Content-Type': 'application/json',
//             authorization: localStorage.getItem('jwt'),
//           },
//         });
  
//         if (response.status === 200) {
//           toast.success('Generate report successfully');
//           navigate("/")
//         } else {
//           toast.error('Something went wrong');
//             }

//       } catch (error) {
//         console.error(error);
//       }
    
//     // Handle form submission, e.g., send the data to the server
//     // You can access all the form fields' values in this function
//   };

//   return (

// <>
//     <Container maxWidth="md">
//     <Typography variant="h2" sx={{
//       textAlign:"center", 
//       marginBottom:"60px" 
//     }}>Patient Information</Typography>


//       <Grid container spacing={2}>
        
        
      

//         <Grid item xs={6} >
//           <Typography variant="h3">Patient Name</Typography>
//           <Typography variant="h6">{data?.user?.username}</Typography>
//         </Grid>
          
//         <Grid item xs={6} md={6}>
//           <Typography variant="h3">Patient Email</Typography>
//           <Typography variant="h6">{data?.user?.email}</Typography>
//           </Grid>
//           <Grid item xs={6} md={6}>
//           <Typography variant="h3">Patient Phone</Typography>
//           <Typography variant="h6">{data?.user?.phone}</Typography>
//           </Grid>

//           <Grid item xs={6} md={6}>
//           <Typography variant="h3">Patient Address</Typography>
//           <Typography variant="h6">{data?.user?.location}</Typography>
//           </Grid>
//           <Grid item xs={6} md={6}>
//           <Typography variant="h3">Patient Age</Typography>
//           <Typography variant="h6">{data?.user?.age}</Typography>
//           </Grid>
//           <Grid item xs={6} md={6}>
//           <Typography variant="h3">Disease</Typography>
//           <Typography variant="h6">{data?.disease}</Typography>
//           </Grid>

//           <Grid item xs={3}  sx={{
//             display:"flex",
//             flexDirection:"column",
//             justifyContent:"center"
//           }}>
        
//   <Typography variant="h3">Date </Typography>
//   {isEditingDate ? (
   
//       <DatePicker
//         open
       
//         value={moment(data?.date).format('DD/MM/YYYY')}
//         onChange={(newDate) => setSelectedDate(newDate)}
//         // renderInput={(params) => <TextField {...params} fullWidth />}
//         minDate={new Date() }
//         // You can customize the DatePicker appearance and behavior as needed
//       />
  
//   ) : (
//     <Typography variant="h6">
//       {moment(data?.date).format('DD/MM/YYYY')}
//     </Typography>




//   )}





// </Grid>

// <Grid item xs={6} md={6}>
  
// <Button
//   variant="contained"
//   color="primary"
//   onClick={handlesave}
// >
//   {isEditingDate ? 'Save Date' : 'Edit Date'}
// </Button>

// </Grid>









//       </Grid>

//     </Container>
//     <Container sx={{
//       marginTop:"60px"
//     }} maxWidth="sm">
//       <form onSubmit={handleSubmit}>
//         <Typography variant="h4" sx={{
//           textAlign:"center",
//           marginBottom:"60px"
//         }}>Report Generator</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
              
//               variant="outlined"
//               value={data?.user?.username}
//               onChange={(e) => setPatientName(e.target.value)}
//               disabled
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
              
//               variant="outlined"
//               value={data?.doctor?.name}
//               onChange={(e) => setDoctorName(e.target.value)}
//               disabled
//             />
//           </Grid>

         
          
//           <Grid item xs={12}>
//             <Typography variant="h6">Medicine Information</Typography>
//             <TextField
//               fullWidth
//               label="Disease"
//               variant="outlined"
//               value={Medicine}
//               onChange={(e) => setMedicine(e.target.value)}
//             />
//             <Button variant="contained" onClick={handleAddDisease}>
//               Add Medicine
//             </Button>
           
//           </Grid>

//           <Grid item xs={12}>
//             <Typography variant="h6">Disease Information</Typography>
//             <TextField
//               fullWidth
//               label="Disease"
//               variant="outlined"
//               value={about}
//               onChange={(e) => setAbout(e.target.value)}
//             />
            
//             {/* {diseaseArray.map((about, index) => (
//               <div key={index}>{about}</div>
//             ))} */}
//           </Grid>
//         </Grid>
//         <Button type="submit" variant="contained" color="primary">
//           Generate Report
//         </Button>
//       </form>
//     </Container>


//     </>
//   );
// }


// export default Report;
