import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const App = () => {
  const [processName, setProcessName] = useState("");
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memUsage, setMemUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [noProcessMatch, setNoProcessMatch] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setNoProcessMatch(false);

    try {
      if (!processName) {
        setCpuUsage(0);
        setMemUsage(0);
        setIsLoading(false);
        return;
      }

      const response = await axios.get("/usage", {
        params: { processName },
      });

      const { cpuUsage, memUsage } = response.data;

      if (cpuUsage === -1 && memUsage === -1) {
        setNoProcessMatch(true);
        setCpuUsage(0);
        setMemUsage(0);
      } else {
        setCpuUsage(cpuUsage);
        setMemUsage(memUsage);
      }
    } catch (error) {
      setError("Error occurred while fetching data");
    }

    setIsLoading(false);
  }, [processName]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1500); // Fetch data every 1.5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [fetchData]);

  const handleProcessNameChange = (event) => {
    setProcessName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="container mt-5">
      <Typography variant="h4" gutterBottom>
        System Usage
      </Typography>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Enter process name"
            value={processName}
            onChange={handleProcessNameChange}
            style={{ marginRight: "16px" }}
          />
          <Button variant="contained" color="primary" type="submit">
            Fetch Data
          </Button>
        </div>
      </form>

      {isLoading && (
        <div style={{ marginTop: "16px" }}>
          <CircularProgress />
        </div>
      )}

      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {!isLoading && !error && noProcessMatch && (
        <Typography variant="body1" color="error" gutterBottom>
          No process named "{processName}" found.
        </Typography>
      )}

      {!isLoading && !error && !noProcessMatch && processName && (
        <div style={{ marginTop: "16px" }}>
          <Typography variant="body1" gutterBottom>
            CPU Usage: {cpuUsage}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={cpuUsage}
            style={{ marginBottom: "16px" }}
          />

          <Typography variant="body1" gutterBottom>
            Memory Usage: {memUsage} MB
          </Typography>
          <LinearProgress
            variant="determinate"
            value={memUsage}
            style={{ marginBottom: "16px" }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
