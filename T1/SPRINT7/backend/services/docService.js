import fs from "fs";
import path from "path";
import { enrichWithAI } from "./aiService.js";
import { convertMarkdownToPdf } from "./pdfService.js";
import { getOutputDir } from "../utils/paths.js";

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

export async function generateDocs(runId, analysis, umlFiles) {
  const outputDir = getOutputDir(runId);
  await fs.promises.mkdir(outputDir, { recursive: true });

  const aiNotes = await enrichWithAI(analysis);
  const markdown = renderMarkdown(analysis, umlFiles, aiNotes);
  const markdownPath = path.join(outputDir, "documentation.md");
  await fs.promises.writeFile(markdownPath, markdown, "utf-8");

  const pdfPath = await convertMarkdownToPdf(markdownPath);

  return { markdownPath, pdfPath };
}
