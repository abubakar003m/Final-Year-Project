import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const BG =
  "https://wallpapers.com/images/hd/profile-picture-background-l9lertipy1ynf57v.jpg";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userContact, setUserContact] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userAge, setUserAge] = useState("");

  const token = localStorage.getItem("jwt");

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/userdetails", {
        headers: { authorization: token },
      });

      const u = response?.data?.data || null;
      setUser(u);

      setUserName(u?.username || "");
      setUserEmail(u?.email || "");
      setUserContact(u?.phone || "");
      setUserAddress(u?.location || "");
      setUserGender(u?.gender || "");
      setUserAge(u?.age || "");
      setUserPassword("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      await axios.put(
        "http://localhost:8080/updatepatient",
        {
          username: userName,
          email: userEmail,
          password: userPassword, // if empty, backend should ignore (recommended)
          phone: userContact,
          location: userAddress,
          age: userAge,
          gender: userGender,
        },
        { headers: { authorization: token } }
      );

      toast.success("Profile Updated Successfully");
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  const handleCancelClick = () => {
    // reset to original user data
    setUserName(user?.username || "");
    setUserEmail(user?.email || "");
    setUserContact(user?.phone || "");
    setUserAddress(user?.location || "");
    setUserGender(user?.gender || "");
    setUserAge(user?.age || "");
    setUserPassword("");
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "rgba(0,0,0,0.35)",
          pt: { xs: 10, md: 12 }, // ✅ margin-top for navbar
          pb: 5,
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={10} sx={{ borderRadius: 4, overflow: "hidden" }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #eee" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
                    <PersonOutlineIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#000" }}>
                      User Profile
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, color: "#000" }}>
                      View and update your personal information.
                    </Typography>
                  </Box>
                </Stack>

                {!loading && (
                  <Box>
                    {isEditing ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={<SaveOutlinedIcon />}
                          onClick={handleSaveClick}
                          sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CloseOutlinedIcon />}
                          onClick={handleCancelClick}
                          sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<EditOutlinedIcon />}
                        onClick={handleEditClick}
                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, py: 3 }}>
              {loading ? (
                <Typography sx={{ fontWeight: 800, color: "#000" }}>
                  Loading profile...
                </Typography>
              ) : (
                <>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Name"
                        fullWidth
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        fullWidth
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="New Password (optional)"
                        fullWidth
                        type="password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        disabled={!isEditing}
                        placeholder={isEditing ? "Enter new password" : "********"}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Contact"
                        fullWidth
                        value={userContact}
                        onChange={(e) => setUserContact(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Address"
                        fullWidth
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Age"
                        fullWidth
                        type="number"
                        value={userAge}
                        onChange={(e) => setUserAge(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormLabel sx={{ fontWeight: 900, color: "#000" }}>
                        Gender
                      </FormLabel>

                      <RadioGroup
                        row
                        value={userGender}
                        onChange={(e) => setUserGender(e.target.value)}
                      >
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                          disabled={!isEditing}
                        />
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                          disabled={!isEditing}
                        />
                        <FormControlLabel
                          value="other"
                          control={<Radio />}
                          label="Other"
                          disabled={!isEditing}
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default UserProfile;






// import React, { useState } from 'react';
// import {
//   Typography,
//   Button,
//   Container,
//   TextField,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormLabel,
//   Grid,
//   Box,
// } from '@mui/material';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const UserProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [user, setUser] = useState({});
//   const [userName, setUserName] = useState();
//   const [userEmail, setUserEmail] = useState();
//   const [userPassword, setUserPassword] = useState();
//   const [userContact, setUserContact] = useState();
//   const [userAddress, setUserAddress] = useState();
//   const [userGender, setUserGender] = useState();
//   const [userAge, setUserAge] = useState();

//   const fetch_user = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/userdetails', {
//         headers: {
//           authorization: localStorage.getItem('jwt'),
//         },
//       });
//       setUser(response?.data?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   React.useEffect(() => {
//     fetch_user();
//   }, [isEditing]);

//   React.useEffect(() => {
//     setUserName(user?.username);
//     setUserEmail(user?.email);
//     // setUserPassword("*********");
//     setUserContact(user?.phone);
//     setUserAddress(user?.location);
//     setUserGender(user?.gender);
//     setUserAge(user?.age);
//   }, [user, isEditing]);

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveClick = async () => {
//     try {
//       const response = await axios.put(
//         'http://localhost:8080/updatepatient',
//         {
//           username: userName,
//           email: userEmail,
//           password: userPassword,
//           phone: userContact,
//           location: userAddress,
//           age: userAge,
//           gender: userGender,
//         },
//         {
//           headers: {
//             authorization: localStorage.getItem('jwt'),
//           },
//         }
//       );

//       setUserName('');
//       setUserEmail('');
//       setUserPassword('');
//       setUserContact('');
//       setUserAddress('');
//       setUserGender('');
//       setUserAge('');
//       toast.success('Profile Updated Successfully');

//       setIsEditing(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);

//     setUserName('');
//     setUserEmail('');
//     setUserPassword('');
//     setUserContact('');
//     setUserAddress('');
//     setUserGender('');
//     setUserAge('');
//   };

//   const containerStyle = {
//     backgroundImage: `url('https://wallpapers.com/images/hd/profile-picture-background-l9lertipy1ynf57v.jpg')`, // Replace with your background image URL
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     minHeight: '100vh', // Ensure the container takes up the full viewport height
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     maxWidth: '100%',
//   };

//   const titleStyle = {
//     color: 'white', // Text color
//     textAlign: 'center',
//     marginBottom: '20px',
//   };

//   return (
//     <Container style={containerStyle}>
//       <Typography variant="h4" style={{
//         textAlign: 'center',
//       }} gutterBottom>
//         User Profile
//       </Typography>

//       {/* ... Rest of your component */}
//       <Container maxWidth="md" style={{ marginTop: '50px' }}>
        
       

    

//           <Grid container spacing={4}>
               
        
//               <Grid item xs={12} sm={6}>
              
               
//                 {isEditing ? (
//                     <TextField
//                       label="Name"
//                       fullWidth
//                       value={userName}
//                       onChange={(e) => setUserName(e.target.value)}
//                       margin="normal"
//                     />
//                   ) : (
//                     <Typography variant="subtitle1">Name: {userName}</Typography>
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   {isEditing ? (
//                     <TextField
//                       label="Email"
//                       fullWidth
//                       value={userEmail}
//                       onChange={(e) => setUserEmail(e.target.value)}
//                       margin="normal"
//                     />
//                   ) : (
//                     <Typography variant="subtitle1">Email: {userEmail}</Typography>
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   {isEditing ? (
//                     <TextField
//                       label="Enter new password"
//                       fullWidth
//                       type="password"
//                       value={userPassword}
//                       onChange={(e) => setUserPassword(e.target.value)}
//                       margin="normal"
//                     />
//                   ) : (
//                     <Typography variant="subtitle1">Password: ********</Typography>
                    
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   {isEditing ? (
//                     <TextField
//                       label="Contact"
//                       fullWidth
//                       value={userContact}
//                       onChange={(e) => setUserContact(e.target.value)}
//                       margin="normal"
//                     />
//                   ) : (
//                     <Typography variant="subtitle1">Contact: {userContact}</Typography>
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   {isEditing ? (
//                     <TextField
//                       label="Address"
//                       fullWidth
//                       value={userAddress}
//                       onChange={(e) => setUserAddress(e.target.value)}
//                       margin="normal"
//                     />
//                   ) : (
//                     <Typography variant="subtitle1">Address: {userAddress}</Typography>
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   {isEditing ? (
//                     <Box>
//                       <FormLabel component="legend">Gender</FormLabel>
//                       <RadioGroup
//                         row
//                         value={userGender}
//                         onChange={(e) => setUserGender(e.target.value)}
//                       >
//                         <FormControlLabel
//                           value="Male"
//                           control={<Radio />}
//                           label="Male"
//                         />
//                         <FormControlLabel
//                           value="Female"
//                           control={<Radio />}
//                           label="Female"
//                         />
//                         <FormControlLabel
//                           value="Other"
//                           control={<Radio />}
//                           label="Other"
//                         />
//                       </RadioGroup>
//                     </Box>
//                   ) : (
//                     <Typography variant="subtitle1">Gender: {userGender}</Typography>
//                   )}
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   {isEditing ? (
//                     <TextField
//                       label="Age"
//                       fullWidth
//                       value={userAge}
//                       onChange={(e) => setUserAge(e.target.value)}
//                       margin="normal"
//                     />
//                   ) : (
//                     <Typography variant="subtitle1">Age: {userAge}</Typography>
//                   )}
//                 </Grid>
//               </Grid>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   marginTop: '20px',
//                   marginBottom: '20px',
//                 }}
//               >
//                 {isEditing ? (
//                   <>
//                     <Button variant="contained" color="primary" onClick={handleSaveClick}>
//                       Save
//                     </Button>
//                     <Button variant="contained" onClick={handleCancelClick}>
//                       Cancel
//                     </Button>
//                   </>
//                 ) : (
//                   <Button variant="contained" color="primary" onClick={handleEditClick}>
//                     Edit
//                   </Button>
//                 )}
//               </Box>
//             </Container>
//     </Container>
//   );
// };

// export default UserProfile;
