import fs from "fs";
import { getHistoryPath } from "../utils/paths.js";

const historyPath = getHistoryPath();

function loadHistory() {
  try {
    const content = fs.readFileSync(historyPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

let runs = loadHistory();

function persist() {
  fs.writeFileSync(historyPath, JSON.stringify(runs, null, 2));
}

function addRun(run) {
  runs.unshift(run);
  persist();
  return run;
}

function getRuns() {
  return runs;
}

function getRun(id) {
  return runs.find((r) => r.id === id);
}

export const historyStore = {
  addRun,
  getRuns,
  getRun,
};
