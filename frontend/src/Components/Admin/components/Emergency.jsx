import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
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

function CustomOverlay({ loading }) {
  return (
    <GridOverlay>
      <Box sx={{ py: 3, textAlign: "center", width: "100%" }}>
        <Typography sx={{ fontWeight: 800 }}>
          {loading ? "Loading requests..." : "No ambulance requests found"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
          Try searching by name, phone, city, or emergency type.
        </Typography>
      </Box>
    </GridOverlay>
  );
}

export default function Enquery() {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEnquery = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/ambulance", {
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwt"),
        },
      });
      setDatas(response.data || []);
    } catch (error) {
      console.error(error);
      setDatas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquery();
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return datas;

    return datas.filter((row) => {
      const name = (row?.name || "").toLowerCase();
      const phone = (row?.phoneNumber || "").toLowerCase();
      const address = (row?.address || "").toLowerCase();
      const state = (row?.state || "").toLowerCase();
      const city = (row?.city || "").toLowerCase();
      const zip = String(row?.zip || "").toLowerCase();
      const type = (row?.emergencyType || "").toLowerCase();

      return (
        name.includes(q) ||
        phone.includes(q) ||
        address.includes(q) ||
        state.includes(q) ||
        city.includes(q) ||
        zip.includes(q) ||
        type.includes(q)
      );
    });
  }, [datas, search]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 900 }}>{params.value || "—"}</Typography>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      minWidth: 160,
      flex: 0.8,
    },
    {
      field: "address",
      headerName: "Address",
      minWidth: 260,
      flex: 1.3,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {params.value || "—"}
        </Typography>
      ),
    },
    { field: "state", headerName: "State", minWidth: 140, flex: 0.7 },
    { field: "city", headerName: "City", minWidth: 140, flex: 0.7 },
    { field: "zip", headerName: "Zip Code", minWidth: 140, flex: 0.7 },
    {
      field: "emergencyType",
      headerName: "Emergency Type",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value || "—"} size="small" sx={{ fontWeight: 700 }} />
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
                Ambulance Requests
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                View all ambulance service enquiries with location and emergency type.
              </Typography>
            </Box>

            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, city, emergency..."
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

        {/* Grid */}
        <Box sx={{ height: 540, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
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


// import { useEffect,useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import axios from 'axios';


// export default function Enquery() {
//     const [datas, setDatas] = useState([]);
  
//     useEffect(() => {
//       fetchEnquery();
//     }, []);
  
//     const fetchEnquery = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/ambulance', {
//           headers: {
//             'Content-Type': 'application/json',
//             authorization: localStorage.getItem('jwt'),
//           },
//         });
  
//         setDatas(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     const columns = [
//       { field: 'name', headerName: 'Name', width: 200 },
//       { field: 'phoneNumber', headerName: 'phoneNumber', width: 150},
//       { field: 'address', headerName: 'Address', width: 150 },
//       {field:"state",headerName:"state",width:150},
//       {field:"city",headerName:"city",width:150},
//       {field:"zip",headerName:"Zip Code",width:150},
//       { field: 'emergencyType', headerName: 'EmergenctType', width: 200 },
//     ];
  
//     return (
//       <div style={{ height: 400, width: '100%', paddingLeft:20 }}>
//         <DataGrid
//           rows={datas}
//           columns={columns}
//           pageSize={10}
//           rowsPerPageOptions={[10, 25, 50]}
//           getRowId={(row) =>row._id }
//         />
//       </div>
//     );
//   }
  