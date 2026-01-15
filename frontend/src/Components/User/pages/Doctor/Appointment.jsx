import * as React from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getpatient } from "../../slices/patientSlice";
import toast from "react-hot-toast";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tokens = localStorage.getItem("jwt");

  const appointment = useSelector((state) => state.patient);
  const rows = appointment?.list?.user_appointments || [];

  // Easypaisa dialog state
  const [payOpen, setPayOpen] = React.useState(false);
  const [paying, setPaying] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [phone, setPhone] = React.useState(""); // optional

  React.useEffect(() => {
    dispatch(getpatient());
  }, [dispatch]);

  const openPayDialog = (item) => {
    setSelected(item);
    setPhone(""); // reset input
    setPayOpen(true);
  };

  const closePayDialog = () => {
    if (paying) return;
    setPayOpen(false);
    setSelected(null);
  };

  const makePayment = async () => {
    if (!selected?._id) return;

    try {
      setPaying(true);

      // ✅ same backend call (just marking paid)
      await axios.post(
        "http://localhost:8080/patient/payment",
        { status: "paid", _id: selected._id },
        { headers: { authorization: tokens } }
      );

      toast.success("Payment successful via Easypaisa ✅");
      setPayOpen(false);
      setSelected(null);
      dispatch(getpatient()); // refresh list
    } catch (error) {
      console.log(error.message);
      toast.error("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={8}  sx={{ mt: { xs: 10, md: 12 }, borderRadius: 4, overflow: "hidden" }}>
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
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                User Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                View your appointments, pay via Easypaisa, and download reports.
              </Typography>
            </Box>

            <Chip
              icon={<PaymentsOutlinedIcon />}
              label="Payment Method: Easypaisa"
              color="success"
              sx={{ fontWeight: 900 }}
            />
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 900,
                    backgroundColor: "rgba(0,0,0,0.03)",
                  },
                }}
              >
                <TableCell>Doctor</TableCell>
                <TableCell>Disease</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Report</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((item) => {
                const isPaid = item?.payment === "paid";
                const fee = item?.doctor?.ammount ?? "—";

                return (
                  <TableRow
                    key={item._id}
                    hover
                    sx={{
                      "& td": { borderBottom: "1px solid rgba(0,0,0,0.06)" },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontWeight: 900 }}>
                        {item?.doctor?.name || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={item?.disease || "—"}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>

                    <TableCell>
                      {item?.date ? moment.utc(item.date).format("DD/MM/YYYY") : "—"}
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 900 }}>{fee}</Typography>
                    </TableCell>

                    <TableCell>
                      {isPaid ? (
                        <Chip label="Paid" color="success" size="small" sx={{ fontWeight: 900 }} />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => openPayDialog(item)}
                          startIcon={<PaymentsOutlinedIcon />}
                          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 900 }}
                        >
                          Pay via Easypaisa
                        </Button>
                      )}
                    </TableCell>

                    <TableCell>
                      {isPaid ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DescriptionOutlinedIcon />}
                          onClick={() => navigate(`/report/${item._id}`)}
                          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 900 }}
                        >
                          View Report
                        </Button>
                      ) : (
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Pending payment
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 900 }}>
                        No appointments found
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                        Your booked appointments will appear here.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
      </Paper>

      {/* Easypaisa Dialog */}
      <Dialog open={payOpen} onClose={closePayDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>Pay with Easypaisa</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
            Confirm payment for this appointment.
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 3, p: 2, mb: 2 }}>
            <Stack spacing={0.6}>
              <Typography sx={{ fontWeight: 900 }}>
                Doctor: {selected?.doctor?.name || "—"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Disease: {selected?.disease || "—"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Date:{" "}
                {selected?.date ? moment.utc(selected.date).format("DD/MM/YYYY") : "—"}
              </Typography>
              <Typography sx={{ fontWeight: 900, mt: 1 }}>
                Amount: {selected?.doctor?.ammount ?? "—"}
              </Typography>
            </Stack>
          </Paper>

          {/* Optional phone input (for future real easypaisa integration) */}
          <TextField
            label="Easypaisa phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            placeholder="03XXXXXXXXX"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  <LocalPhoneOutlinedIcon fontSize="small" />
                </Box>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closePayDialog} disabled={paying}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={makePayment}
            disabled={paying}
            sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
          >
            {paying ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



// import * as React from "react";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { getpatient } from "../../slices/patientSlice";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import KhaltiCheckout from "khalti-checkout-web";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// import toast from "react-hot-toast";

// import { Box } from "@mui/system";
// import { Grid, Typography } from "@mui/material";


// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },

//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// export default function Cart() {
//   const navigate=useNavigate()
//   const [id, setId] = React.useState(null);
//   const [report,setReport]=React.useState(false)

//   const [selectedInvoice, setSelectedInvoice] = React.useState(null);

//   const dispatch = useDispatch();
//   const tokens = localStorage.getItem("jwt");

//   const MakePayment = async (id) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/patient/payment",
//         {
//           status: "paid",
//           _id: id,
//         },
//         {
//           headers: {
//             authorization: tokens,
//           },
//         }
//       );

//       console.log(response.data);
//       toast.success("payment successfull!!!");
//       setReport(true)
//       setId(null);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   const Config = {
//     publicKey: "test_public_key_2a7f2e2188034b8c8afe09bba670bd67",
//     productIdentity: "123766",
//     productName: "My Ecommerce Store",
//     productUrl: "http://localhost:3000",
//     eventHandler: {
//       onSuccess(payload) {
//         console.log(payload);

//         MakePayment(id);
//       },
//       onError(error) {
//         console.log(error);
//       },
//       onClose() {
//         console.log("widget is closing");
//       },
//     },
//     paymentPreference: [
//       "KHALTI",
//       "EBANKING",
//       "MOBILE_BANKING",
//       "CONNECT_IPS",
//       "SCT",
//     ],
//   };
//   let checkout = new KhaltiCheckout(Config);
//   const appointment = useSelector((state) => state.patient);
//   console.log(appointment.list.user_appointments);

//   React.useEffect(() => {
//     dispatch(getpatient());
//   }, [dispatch, id]);

//   React.useEffect(() => {
//     if (id && selectedInvoice) {
//       checkout.show({ amount: selectedInvoice * 100 });
//     }
//   }, [id, selectedInvoice]);

//   return (
//     <>

//     <Grid container sx={{display:"flex" ,flexDirection:'column'}}>
//       <Grid item sx={{
//         marginTop:"20px",
//         marginBottom:"20px"
//       }}>
//       <Typography variant="h4" align="center" gutterBottom>
//             User DashBoard
//           </Typography>
//       </Grid >
//       <Grid item>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 600 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>Doctors Name</StyledTableCell>

//               <StyledTableCell align="left">Disease</StyledTableCell>
//               <StyledTableCell align="left">Date</StyledTableCell>
//               {/* <StyledTableCell align="left">Status</StyledTableCell> */}
//               <StyledTableCell align="left">Invoice</StyledTableCell>
//               <StyledTableCell align="left">Pay Now</StyledTableCell>
//               <StyledTableCell align="left">Report</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {appointment?.list?.user_appointments?.map((item) => (
//               <StyledTableRow key={item._id}>
//                 <StyledTableCell align="left">
//                   {item?.doctor?.name}
//                 </StyledTableCell>
//                 <StyledTableCell align="left">{item?.disease}</StyledTableCell>
//                 <StyledTableCell align="left">{moment.utc(item?.date).format('MM/DD/YYYY')}</StyledTableCell>
//                 {/* <StyledTableCell align="left">{item?.status}</StyledTableCell> */}
//                 <StyledTableCell align="left">{item?.doctor?.ammount}</StyledTableCell>
//                 <StyledTableCell align="left">
                
//                       <Box
//                         sx={{
//                           display: "inline-block",
//                           backgroundColor: "purple",
//                           padding: " 0px 10px",
//                           color: "white",
//                           cursor: "pointer",
//                           fontWeight: "bold",
//                           border: "1px solid white",
//                         }}
//                       >

//                 { item?.payment !== "paid"
//                      ? (
//                            <button
//                            onClick={() => {
//                              // setId(item._id)
//                              // if(id)
//                              // {
//                              //   checkout.show({ amount: item.invoice * 100})
//                              // }
//                              setId(item?._id);
//                              setSelectedInvoice(item?.doctor?.ammount);
//                            }}
//                            style={{
//                              backgroundColor: "transparent",
//                              border: "none",
//                              color: "inherit",
//                              cursor: "inherit",
//                              padding: 0,
//                            }}
//                          >
//                            Pay Via Khalti
//                          </button>
//                         )  :( <Typography>paid</Typography>)
//                           }
                       
//                       </Box>
                  
//                 </StyledTableCell>
//                 <StyledTableCell align="left">
//                   { item?.payment === "paid"
//                      ? (

//                       <Box
//                       sx={{
//                         display: "inline-block",
//                         backgroundColor: "purple",
//                         padding: "10px",
//                         color: "white",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                         border: "1px solid white",
//                       }}
//                     >
//                       <button

//                        onClickCapture={() => navigate(`/report/${item._id}`)
//                       }
                        
//                         style={{
//                           backgroundColor: "transparent",
//                           border: "none",
//                           color: "inherit",
//                           cursor: "inherit",
//                           padding: 0,
//                         }}
//                       >
//                         Report
//                       </button>
//                     </Box>
                      
//                     ) : (
//                       <Typography>pending....</Typography>
//                     )
//                    }
//                 </StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       </Grid>
       
//     </Grid>
     
//     </>
//   );
// }
