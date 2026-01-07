import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { getUploadsUnzippedDir } from "../utils/paths.js";

const JAVA_REGEX = {
  package: /^\s*package\s+([\w.]+);/m,
  class: /(?:public|protected|private)?\s*(class|interface|enum)\s+(\w+)/,
  method: /(?:public|protected|private)\s+[<>\w\[\]]+\s+(\w+)\s*\([^)]*\)\s*\{/g,
};

async function collectJavaFiles(basePath) {
  const entries = await fs.promises.readdir(basePath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(basePath, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectJavaFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith(".java")) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseJavaFile(content) {
  const pkg = JAVA_REGEX.package.exec(content)?.[1] || "default";
  const classMatch = JAVA_REGEX.class.exec(content);
  const className = classMatch?.[2] || "UnknownClass";
  const methods = [];
  let methodMatch;
  while ((methodMatch = JAVA_REGEX.method.exec(content)) !== null) {
    methods.push(methodMatch[1]);
  }

  return { package: pkg, className, methods };
}

export async function analyzeProject(projectPath, runId = "analysis") {
  const stats = await fs.promises.stat(projectPath);

  if (stats.isFile()) {
    const ext = path.extname(projectPath);
    if (ext === ".zip") {
      const unzipDir = getUploadsUnzippedDir(runId);
      await fs.promises.mkdir(unzipDir, { recursive: true });
      const zip = new AdmZip(projectPath);
      zip.extractAllTo(unzipDir, true);
      return analyzeProject(unzipDir, runId);
    }

    if (ext === ".java") {
      const content = await fs.promises.readFile(projectPath, "utf-8");
      const parsed = parseJavaFile(content);
      const summary = { files: 1, packages: 1, classes: 1 };
      return {
        projectPath,
        classes: [{ file: projectPath, ...parsed }],
        summary,
      };
    }

    throw new Error("Formato no soportado. Use carpeta, .zip o .java");
  }

  if (!stats.isDirectory()) {
    throw new Error("La ruta debe apuntar a un directorio de proyecto Java");
  }

  const javaFiles = await collectJavaFiles(projectPath);
  if (javaFiles.length === 0) {
    throw new Error("No se encontraron archivos .java");
  }

  const classes = [];
  for (const file of javaFiles) {
    const content = await fs.promises.readFile(file, "utf-8");
    const parsed = parseJavaFile(content);
    classes.push({
      file,
      ...parsed,
    });
  }

  const summary = {
    files: javaFiles.length,
    packages: new Set(classes.map((c) => c.package)).size,
    classes: classes.length,
  };

  return {
    projectPath,
    classes,
    summary,
  };
}
