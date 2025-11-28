import fs from "fs";
import path from "path";

function renderClassBlock(cls) {
  const methods = cls.methods.map((m) => `    + ${m}()`).join("\n");
  return `class ${cls.className} {\n${methods}\n}`;
}

export async function generateUml(runId, analysis) {
  const outputDir = path.join(path.resolve(), "SPRINT6", "backend", "output", runId);
  await fs.promises.mkdir(outputDir, { recursive: true });

  const uml = [
    "@startuml",
    "title Diagrama de clases generado automáticamente",
    ...analysis.classes.map(renderClassBlock),
    "@enduml",
  ].join("\n");

  const umlPath = path.join(outputDir, "diagram.puml");
  await fs.promises.writeFile(umlPath, uml, "utf-8");

  return [umlPath];
}
