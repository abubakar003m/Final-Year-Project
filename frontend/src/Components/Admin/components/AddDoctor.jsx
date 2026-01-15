import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
import toast from "react-hot-toast";
import "./doctor.css";

const options = [
  { label: "10AM-12PM", value: "10AM-12PM" },
  { label: "12.30PM-2.30PM", value: "12.30PM-2.30PM" },
  { label: "3PM-5PM", value: "3PM-5PM" },
];

const DEFAULT_IMG_MALE =
  "https://img.freepik.com/premium-vector/doctor-surgeon-pharmacist-therapist-with-stethoscope-smiling-medic-worker-medical-staff_458444-338.jpg";

const DEFAULT_IMG_FEMALE =
  "data:image/jpeg;base64,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"; // keep your full base64

const AddDoctorForm = ({ fetchdata }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male"); // NOT sent to backend

  const [expertise, setExpertise] = useState([""]);
  const [selectdate, setSelectDate] = useState([]);

  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [desc, setDesc] = useState("");
  const [ammount, seAmmount] = useState("");

  // Optional custom image
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const date = useMemo(() => selectdate.map((o) => o.value), [selectdate]);

  const genderDefaultImg = gender === "female" ? DEFAULT_IMG_FEMALE : DEFAULT_IMG_MALE;

  const finalImage = useMemo(() => {
    if (!useCustomImage) return genderDefaultImg;
    return customImageUrl.trim() ? customImageUrl.trim() : genderDefaultImg;
  }, [useCustomImage, customImageUrl, genderDefaultImg]);

  const handleExpertiseChange = (index, value) => {
    const updated = [...expertise];
    updated[index] = value;
    setExpertise(updated);
  };

  const handleAddExpertise = () => setExpertise((prev) => [...prev, ""]);

  const handleRemoveExpertise = (index) => {
    setExpertise((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setGender("male");
    setExpertise([""]);
    setSelectDate([]);
    setContact("");
    setEmail("");
    setPassword("");
    setDesc("");
    seAmmount("");
    setUseCustomImage(false);
    setCustomImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const doctorData = {
        name,
        expertise,
        image: finalImage, // ✅ decided by gender/custom url
        date,
        contact,
        email,
        password,
        desc,
        ammount,
      };

      const response = await axios.post("http://localhost:8080/doctor", doctorData, {
        headers: { authorization: localStorage.getItem("jwt") },
      });

      if (response) {
        toast.success("Doctor Added Successfully");
        fetchdata?.();
        resetForm();
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add doctor");
    }
  };

  return (
    <Box sx={{ maxWidth: 950, mx: "auto", px: 2, py: 4 }}>
      <Paper elevation={6} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Add Doctor
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Fill details below to add a doctor.
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* LEFT FORM */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={gender}
                      label="Gender"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Amount"
                    value={ammount}
                    onChange={(e) => seAmmount(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    fullWidth
                    multiline
                    minRows={3}
                  />
                </Grid>

                {/* Optional custom image */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useCustomImage}
                        onChange={(e) => setUseCustomImage(e.target.checked)}
                      />
                    }
                    label="Use custom image URL (optional)"
                  />
                </Grid>

                {useCustomImage && (
                  <Grid item xs={12}>
                    <TextField
                      label="Image URL"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      fullWidth
                      placeholder="https://example.com/image.jpg"
                    />
                  </Grid>
                )}

                {/* Expertise */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Expertise</Typography>

                  <Stack spacing={1.5}>
                    {expertise.map((value, index) => (
                      <Stack key={index} direction="row" spacing={1}>
                        <TextField
                          label={`Expertise ${index + 1}`}
                          value={value}
                          onChange={(e) => handleExpertiseChange(index, e.target.value)}
                          required
                          fullWidth
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveExpertise(index)}
                          disabled={expertise.length === 1}
                          sx={{ minWidth: 100 }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    ))}

                    <Box>
                      <Button variant="contained" onClick={handleAddExpertise}>
                        + Add More
                      </Button>
                    </Box>
                  </Stack>
                </Grid>

                {/* Slots */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Available Slots</Typography>

                  {/* ✅ Styled wrapper so dropdown is visible without external css */}
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 1,
                      bgcolor: "background.paper",

                      // MultiSelect internal classes
                      "& .dropdown-container": {
                        border: "none !important",
                        boxShadow: "none !important",
                      },
                      "& .dropdown-heading": {
                        minHeight: 48,
                        color: "#000102ff",
                        padding: "8px 10px !important",
                      },
                      "& .dropdown-heading-value": {
                        color: "#000102ff",
                        fontSize: 14,
                      },
                      "& .dropdown-content": {
                        color: "#000102ff",
                        zIndex: 1300, // ✅ show above MUI elements
                      },
                      "& .search input": {
                        padding: "10px !important",
                      },
                      "& .select-item": {
                        fontSize: 13,
                      },
                    }}
                  >
                    <MultiSelect
                      options={options}
                      value={selectdate}
                      onChange={setSelectDate}
                      labelledBy="Choose Slots"
                      hasSelectAll={false}
                      overrideStrings={{
                        selectSomeItems: "Select available slots...",
                        allItemsAreSelected: "All slots selected",
                        search: "Search",
                      }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Selected: {date.length ? date.join(", ") : "None"}
                  </Typography>
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button type="submit" variant="contained" size="large">
                      Submit
                    </Button>
                    <Button type="button" variant="outlined" size="large" onClick={resetForm}>
                      Reset
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT PREVIEW */}
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 800 }}>Profile Preview</Typography>

                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                  }}
                >
                  <img
                    src={finalImage}
                    alt="Doctor Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = genderDefaultImg; // fallback if custom url breaks
                    }}
                  />
                </Box>

                {/* <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  Gender is used only to choose default image. Gender is not stored.
                </Typography> */}
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddDoctorForm;
