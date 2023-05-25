import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

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
      <h1 className="mb-4">System Usage</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter process name"
            value={processName}
            onChange={handleProcessNameChange}
          />
          <button className="btn btn-primary" type="submit">
            Fetch Data
          </button>
        </div>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!isLoading && !error && noProcessMatch && (
        <p className="text-danger">No process named "{processName}" found.</p>
      )}

      {!isLoading && !error && !noProcessMatch && processName && (
        <div>
          <p className="mb-2">CPU Usage: {cpuUsage}</p>
          <div className="progress mb-4">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${cpuUsage}` }}
              aria-valuenow={cpuUsage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {cpuUsage}
            </div>
          </div>
          <p className="mb-2">Memory Usage: {memUsage} MB</p>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${memUsage}` }}
              aria-valuenow={memUsage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {memUsage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
