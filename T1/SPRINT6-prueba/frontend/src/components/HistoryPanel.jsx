function HistoryItem({ item, apiUrl }) {
  const statusColor =
    item.status === "success"
      ? "text-emerald-400"
      : item.status === "error"
      ? "text-amber-400"
      : "text-slate-400";

  return (
    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{item.id}</p>
        <span className={`text-xs ${statusColor}`}>{item.status}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        {new Date(item.createdAt).toLocaleString()}
      </p>
      {item.markdownPath && (
        <div className="flex gap-2 text-xs mt-2">
          <a
            className="text-primary hover:underline"
            href={`${apiUrl}/api/docs/${item.id}?format=md`}
          >
            MD
          </a>
          <a
            className="text-primary hover:underline"
            href={`${apiUrl}/api/docs/${item.id}?format=pdf`}
          >
            PDF
          </a>
        </div>
      )}
      {item.error && <p className="text-xs text-amber-300 mt-1">{item.error}</p>}
    </div>
  );
}

function HistoryPanel({ history, apiUrl }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Historial</h3>
      <p className="text-xs text-slate-400">
        useEffect recarga el historial al iniciar y tras nuevas ejecuciones.
      </p>
      <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
        {history.length === 0 && (
          <p className="text-sm text-slate-400">Sin ejecuciones previas.</p>
        )}
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} apiUrl={apiUrl} />
        ))}
      </div>
    </div>
  );
}

export default HistoryPanel;
