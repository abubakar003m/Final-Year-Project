import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function CustomOverlay({ loading }) {
  return (
    <GridOverlay>
      <Box sx={{ py: 3, textAlign: "center", width: "100%" }}>
        <Typography sx={{ fontWeight: 900 }}>
          {loading ? "Loading appointments..." : "No appointments found"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
          Try searching by user, disease, date or payment status.
        </Typography>
      </Box>
    </GridOverlay>
  );
}

export default function Users() {
  const navigate = useNavigate();
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
      setAppointments(response?.data?.all_appointments || []);
    } catch (error) {
      console.log(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((row) => {
      const username = (row?.user?.username || "").toLowerCase();
      const disease = (row?.disease || "").toLowerCase();
      const payment = (row?.payment || "").toLowerCase();
      const dateStr = row?.date ? moment(row.date).format("DD/MM/YYYY").toLowerCase() : "";
      return (
        username.includes(q) ||
        disease.includes(q) ||
        payment.includes(q) ||
        dateStr.includes(q)
      );
    });
  }, [appointments, search]);

  const columns = [
    {
      field: "user",
      headerName: "User",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 900 }}>
          {params.row?.user?.username || "—"}
        </Typography>
      ),
    },
    {
      field: "disease",
      headerName: "Disease",
      minWidth: 180,
      flex: 0.9,
      renderCell: (params) => (
        <Chip label={params.value || "—"} size="small" sx={{ fontWeight: 700 }} />
      ),
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 160,
      flex: 0.7,
      valueGetter: (params) =>
        params.row?.date ? moment(params.row.date).format("DD/MM/YYYY") : "—",
    },
    {
      field: "payment",
      headerName: "Payment",
      minWidth: 160,
      flex: 0.7,
      renderCell: (params) => {
        const paid = (params.row?.payment || "").toLowerCase() === "paid";
        return (
          <Chip
            label={paid ? "Paid" : "Pending"}
            size="small"
            color={paid ? "success" : "warning"}
            sx={{ fontWeight: 800 }}
          />
        );
      },
    },
    {
      field: "Report",
      headerName: "Report",
      minWidth: 170,
      flex: 0.8,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<ArticleOutlinedIcon />}
          onClick={() => navigate(`/report/${params.row._id}`)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}
        >
          Show more
        </Button>
      ),
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
                View user appointments, payment status, and generate reports.
              </Typography>
            </Box>

            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, disease, date, payment..."
              size="small"
              sx={{ width: { xs: "100%", md: 420 } }}
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

        {/* Table */}
        <Box sx={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
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
//       console.log(response?.data?.all_appointments)
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
//   }, []);

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
//     // { field: '_id', headerName: 'ID', width: 150 },
//     {
//       field: 'user',
//       headerName: 'User Name',
//       width: 150,
//       renderCell: (params) => {
//         const userName = params.row.user.username;
//         return userName;
//       },
//     },
//     { field: 'disease', headerName: 'Disease', width: 100 },
//     {
//       field: 'date',
//       headerName: 'Date',
//       width: 150,
//       renderCell: (params) => (
//        moment(params.row.date).format('DD/MM/YYYY')
//       ),
//     },
//     // {
//     //   field: 'status',
//     //   headerName: 'Status',
//     //   width: 100,
//     //   renderCell: (params) => (
//     //     <span>
//     //       {params.row.status === 'checked' ? '✔️' : 'Pending'}
//     //     </span>
//     //   ),
//     // },
//     {
//       field: 'payment',
//       headerName: 'Payment',
//       width: 100,
//       renderCell: (params) => (
//         <span>
//           {params.row.payment === 'paid' ? 'clear' : 'pending'}
//         </span>
//       ),
//     },
//     // {
//     //   field: 'invoice',
//     //   headerName: 'Invoice',
//     //   width: 200,
//     //   renderCell: (params) => (
//     //     <>
//     //       {params.row.status === 'checked' ? params.value :  <TextField
//     //           value={params.value}
//     //           onChange={(e) => handleInvoiceChange(params.row, e.target.value)}
//     //           variant="outlined"
//     //           size="small"
//     //           style={{ color: 'inherit', width: '90%' }}
//     //         />}
//     //     </>
//     //   ),
//     // },
//     // {
//     //   field: 'actions',
//     //   headerName: 'Actions',
//     //   width: 100,
//     //   renderCell: (params) => (
//     //     params.row.status !== "checked" ? (
//     //       <Button onClick={() => handleSave(params.row)} style={{ color: 'white' }}>
//     //         Add 
//     //       </Button>):
//     //       (
//     //         <span>
//     //           Clear
//     //         </span>
//     //       )
//     //   ),
//     // },


//     {
//       field: 'Report',
//       headerName: 'Generate Report',
//       width: 100,
//       renderCell: (params) => (
        
//           <Button onClick={() => navigate(`/report/${params.row._id}`)} style={{ color: 'white' }}>
//             show more
//           </Button>
          
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







