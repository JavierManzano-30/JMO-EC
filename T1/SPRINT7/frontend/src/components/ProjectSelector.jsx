function ProjectSelector({
  onSubmit,
  selectedFile,
  onFileChange,
  projectPath,
  onPathChange,
  status,
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-slate-400">
            Selecciona un proyecto Java o indica la ruta local
          </p>
          <h2 className="text-xl font-semibold">Entrada</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
          Estados gestionados con useState + useEffect
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-slate-300">Subir ZIP o carpeta</span>
          <input
            type="file"
            accept=".zip,.java"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          />
          {selectedFile && (
            <p className="mt-1 text-xs text-slate-400 truncate">
              Archivo: {selectedFile.name}
            </p>
          )}
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">Ruta local del proyecto</span>
          <input
            type="text"
            value={projectPath}
            onChange={(e) => onPathChange(e.target.value)}
            placeholder="Ej: /proyectos/tienda-java"
            className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          onClick={() => {}}
          className="bg-primary hover:bg-sky-500 transition text-slate-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Generando..." : "Generar documentación"}
        </button>
        <p className="text-sm text-slate-400">
          onClick/onChange/onSubmit presentes para el control del formulario.
        </p>
      </div>
    </form>
  );
}

export default ProjectSelector;
