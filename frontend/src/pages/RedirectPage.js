// src/pages/RedirectPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Box, Paper } from "@mui/material";
import { logEvent } from "../middleware/logger";

// This page handles redirecting users from a short link to the original URL
const RedirectPage = () => {
  const { shortcode } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    logEvent("REDIRECT_ATTEMPT", { shortcode });

    // Pretend we're fetching from a database (here, it's just localStorage)
    const allLogs = JSON.parse(localStorage.getItem("appLogs")) || [];

    // Try to find the most recent matching short code
    const match = allLogs
      .reverse()
      .find(
        (log) =>
          log.event === "URL_SHORTENED" && log.data.shortcode === shortcode
      );

    if (match) {
      const expiry = new Date(match.data.expiry);
      const now = new Date();

      if (now <= expiry) {
        logEvent("REDIRECT_SUCCESS", { shortcode });
        // Take the user to the original long URL!
        window.location.href = match.data.longUrl;
      } else {
        setError("Sorry, this short link has expired. Please create a new one!");
        logEvent("REDIRECT_EXPIRED", { shortcode });
      }
    } else {
      setError("Hmm, we couldn't find that short link. Double-check your URL!");
      logEvent("REDIRECT_NOT_FOUND", { shortcode });
    }
  }, [shortcode]);

  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      {!error ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body1" mt={2}>
            Hang tight, we're sending you to your link...
          </Typography>
        </Box>
      ) : (
        <Paper elevation={4} sx={{ p: 4, maxWidth: 400 }}>
          <Typography variant="h6">Uh-oh!</Typography>
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default RedirectPage;