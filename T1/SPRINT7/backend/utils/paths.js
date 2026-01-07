import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getBackendRoot() {
  return path.resolve(__dirname, "..");
}

export function getOutputDir(runId) {
  return path.join(getBackendRoot(), "output", runId);
}

export function getUploadsUnzippedDir(runId) {
  return path.join(getBackendRoot(), "uploads", "unzipped", runId);
}

export function getHistoryPath() {
  return path.join(getBackendRoot(), "storage", "history.json");
}
