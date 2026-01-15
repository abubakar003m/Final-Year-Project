import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

export default function AddDoctorForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [ammount, setAmmount] = useState("");

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/doctor-single", {
        headers: { authorization: localStorage.getItem("jwt") },
      });

      const data = response?.data?.data || null;
      setUser(data);

      setName(data?.name || "");
      setImage(data?.image || "");
      setContact(data?.contact || "");
      setEmail(data?.email || "");
      setDesc(data?.desc || "");
      setAmmount(data?.ammount || "");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const previewImg = useMemo(() => image?.trim() || "", [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const doctorData = { name, image, contact, email, desc, ammount };

      const response = await axios.patch(
        "http://localhost:8080/doctor-update",
        doctorData,
        {
          headers: { authorization: localStorage.getItem("jwt") },
        }
      );

      if (response) {
        toast.success("Doctor Updated Successfully");
        // Optional: refetch to sync UI with backend
        await fetchDoctor();
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setName(user?.name || "");
    setImage(user?.image || "");
    setContact(user?.contact || "");
    setEmail(user?.email || "");
    setDesc(user?.desc || "");
    setAmmount(user?.ammount || "");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 900,
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
            Edit Profile
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            Update your profile information and image.
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={2}>
              <CircularProgress />
              <Typography sx={{ fontWeight: 700, opacity: 0.8 }}>
                Loading profile...
              </Typography>
            </Stack>
          ) : (
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              {/* Left: Preview */}
              <Paper
                variant="outlined"
                sx={{
                  width: { xs: "100%", md: 320 },
                  borderRadius: 4,
                  p: 2.5,
                  height: "fit-content",
                }}
              >
                <Stack spacing={1.5} alignItems="center">
                  <Avatar
                    src={previewImg}
                    sx={{ width: 120, height: 120 }}
                    imgProps={{
                      onError: (e) => {
                        e.currentTarget.src = ""; // hide broken url
                      },
                    }}
                  />
                  <Typography sx={{ fontWeight: 900 }}>{name || "Your Name"}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75, textAlign: "center" }}>
                    This is how your profile will appear.
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  Tip: Use a direct image URL (ending with .jpg/.png) for best results.
                </Typography>
              </Paper>

              {/* Right: Form */}
              <Box sx={{ flex: 1 }}>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                      />
                      <TextField
                        label="Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        fullWidth
                      />
                    </Stack>

                    <TextField
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                      type="email"
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="Amount"
                        value={ammount}
                        onChange={(e) => setAmmount(e.target.value)}
                        required
                        fullWidth
                      />
                      <TextField
                        label="Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        fullWidth
                      />
                    </Stack>

                    <TextField
                      label="Description"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                      fullWidth
                      multiline
                      minRows={4}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={saving}
                        sx={{ borderRadius: 2 }}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={handleReset}
                        disabled={saving}
                        sx={{ borderRadius: 2 }}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Box>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}


// import React, { useState,useEffect } from 'react';
// import axios from 'axios';
// import { TextField, Button, Typography, Box } from '@mui/material';

// import { MultiSelect } from "react-multi-select-component";
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import toast from 'react-hot-toast';
// // import "./doctor.css"

// const options = [
//   { label: "10AM-12PM", value: "10PM-12PM" },
//   { label: "12.30PM-2.30PM", value: "12.30PM-2.30PM" },
//   { label: "3PM-5PM", value: "3PM-5PM" },
// ];


// const theme = createTheme(); // Create a theme




// const AddDoctorForm = () => {



//     const [user,setUser]=useState({})
    

//   const [name, setName] = useState();

//   const [image, setImage] = useState();


//   const [contact, setContact] = useState();
//   const [email, setEmail] = useState();

//   const [desc, setDesc] = useState();
//   const [ammount, setAmmount] = useState();


//   const fetchdoctor=async()=>{
//     try {
//         const response= await axios.get('http://localhost:8080/doctor-single',{
//             headers: {

//                 "authorization": localStorage.getItem("jwt")
//             }})

//             console.log(response.data.data)
//             if(response)
//             {
//                 setUser(response.data.data)
//             }
//         }
//         catch(error)
//         {
//             console.log(error.message)
//         }   
//     }
        


//     React.useEffect(() => {
//         fetchdoctor()
//     }, [])


//     useEffect(() => {
//         setName(user.name || '');
//         setImage(user.image || '');
//         setContact(user.contact || '');
//         setEmail(user.email || '');
//         setDesc(user.desc || '');
//         setAmmount(user.ammount || '');
//       }, [user]);

//     console.log(user)
//     console.log(user.name)
    



  
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const doctorData = { name, image,contact,email,desc,ammount };
     
//      const response=  await axios.patch('http://localhost:8080/doctor-update', doctorData,{
//         headers: {
            
//             "authorization": localStorage.getItem("jwt")
            
//           },
//       });
//       if(response)
//       { 
//     setName("")

// setImage("")

// setContact("")
// setEmail("")

// setDesc("")
// setAmmount("")
// toast.success("Doctor Updated Successfully")

// }
      
      
//     } catch (error) {
//      console.log(error.message)
//     }
//   };

//   return (
   
//     <Box  sx={{ maxWidth: 500, margin: '0 auto' }}>
//       <Typography variant="h4" sx={{
//         textAlign: 'center',
//       }} gutterBottom>
//         Edit Profile
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="name">name:</label>
      
//         <TextField
//         //   label="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           fullWidth
//           margin="normal"
//         />
//         <label htmlFor="email">email:</label>
//         <TextField
//         //   label="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           fullWidth
//           margin="normal"
//         />

// <label htmlFor="contact">Contact</label>
//         <TextField
//         //   label="Contact"
//           value={contact}
//           onChange={(e) => setContact(e.target.value)}
//           required
//           fullWidth
//           margin="normal"
//         />

// <label htmlFor="ammount">Ammount</label>

// <TextField
//         //   label="Total Amount"
//           value={ammount}
//           onChange={(e) => setAmmount(e.target.value)}
//           required
//           fullWidth
//           margin="normal"
//         />

// <label htmlFor="desc">Description</label>
//         <TextField
//         //   label="Description"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//           required
//           fullWidth
//           margin="normal"
//         />

      


// <label htmlFor="image">Image</label>

//          <TextField
//         //   label="Image URL" 
//           value={image}
//           onChange={(e) => setImage(e.target.value)}
//           required
//           fullWidth
//           margin="normal"
//         />


   
   


//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </Box>
  
//   );
// };

// export default AddDoctorForm;




