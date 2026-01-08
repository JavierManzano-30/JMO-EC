import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { getOutputDir } from "../utils/paths.js";

function renderClassBlock(cls) {
  const methods = cls.methods.map((m) => `    + ${m}()`).join("\n");
  return `class ${cls.className} {\n${methods}\n}`;
}

function buildRelations(classes) {
  const names = new Set(classes.map((c) => c.className));
  const relations = new Set();
  const normalizeType = (value) => {
    if (!value) return null;
    const cleaned = value.replace(/\[\]$/, "").replace(/<.*>/g, "");
    const base = cleaned.split(".").pop();
    if (!base || ["int", "long", "double", "float", "boolean", "char", "byte", "short", "void", "String"].includes(base)) {
      return null;
    }
    return base;
  };

  for (const cls of classes) {
    if (cls.extendsClass && names.has(cls.extendsClass)) {
      relations.add(`${cls.extendsClass} <|-- ${cls.className}`);
    }
    if (Array.isArray(cls.implementsInterfaces)) {
      for (const iface of cls.implementsInterfaces) {
        if (names.has(iface)) {
          relations.add(`${iface} <|.. ${cls.className}`);
        }
      }
    }

    for (const field of cls.fields || []) {
      const type = normalizeType(field.type);
      if (type && names.has(type)) {
        relations.add(`${cls.className} --> ${type} : ${field.name}`);
      }
    }

    for (const type of cls.methodTypes || []) {
      const normalized = normalizeType(type);
      if (normalized && names.has(normalized)) {
        relations.add(`${cls.className} ..> ${normalized}`);
      }
    }
  }

  return Array.from(relations);
}

function runPlantUml(umlPath, outputDir) {
  return new Promise((resolve, reject) => {
    execFile("plantuml", ["-tpng", umlPath], { cwd: outputDir }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      const pngPath = path.join(
        outputDir,
        `${path.basename(umlPath, ".puml")}.png`
      );
      resolve(pngPath);
    });
  });
}

export async function generateUml(runId, analysis) {
  const outputDir = getOutputDir(runId);
  await fs.promises.mkdir(outputDir, { recursive: true });

  const relations = buildRelations(analysis.classes || []);
  const uml = [
    "@startuml",
    "title Diagrama de clases generado automáticamente",
    ...analysis.classes.map(renderClassBlock),
    "",
    "' Relaciones detectadas",
    ...relations,
    "@enduml",
  ].join("\n");

  const umlPath = path.join(outputDir, "diagram.puml");
  await fs.promises.writeFile(umlPath, uml, "utf-8");

  let umlImagePath = null;
  try {
    umlImagePath = await runPlantUml(umlPath, outputDir);
  } catch (_error) {
    umlImagePath = null;
  }

  return { umlFiles: [umlPath], umlImagePath };
}
