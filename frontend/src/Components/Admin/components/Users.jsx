import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";

function CustomOverlay({ loading }) {
  return (
    <GridOverlay>
      <Box sx={{ py: 3, textAlign: "center", width: "100%" }}>
        <Typography sx={{ fontWeight: 800 }}>
          {loading ? "Loading appointments..." : "No appointments found"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
          Try searching by user, doctor, or disease.
        </Typography>
      </Box>
    </GridOverlay>
  );
}

export default function Users() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/appointments", {
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwt"),
        },
      });

      setAppointments(response.data?.all_appointments || []);
    } catch (error) {
      console.log(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ fetch once on mount (your previous code refetched forever)
  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((row) => {
      const user = (row?.user?.username || "").toLowerCase();
      const doctor = (row?.doctor?.name || "").toLowerCase();
      const disease = (row?.disease || "").toLowerCase();
      const date = row?.date ? moment(row.date).format("YYYY-MM-DD").toLowerCase() : "";
      return user.includes(q) || doctor.includes(q) || disease.includes(q) || date.includes(q);
    });
  }, [appointments, search]);

  const columns = [
    {
      field: "_id",
      headerName: "Appointment ID",
      minWidth: 260,
      flex: 1,
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 800 }}>
          {params.row?.user?.username || "—"}
        </Typography>
      ),
    },
    {
      field: "doctor",
      headerName: "Doctor",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 800 }}>
          {params.row?.doctor?.name || "—"}
        </Typography>
      ),
    },
    {
      field: "disease",
      headerName: "Disease",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value || "—"}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 160,
      flex: 0.7,
      valueGetter: (params) =>
        params.row?.date ? moment(params.row.date).format("YYYY-MM-DD") : "—",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Appointments
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                View all user appointments with doctors and disease details.
              </Typography>
            </Box>

            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, doctor, disease, date..."
              size="small"
              sx={{ width: { xs: "100%", md: 380 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>

        {/* DataGrid */}
        <Box sx={{ height: 540, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            slots={{
              noRowsOverlay: () => <CustomOverlay loading={loading} />,
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(0,0,0,0.03)",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 900,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(0,0,0,0.03)",
              },
              "& .MuiDataGrid-cell": {
                outline: "none !important",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}



// import { DataGrid } from '@mui/x-data-grid';
// import { Button, TextField } from '@mui/material';
// import axios from 'axios';
// import moment from 'moment';
// import { useEffect,useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Users() {

//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);

//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/appointments', {
//         headers: {
//           'Content-Type': 'application/json',
//           authorization: localStorage.getItem('jwt'),
//         },
//       });

//       setAppointments(response.data.all_appointments);
//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const handleDateChange = async (params, newDate) => {
//     try {
//       const tokens = localStorage.getItem('jwt');
//       const response = await axios.post(
//         'http://localhost:8080/date',
//         {
//           _id: params._id,
//           date: newDate,
//         },
//         {
//           headers: {
//             authorization: tokens,
//           },
//         }
//       );
//       if (response.status === 200) {
//         console.log('Date updated successfully');
//         // Update the date in the local state
//         const updatedAppointments = appointments.map((appointment) => {
//           if (appointment._id === params._id) {
//             return {
//               ...appointment,
//               date: newDate,
//             };
//           }
//           return appointment;
//         });
//         setAppointments(updatedAppointments);
        
//       } else {
//         console.log('Failed to update date');
//       }
//     } catch (error) {
//       console.error('Error updating date:', error);
//     }
//   };
 
//   useEffect(() => {
//     fetchData();
//   }, [appointments]);
//   const handleInvoiceChange = (row, value) => {
//     const updatedAppointments = appointments.map((appointment) => {
//       if (appointment._id === row._id) {
//         return {
//           ...appointment,
//           invoice: value,
//         };
//       }
//       return appointment;
//     });
//     setAppointments(updatedAppointments);
//   };

//   const handleSave = async (appointment) => {
//     try {
//       // Save the appointment details
//       const response = await axios.patch(
//         'http://localhost:8080/appointments',
//         {
//           _id: appointment._id,
//           status: 'checked',
//           invoice: appointment.invoice,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             authorization: localStorage.getItem('jwt'),
//           },
//         }
//       );
//       console.log(response);

     


//       fetchData();
//     } catch (error) {
//       console.log(error);
//     }
//   };

 
//   const columns = [
//     { field: '_id', headerName: 'ID', width: 200 },
//     {
//       field: 'user',
//       headerName: 'User Name',
//       width: 200,
//       renderCell: (params) => {
//         const userName = params.row.user.username;
//         return userName;
//       },
//     },
//     {
//       field: 'doctor',
//       headerName: 'Doctor Name',
//       width: 200,
//       renderCell: (params) => {
//         const userName = params.row.doctor.name;
//         return userName;
//       },
//     },
//     { field: 'disease', headerName: 'Disease', width: 200 },
//     {
//       field: 'date',
//       headerName: 'Date',
//       width: 200,
//       renderCell: (params) => (
//         moment(params.row.date).format('YYYY-MM-DD')
//       ),
//     },
  
    
   


    
//   ];

//   return (
//     <>
//       <div style={{ marginLeft: 20, height: 400, width: '100%' }}>
//         <DataGrid rows={appointments} columns={columns} getRowId={(row) => row._id} />
//       </div>
//     </>
//   );
// }







