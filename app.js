const pidusage = require("pidusage");
const si = require("systeminformation");
const { exec } = require("child_process");

function displayUsage(cpuUsage, memUsage, bars = 50) {
  const cpuPercent = cpuUsage / 100.0;
  const cpuBar =
    "▉".repeat(Math.round(cpuPercent * bars)) +
    "-".repeat(bars - Math.round(cpuPercent * bars));
  const memPercent = memUsage / 100.0;
  const memBar =
    "▉".repeat(Math.round(memPercent * bars)) +
    "-".repeat(bars - Math.round(memPercent * bars));
  console.clear();
  console.log(`CPU Usage: [${cpuBar}] ${cpuUsage.toFixed(2)}%`);
  console.log(`Mem Usage: [${memBar}] ${memUsage.toFixed(2)}%`);
}

function monitorSystemUsage(processName) {
  exec(`pgrep -x ${processName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error occurred while finding process ${processName}: ${error.message}`
      );
      return;
    }
    if (stderr) {
      console.error(
        `Error occurred while finding process ${processName}: ${stderr}`
      );
      return;
    }

    const pid = stdout.trim();
    if (!pid) {
      console.log(`No process named ${processName} found.`);
      return;
    }

    setInterval(async () => {
      try {
        const [cpuStats, memStats] = await Promise.all([
          pidusage(pid),
          si.mem(),
        ]);

        displayUsage(cpuStats.cpu, (memStats.used / memStats.total) * 100);
      } catch (error) {
        console.error("Error occurred while monitoring system usage:", error);
      }
    }, 1000); // Mengambil statistik setiap 1 detik
  });
}

// Contoh penggunaan:
monitorSystemUsage("firefox");
