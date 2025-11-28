import fs from "fs";
import path from "path";

// Placeholder PDF writer; in production wire to Pandoc or similar tool.
export async function convertMarkdownToPdf(markdownPath) {
  const pdfPath = path.join(path.dirname(markdownPath), "documentation.pdf");
  const content = await fs.promises.readFile(markdownPath, "utf-8");
  const pdfLikeContent = [
    "PDF PLACEHOLDER - use Pandoc or similar for real rendering",
    "",
    content,
  ].join("\n");

  await fs.promises.writeFile(pdfPath, pdfLikeContent, "utf-8");
  return pdfPath;
}
