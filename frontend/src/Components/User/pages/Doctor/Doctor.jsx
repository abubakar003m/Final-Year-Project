import React, { useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import Loading from "../../Loading";
import { getdoctor } from "../../slices/getDoctor";
import { useDispatch, useSelector } from "react-redux";
import DoctorCard from "./Doctorcard";

const Doctor = () => {
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.doctor);
  const { doctor, isLoading } = datas;

  useEffect(() => {
    dispatch(getdoctor());
  }, []);

  return (
    <>
      <Loading isloading={isLoading} />

      {/* White Background Wrapper */}
      <Box sx={{  minHeight: "100vh", py: 4 }}>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "120px",
          }}
        >
          <Grid item xs={12}>
            <Typography
              sx={{
                color: "black",
                fontSize: "40px",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                mb: 4,
              }}
            >
              OUR DOCTORS
            </Typography>
          </Grid>

          {doctor?.doctors?.map((item, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={3}
              sx={{ padding: "10px" }}
            >
              <DoctorCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Doctor;
