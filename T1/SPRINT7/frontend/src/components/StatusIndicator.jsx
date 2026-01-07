const STATUS_COPY = {
  idle: "Listo para generar documentación",
  loading: "Procesando proyecto y generando documentación...",
  success: "Documentación generada",
  error: "Ocurrió un error",
};

function StatusIndicator({ status, error }) {
  const base = "px-3 py-2 rounded-lg border";
  const colors = {
    idle: `${base} border-slate-800 bg-slate-900 text-slate-200`,
    loading: `${base} border-amber-500/40 bg-amber-500/10 text-amber-200 animate-pulse`,
    success: `${base} border-emerald-500/40 bg-emerald-500/10 text-emerald-200`,
    error: `${base} border-rose-500/40 bg-rose-500/10 text-rose-200`,
  };

  return (
    <div className="mt-4">
      <div className={colors[status] || colors.idle}>{STATUS_COPY[status] || STATUS_COPY.idle}</div>
      {status === "error" && error && <p className="text-sm text-rose-200 mt-2">{error}</p>}
    </div>
  );
}

export default StatusIndicator;
