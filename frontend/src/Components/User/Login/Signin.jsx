import React from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Link,
  InputAdornment,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";

export default function SignUpForm() {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    location: "",
    phone: "",
  };

  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    gender: yup.string().required("Gender is required"),
    age: yup.string().required("Age is required"),
    location: yup.string().required("Location is required"),
    phone: yup.string().required("Phone is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post("http://localhost:8080/signup", values);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      const msg =
        error?.response?.data?.message || "An error occurred during signup.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {/* ✅ Margin from top for navbar */}
      <Box sx={{ mt: { xs: 10, md: 12 }, mb: 4 }}>
        <Paper elevation={8} sx={{ borderRadius: 4, overflow: "hidden" }}>
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Sign up to continue
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box sx={{ px: 3, py: 3 }}>
            <Formik
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={onSubmit}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="username"
                        label="Username"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="username" />
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="email" />
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="password" />
                      </Typography>
                    </Grid>

                    {/* Gender */}
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel sx={{ fontWeight: 800 }}>Gender</FormLabel>
                        <Field as={RadioGroup} name="gender" row>
                          <FormControlLabel value="female" control={<Radio />} label="Female" />
                          <FormControlLabel value="male" control={<Radio />} label="Male" />
                          <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </Field>
                      </FormControl>

                      {/* ✅ Fixed error name */}
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="gender" />
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="age" />
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        name="phone"
                        label="Phone"
                        type="tel"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="phone" />
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="location"
                        label="Location"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography variant="caption" color="error">
                        <ErrorMessage name="location" />
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        sx={{ mt: 1.5, borderRadius: 2, fontWeight: 900 }}
                      >
                        {isSubmitting ? "Creating..." : "Sign Up"}
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2.5 }} />

                  <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.8 }}>
                    Already have an account?{" "}
                    <Link component={RouterLink} to="/login" sx={{ fontWeight: 900 }}>
                      Login
                    </Link>
                  </Typography>
                </Form>
              )}
            </Formik>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}


// import React from "react";
// import { TextField, Button, Grid, Typography, Container, FormControl, FormLabel, RadioGroup, Radio } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as yup from "yup";
// import toast from "react-hot-toast";
// import { Box } from "@mui/system";
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Avatar from '@mui/material/Avatar';
// import FormControlLabel from '@mui/material/FormControlLabel';


// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// const theme = createTheme();

// function SignUpForm() {
//   const Navigate = useNavigate();

//   const initialValues = {
//     username: "",
//     email: "",
//     password: "",
//     gender:"",
//     age:"",
//   location:"",
//   phone:"",


//   };
//   const validationSchema = yup.object({
//     username: yup.string().required("Username must be required"),
//     email: yup.string().email("Invalid email!").required("Email must be required"),
//     password: yup
//       .string()
//       .required("Password must be required")
//       .min(8, "Password must be greater than 8 characters"),
//     gender: yup.string().required("Gender is required"),
//     age: yup.string().required("Age is required"),
//     location: yup.string().required("Location is required"),
//     phone: yup.string().required("Phone is required"),
//   });
  

//   const onSubmit = async (values) => {
//     console.log(values)
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/signup",

//         values
//       );

//       console.log(response);

//       Navigate("/login");
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("An error occurred during signup.");
//       }
//     }
//   };
//   return (
//     <ThemeProvider theme={theme}>
//       <Container
//        component="main" maxWidth="sm"
//       >

// <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             boxShadow: 3,
//             borderRadius: 2,
//           px: 4,
//           py: 6,
//           }}
//         >
//         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Sign up
//           </Typography>
//         <Formik
//           validationSchema={validationSchema}
//           initialValues={initialValues}
//           onSubmit={onSubmit}
//         >
//           <Form>
//             <Grid container spacing={2}>
//               <Grid item xs={12} >
//                 <Field
//                   as={TextField}
//                   type="text"
//                   label="Username"
//                   variant="outlined"
//                   name="username"
//                   fullWidth
//                 />
//                 <Box sx={{ color: "red" }}>

//                 <ErrorMessage name="username" />
//                 </Box>
//               </Grid>
//               <Grid item xs={12}>
//                 <Field
//                   as={TextField}
//                   type="email"
//                   label="Email"
//                   variant="outlined"
//                   name="email"
//                   fullWidth
//                 />
//                 <Box sx={{ color: "red" }}>

//                 <ErrorMessage name="email" />
//                 </Box>
//               </Grid>
//               <Grid item xs={12}>
//                 <Field
//                   as={TextField}
//                   type="password"
//                   label="Password"
//                   variant="outlined"
//                   name="password"
//                   fullWidth
//                 />
//                 <Box sx={{ color: "red" }}>
//                 <ErrorMessage name="password" />
//                 </Box>
//               </Grid>

//               <Grid item xs={12}>
//             <FormControl component="fieldset">
//               <FormLabel id="gender-label">Gender</FormLabel>
              
              
//                   <Field 
//                   name="gender"
//                   as={RadioGroup}
//                     row
//                     aria-labelledby="gender-label"
                    
//                   >
//                     <FormControlLabel value="female" control={<Radio />} label="Female" />
//                     <FormControlLabel value="male" control={<Radio />} label="Male" />
//                     <FormControlLabel value="other" control={<Radio />} label="Other" />
//                   </Field>
               
            
//             </FormControl>

//             <Box sx={{ color: "red" }}>
//                 <ErrorMessage name="sex" />
//                 </Box>

//           </Grid>

//           <Grid item xs={12}>
//                 <Field
//                   as={TextField}
//                   type="text"
//                   label="age"
//                   variant="outlined"
//                   name="age"
//                   fullWidth
//                 />
//                 <Box sx={{ color: "red" }}>
//                 <ErrorMessage name="age" />
//                 </Box>
//               </Grid>

//               <Grid item xs={12}>
//                 <Field
//                   as={TextField}
//                   type="text"
//                   label="location"
//                   variant="outlined"
//                   name="location"
//                   fullWidth
//                 />
//                 <Box sx={{ color: "red" }}>
//                 <ErrorMessage name="location" />
//                 </Box>
//               </Grid>
//               <Grid item xs={12}>
//                 <Field
//                   as={TextField}
//                   type="text"
//                   label="phone"
//                   variant="outlined"
//                   name="phone"
//                   fullWidth
//                 />
//                 <Box sx={{ color: "red" }}>
//                 <ErrorMessage name="phone" />
//                 </Box>
//               </Grid>




//               <Grid item xs={12}>
//                <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Sign Up
//             </Button>

           
//               </Grid>
//             </Grid>
//           </Form>
//         </Formik>

// </Box>
//       </Container>
//       </ThemeProvider>
//   );
// }

// export default SignUpForm;







