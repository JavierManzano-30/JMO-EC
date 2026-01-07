import { useEffect, useState } from "react";

function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  let codeBuffer = [];

  const flushList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const flushCode = () => {
    if (inCode) {
      html.push(
        `<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`
      );
      codeBuffer = [];
      inCode = false;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        flushCode();
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith("#")) {
      flushList();
      const level = Math.min(line.match(/^#+/)[0].length, 3);
      const text = line.replace(/^#+\s*/, "");
      html.push(`<h${level}>${renderInline(text)}</h${level}>`);
      continue;
    }

    if (line.trim().startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${renderInline(line.trim().slice(2))}</li>`);
      continue;
    }

    flushList();
    if (line.trim() === "") {
      html.push("<br />");
    } else {
      html.push(`<p>${renderInline(line)}</p>`);
    }
  }

  flushList();
  flushCode();

  return html.join("\n");
}

function ResultPanel({ result, apiUrl }) {
  const { analysis } = result;
  const stats = analysis?.summary || { files: 0, packages: 0, classes: 0 };
  const [markdown, setMarkdown] = useState("");
  const [markdownStatus, setMarkdownStatus] = useState("idle");

  useEffect(() => {
    const loadMarkdown = async () => {
      if (!result?.runId) return;
      setMarkdownStatus("loading");
      try {
        const response = await fetch(
          `${apiUrl}/api/docs/${result.runId}?format=md`
        );
        if (!response.ok) {
          throw new Error("No se pudo cargar el Markdown");
        }
        const text = await response.text();
        setMarkdown(text);
        setMarkdownStatus("success");
      } catch (_error) {
        setMarkdown("");
        setMarkdownStatus("error");
      }
    };
    loadMarkdown();
  }, [apiUrl, result?.runId]);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resultado</h3>
        <div className="flex gap-2">
          {result.markdownPath && (
            <a
              href={`${apiUrl}/api/docs/${result.runId}?format=md`}
              className="text-sm text-primary hover:underline"
            >
              Descargar Markdown
            </a>
          )}
          {result.pdfPath && (
            <a
              href={`${apiUrl}/api/docs/${result.runId}?format=pdf`}
              className="text-sm text-primary hover:underline"
            >
              Descargar PDF
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Archivos" value={stats.files} />
        <Stat label="Paquetes" value={stats.packages} />
        <Stat label="Clases" value={stats.classes} />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <h4 className="font-semibold mb-2">Clases encontradas</h4>
          <div className="max-h-64 overflow-auto space-y-2 text-sm text-slate-200">
            {analysis?.classes?.map((cls) => (
              <div key={cls.file} className="p-2 rounded-lg bg-slate-800/60">
                <p className="font-semibold">{cls.className}</p>
                <p className="text-xs text-slate-400">Paquete: {cls.package}</p>
                <p className="text-xs text-slate-300">
                  Metodos: {cls.methods.join(", ") || "sin metodos"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <h4 className="font-semibold mb-2">Markdown generado</h4>
          {markdownStatus === "loading" && (
            <p className="text-xs text-slate-400">Cargando Markdown...</p>
          )}
          {markdownStatus === "error" && (
            <p className="text-xs text-amber-300">
              No se pudo mostrar el Markdown. Prueba a descargarlo.
            </p>
          )}
          {markdownStatus === "success" && (
            <div
              className="text-xs text-slate-200 max-h-64 overflow-auto bg-slate-800/60 p-3 rounded-lg space-y-2"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultPanel;
