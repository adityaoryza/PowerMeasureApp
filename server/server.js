const express = require("express");
const pidusage = require("pidusage");
const si = require("systeminformation");
const { exec } = require("child_process");

const app = express();
const port = 3030;

app.get("/usage", async (req, res) => {
  const processName = req.query.processName;

  exec(`pgrep -x ${processName}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error occurred while finding process ${processName}: ${error.message}`
      );
      res.send(`Error occurred while finding process ${processName}`);
      return;
    }
    if (stderr) {
      console.error(
        `Error occurred while finding process ${processName}: ${stderr}`
      );
      res.send(`Error occurred while finding process ${processName}`);
      return;
    }

    const pid = stdout.trim();
    if (!pid) {
      res.status(404).json({ error: `No process named ${processName} found.` });
      return;
    }

    try {
      const [cpuStats, memStats] = await Promise.all([pidusage(pid), si.mem()]);

      const cpuUsage = cpuStats.cpu.toFixed(2); // Round to 2 decimal places
      const memUsage = (memStats.used / (1024 * 1024)).toFixed(2); // Convert to MB and round to 2 decimal places

      res.json({ cpuUsage: `${cpuUsage}%`, memUsage: `${memUsage} MB` });
    } catch (error) {
      console.error("Error occurred while monitoring system usage:", error);
      res.status(500).send("Error occurred while monitoring system usage");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
