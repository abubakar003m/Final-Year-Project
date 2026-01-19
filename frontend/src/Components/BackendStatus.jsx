import { useState, useEffect } from "react";

import {
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from "@mui/material";

import { API_BASE_URL } from "../api/api";

const BackendStatus = () => {

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Checking server...");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {

    let attempts = 0;
    const maxAttempts = 3;

    const tryConnect = async () => {

      attempts++;
      setMessage(`Connecting to server... (${attempts}/${maxAttempts})`);

      try {

        const response = await fetch(`${API_BASE_URL}/health`, {
          signal: AbortSignal.timeout(60000)
        });

        if (response.ok) {

          setStatus("online");
          setMessage("Server is ready!");
          
          setTimeout(() => {
            setOpen(false);
          }, 2500);

        } else {
          throw new Error("Server error");
        }

      } catch (error) {

        if (attempts < maxAttempts) {

          setMessage("Server starting... Retrying in 10 seconds");

          setTimeout(tryConnect, 10000);

        } else {

          setStatus("error");
          setMessage("Cannot connect to backend server");
        }

      }
    };

    tryConnect();
  };

  const getSeverity = () => {

    if (status === "online") return "success";
    if (status === "error") return "error";
    return "info";
  };

  return (

    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={getSeverity()}
        sx={{ minWidth: 320 }}
        icon={
          status === "checking" ? (
            <Box mr={1}>
              <CircularProgress size={18} />
            </Box>
          ) : undefined
        }
      >

        {message}

      </Alert>
    </Snackbar>
  );
};

export default BackendStatus;
