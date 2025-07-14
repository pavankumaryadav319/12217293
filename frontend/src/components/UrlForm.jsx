import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Log } from "../utils/logger";

function UrlForm() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    try {
      await Log("frontend", "info", "component", "Shorten button clicked");
      const res = await axios.post("http://localhost:5000/shorturls", {
        url,
        validity: validity ? parseInt(validity) : undefined,
        shortcode: shortcode || undefined
      });
      setResponse(res.data);
    } catch (err) {
      await Log("frontend", "error", "component", err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Shorten URL</Typography>
      <TextField label="URL" fullWidth value={url} onChange={(e) => setUrl(e.target.value)} sx={{ my: 1 }} />
      <TextField label="Validity (minutes)" fullWidth value={validity} onChange={(e) => setValidity(e.target.value)} sx={{ my: 1 }} />
      <TextField label="Shortcode (optional)" fullWidth value={shortcode} onChange={(e) => setShortcode(e.target.value)} sx={{ my: 1 }} />
      <Button variant="contained" onClick={handleSubmit}>Shorten</Button>
      {response && (
        <Box mt={2}>
          <Typography>Short URL: <a href={response.shortLink}>{response.shortLink}</a></Typography>
          <Typography>Expires At: {response.expiry}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default UrlForm;
