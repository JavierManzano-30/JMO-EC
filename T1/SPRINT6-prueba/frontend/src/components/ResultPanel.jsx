function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ResultPanel({ result, apiUrl }) {
  const { analysis } = result;
  const stats = analysis?.summary || { files: 0, packages: 0, classes: 0 };

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
                  Métodos: {cls.methods.join(", ") || "sin métodos"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <h4 className="font-semibold mb-2">Markdown generado (preview)</h4>
          <pre className="text-xs whitespace-pre-wrap text-slate-200 max-h-64 overflow-auto bg-slate-800/60 p-3 rounded-lg">
            {`Clases: ${stats.classes}\nArchivos: ${stats.files}\nPaquetes: ${stats.packages}\n\nConsulta los enlaces para la versión completa.`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ResultPanel;
