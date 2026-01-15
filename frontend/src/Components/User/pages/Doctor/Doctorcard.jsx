import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function DoctorCard({ item }) {
  const { name, image, _id, desc, expertise } = item;

  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 3,
        boxShadow: "0px 4px 18px rgba(0,0,0,0.10)",
        transition: "0.3s",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 25px rgba(0,0,0,0.20)",
        },
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={name}
        sx={{
          objectFit: "cover",
        }}
      />

      {/* Doctor Info */}
      <CardContent sx={{ p: 2 }}>
        <Typography
          gutterBottom
          variant="h6"
          sx={{ fontWeight: 700, textAlign: "center", color: "#000" }}
        >
          {name}
        </Typography>

        {/* Description from database */}
        <Typography
          variant="body2"
          sx={{
            color: "#333",
            mb: 1,
            textAlign: "center",
            minHeight: "48px",
          }}
        >
          {desc ? desc.slice(0, 70) + "..." : "Expert doctor available for consultation."}
        </Typography>

        {/* Expertise preview */}
        {expertise?.length > 0 && (
          <Typography
            variant="body2"
            sx={{
              fontSize: 13,
              textAlign: "center",
              color: "gray",
              fontStyle: "italic",
            }}
          >
            {expertise.slice(0, 2).join(", ") + "..."}
          </Typography>
        )}
      </CardContent>

      {/* Action Button */}
      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="contained"
          size="small"
          component={Link}
          to={`/form/${_id}`}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#0c5cb7" },
          }}
        >
          Book Appointment
        </Button>
      </CardActions>
    </Card>
  );
}
