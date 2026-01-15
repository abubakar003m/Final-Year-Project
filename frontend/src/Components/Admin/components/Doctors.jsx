import * as React from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";

const CustomNoRowsOverlay = ({ loading }) => {
  return (
    <GridOverlay>
      <Box sx={{ py: 3, textAlign: "center", width: "100%" }}>
        <Typography sx={{ fontWeight: 700 }}>
          {loading ? "Loading doctors..." : "No doctors found"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Try changing your search.
        </Typography>
      </Box>
    </GridOverlay>
  );
};

export default function DataGridDemo() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/public/doctor", {
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwt"),
        },
      });

      const rowsWithId = (response.data?.doctors || []).map((row, index) => ({
        id: row?._id || index + 1, // ✅ better stable id
        ...row,
      }));

      setData(rowsWithId);
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (_id) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      setDeletingId(_id);
      await axios.delete(`http://localhost:8080/doctor/${_id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      // ✅ refresh list without reload
      await fetchData();
    } catch (error) {
      console.log(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;

    return data.filter((row) => {
      const name = (row.name || "").toLowerCase();
      const expertise = (row.expertise || []).join(", ").toLowerCase();
      const date = (row.date || []).join(", ").toLowerCase();
      return name.includes(q) || expertise.includes(q) || date.includes(q);
    });
  }, [data, search]);

  const columns = [
    {
      field: "name",
      headerName: "Doctor",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Avatar
            src={params.row.image}
            alt={params.value}
            sx={{ width: 36, height: 36 }}
          />
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {params.value}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {params.row.email || "—"}
            </Typography>
          </Box>
        </Stack>
      ),
    },
   {
  field: "expertise",
  headerName: "Expertise",
  flex: 1.3,
  minWidth: 280,
  renderCell: (params) => {
    const list = params.value || [];
    if (!list.length) return "—";

    return (
      <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap" }}>
        {list.slice(0, 3).map((x, i) => (
          <Chip
            key={i}
            label={x}
            size="small"
            sx={{
              mb: 0.5,
              fontSize: "0.3rem",          // smaller text
              height: 15,                  // optional: compact chip height
              "& .MuiChip-label": {
                px: 0.75,                  // tighter padding
              },
            }}
          />
        ))}

        {list.length > 3 && (
          <Chip
            label={`+${list.length - 3}`}
            size="small"
            sx={{
              fontSize: "0.7rem",
              height: 22,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}
      </Stack>
    );
  },
},

    {
      field: "date",
      headerName: "Available Slots",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => {
        const list = params.value || [];
        return list.length ? list.join(", ") : "—";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 140,
      renderCell: (params) => {
        const _id = params.row._id;
        const isDeleting = deletingId === _id;
        return (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            disabled={!_id || isDeleting}
            onClick={() => handleDelete(_id)}
            sx={{ borderRadius: 2 }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={6}
        sx={{
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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Doctor List
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                Manage doctors, view expertise, and available slots.
              </Typography>
            </Box>

            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, expertise, or slot..."
              size="small"
              sx={{ width: { xs: "100%", md: 360 } }}
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
        <Box sx={{ height: 520, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            slots={{
              noRowsOverlay: () => <CustomNoRowsOverlay loading={loading} />,
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(0,0,0,0.03)",
                fontWeight: 900,
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


// import * as React from "react";
// import Box from "@mui/material/Box";
// import { DataGrid, GridOverlay } from "@mui/x-data-grid";
// import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AddDoctorForm from "./AddDoctor";
// import { Grid, Typography } from "@mui/material";



// const columns = [

//   { field: "name", headerName: "Name", width: 200 },
 
//   {
//     field: "expertise",
//     headerName: "Expertise",
//     width: 400,
//     renderCell: (params) => {
//       const expertise = params.value || [];
//       return expertise.join(", ");
//     },
//   },
//   {
//     field: "date",
//     headerName: "Available Date",
//     width: 200,
//     renderCell: (params) => {
//       const date = params.value || [];
//       return date.join(", ");
//     },
//   },


//   {
//     field: "actions",
//     headerName: "Actions",
//     width: 70,
//     renderCell: (params) => {
//       const handleDelete = async () => {
//         const token = localStorage.getItem("jwt");
       
//         try {
//           await axios.delete(
//             `http://localhost:8080/doctor/${params.row._id}`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 authorization: token,
//               },
//             }
//           );
//           window.location.reload(true);
//         } catch (error) {
//           console.log(error.message);
//         }
//       };

//       return <button onClick={handleDelete}>Delete</button>;
//     },
//   },

//   // {
//   //   field: "seeMore",
//   //   headerName: "More Info",
//   //   width: 70,
//   //   renderCell: (params) => {
//   //     const handleDetails = async () => {
//   //     //  navigate(`/doctordetails/${params.row._id}`)

//   //     console.log(params.row._id)
       
      
//   //     };

//   //     return <button onClick={handleDetails}>See More</button>;
//   //   },
//   // },
// ];

// export default function DataGridDemo() {
//   const [data, setData] = React.useState([]);
//   const navigate = useNavigate();
  

//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/public/doctor", {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: localStorage.getItem("jwt"),
//         },
//       });
     

//       const rowsWithId = response.data.doctors.map((row, index) => ({
//         id: index + 1,
//         ...row,
//       }));
//       setData(rowsWithId);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const CustomNoRowsOverlay = () => {
//     return (
//       <GridOverlay>
//         <div>loading....</div>
//       </GridOverlay>
//     );
//   };
//   return (
//     <Grid container >
      
//       <Grid item xs={12} sm={12}>
//         <Box sx={{ height: "400px", maxWidth: "90%" }}>
//           <Grid container sx={{justifyContent:"center"}} xs={10}>
//             <Typography
//               variant="h4"
//               sx={{
//                 textAlign: "center",
//               }}
//               gutterBottom
//             >
//               Doctor List
//             </Typography>
//           </Grid>
//           <DataGrid
//             rows={data}
//             columns={columns}
//             components={{
//               NoRowsOverlay: CustomNoRowsOverlay,
//             }}
//             initialState={{
//               pagination: {
//                 paginationModel: {
//                   pageSize: 5,
//                 },
//               },
//             }}
//             pageSizeOptions={[5]}
//             disableRowSelectionOnClick
//           />
//         </Box>
//       </Grid>
//     </Grid>
//   );
// }
