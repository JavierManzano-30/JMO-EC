import fs from "fs";
import path from "path";
import { enrichWithAI } from "./aiService.js";
import { convertMarkdownToPdf } from "./pdfService.js";
import { getOutputDir, getBackendRoot } from "../utils/paths.js";

function toSafeBaseName(name) {
  const base = path.basename(name || "", path.extname(name || "")) || "documentacion";
  const normalized = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return normalized || "documentacion";
}

function buildTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
}

async function copyToDownloads(runId, markdownPath, pdfPath, projectName) {
  const downloadsRoot = path.resolve(getBackendRoot(), "descargas");
  const markdownDir = path.join(downloadsRoot, "markdown");
  const pdfDir = path.join(downloadsRoot, "pdf");

  await fs.promises.mkdir(markdownDir, { recursive: true });
  await fs.promises.mkdir(pdfDir, { recursive: true });

  const baseName = toSafeBaseName(projectName);
  const timestamp = buildTimestamp();
  const markdownDest = path.join(markdownDir, `${baseName}-${timestamp}.md`);
  const pdfDest = path.join(pdfDir, `${baseName}-${timestamp}.pdf`);

  await fs.promises.copyFile(markdownPath, markdownDest);
  if (pdfPath) {
    await fs.promises.copyFile(pdfPath, pdfDest);
  }
}

function renderMarkdown(analysis, umlFiles, aiNotes) {
  const umlList = umlFiles.map((uml) => `- ${uml}`).join("\n");
  const classList = analysis.classes
    .map(
      (cls) =>
        `- **${cls.className}** (${cls.package})\n  - Métodos: ${cls.methods.join(", ") || "sin métodos detectados"}`
    )
    .join("\n");

  return [
    "# Documentación generada automáticamente",
    "",
    "## Resumen",
    `- Archivos Java: ${analysis.summary.files}`,
    `- Paquetes: ${analysis.summary.packages}`,
    `- Clases: ${analysis.summary.classes}`,
    "",
    "## Clases analizadas",
    classList,
    "",
    "## Diagramas PlantUML",
    umlList,
    "",
    "## Notas generadas por IA",
    aiNotes,
  ].join("\n");
}

export async function generateDocs(runId, analysis, umlFiles, projectName) {
  const outputDir = getOutputDir(runId);
  await fs.promises.mkdir(outputDir, { recursive: true });

  const aiNotes = await enrichWithAI(analysis);
  const markdown = renderMarkdown(analysis, umlFiles, aiNotes);
  const markdownPath = path.join(outputDir, "documentation.md");
  await fs.promises.writeFile(markdownPath, markdown, "utf-8");

  const pdfPath = await convertMarkdownToPdf(markdownPath);

  await copyToDownloads(runId, markdownPath, pdfPath, projectName);

  return { markdownPath, pdfPath };
}
