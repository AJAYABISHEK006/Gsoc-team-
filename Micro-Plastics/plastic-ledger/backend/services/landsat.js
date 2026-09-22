const { spawn } = require("child_process");
const path = require("path");

class LandsatService {
  constructor() {
    this.scriptPath = path.join(__dirname, "../../ai/satellite/landsat9_pipeline.py");
  }

  async getLatestPass(pathRow = "142_051", lat = 13.08, lon = 80.32) {
    return new Promise((resolve) => {
      const proc = spawn("python", [this.scriptPath]);
      let stdout = "";
      proc.stdout.on("data", (data) => { stdout += data.toString(); });
      proc.on("close", () => {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          resolve({
            satellite: "Landsat-9 OLI-2",
            path_row: pathRow,
            acquisition_date: new Date().toISOString(),
            spatial_resolution: "30m Multispectral",
            detected_clusters: []
          });
        }
      });
    });
  }
}

module.exports = new LandsatService();
