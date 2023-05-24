const express = require("express");
const pidusage = require("pidusage");
const si = require("systeminformation");
const { exec } = require("child_process");

const app = express();
const port = 3030;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/usage", (req, res) => {
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
      res.send(`No process named ${processName} found.`);
      return;
    }

    try {
      const [cpuStats, memStats] = await Promise.all([pidusage(pid), si.mem()]);

      const cpuUsage = cpuStats.cpu;
      const memUsage = (memStats.used / memStats.total) * 100;

      res.json({ cpuUsage, memUsage });
    } catch (error) {
      console.error("Error occurred while monitoring system usage:", error);
      res.send("Error occurred while monitoring system usage");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
