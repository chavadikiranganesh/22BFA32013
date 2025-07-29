import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import { logEvent } from "../middleware/logger";

const UrlShortenerPage = () => {
  const defaultInput = { longUrl: "", shortcode: "", validity: "" };
  const [inputs, setInputs] = useState([{ ...defaultInput }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const handleAddInput = () => {
    if (inputs.length >= 5) return;
    setInputs([...inputs, { ...defaultInput }]);
  };

  const handleSubmit = () => {
    const output = [];

    for (let i = 0; i < inputs.length; i++) {
      const { longUrl, shortcode, validity } = inputs[i];

      if (!longUrl || !longUrl.startsWith("http")) {
        alert(`Invalid URL at row ${i + 1}`);
        logEvent("INVALID_URL", { index: i, url: longUrl });
        return;
      }

      const code = shortcode || Math.random().toString(36).substring(2, 7);
      const minutes = parseInt(validity) || 30;
      const expiry = new Date(Date.now() + minutes * 60000).toLocaleString();

      output.push({
        longUrl,
        shortcode: code,
        expiry,
      });

      logEvent("URL_SHORTENED", { index: i, longUrl, shortcode: code, expiry });
    }

    setResults(output);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, m: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {inputs.map((row, idx) => (
        <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Long URL"
              fullWidth
              value={row.longUrl}
              onChange={(e) => handleChange(idx, "longUrl", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Custom Shortcode"
              fullWidth
              value={row.shortcode}
              onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Validity (min)"
              type="number"
              fullWidth
              value={row.validity}
              onChange={(e) => handleChange(idx, "validity", e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={handleAddInput}
          disabled={inputs.length >= 5}
          sx={{ mr: 2 }}
        >
          Add Another
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shortened URLs:</Typography>
          {results.map((res, i) => (
            <Paper key={i} sx={{ p: 2, my: 1 }}>
              <Typography>Original: {res.longUrl}</Typography>
              <Typography>
                Short URL:{" "}
                <a
                  href={`/${res.shortcode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {window.location.origin}/{res.shortcode}
                </a>
              </Typography>
              <Typography>Expires At: {res.expiry}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UrlShortenerPage;