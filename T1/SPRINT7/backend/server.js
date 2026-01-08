import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { analyzeProject } from "./analyzers/javaAnalyzer.js";
import { generateUml } from "./generators/umlGenerator.js";
import { generateDocs } from "./services/docService.js";
import { historyStore } from "./storage/historyStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
});

const ensureDirectories = () => {
  const dirs = [
    path.join(__dirname, "uploads"),
    path.join(__dirname, "uploads", "unzipped"),
    path.join(__dirname, "output"),
    path.join(__dirname, "storage"),
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

app.use(cors());
app.use(express.json());
app.use("/output", express.static(path.join(__dirname, "output")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/history", (_req, res) => {
  res.json(historyStore.getRuns());
});

app.get("/api/docs/:id", (req, res) => {
  const { id } = req.params;
  const format = req.query.format === "pdf" ? "pdf" : "md";
  const record = historyStore.getRun(id);

  if (!record) {
    return res.status(404).json({ message: "Ejecucion no encontrada" });
  }

  const filePath = format === "pdf" ? record.pdfPath : record.markdownPath;
  if (!filePath || !fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ message: `Archivo ${format.toUpperCase()} no disponible` });
  }

  const filename =
    format === "pdf" ? "documentacion.pdf" : "documentacion.md";
  res.setHeader(
    "Content-Type",
    format === "pdf" ? "application/pdf" : "text/markdown; charset=utf-8"
  );
  res.download(filePath, filename);
});

app.get("/api/uml/:id", (req, res) => {
  const { id } = req.params;
  const format = req.query.format === "png" ? "png" : "puml";
  const record = historyStore.getRun(id);

  if (!record) {
    return res.status(404).json({ message: "Ejecucion no encontrada" });
  }

  const filePath =
    format === "png" ? record.umlImagePath : record.umlFiles?.[0];
  if (!filePath || !fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ message: `UML ${format.toUpperCase()} no disponible` });
  }

  const filename = format === "png" ? "uml.png" : "uml.puml";
  res.setHeader(
    "Content-Type",
    format === "png" ? "image/png" : "text/plain; charset=utf-8"
  );
  res.download(filePath, filename);
});

app.post("/api/analyze", upload.single("project"), async (req, res) => {
  const runId = uuidv4();
  const projectPath = req.file?.path || req.body.projectPath;
  const projectName = req.file?.originalname || path.basename(projectPath || "");

  if (!projectPath) {
    return res.status(400).json({ message: "Debe enviar un proyecto o ruta" });
  }

  try {
    const analysis = await analyzeProject(projectPath, runId);
    const { umlFiles, umlImagePath } = await generateUml(runId, analysis);
    const docs = await generateDocs(runId, analysis, umlFiles, projectName);
    const stored = historyStore.addRun({
      id: runId,
      projectPath,
      projectName,
      analysisSummary: analysis.summary,
      markdownPath: docs.markdownPath,
      pdfPath: docs.pdfPath,
      umlFiles,
      umlImagePath,
      createdAt: new Date().toISOString(),
      status: "success",
    });

    res.json({
      runId,
      analysis,
      umlFiles,
      umlImagePath,
      markdownPath: stored.markdownPath,
      pdfPath: stored.pdfPath,
    });
  } catch (error) {
    historyStore.addRun({
      id: runId,
      projectPath,
      error: error.message,
      status: "error",
      createdAt: new Date().toISOString(),
    });
    res.status(500).json({
      message: "Error al generar documentacion",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // Keep a concise start-up log
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
