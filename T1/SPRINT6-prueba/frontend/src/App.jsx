import { useEffect, useState } from "react";
import axios from "axios";
import ProjectSelector from "./components/ProjectSelector.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import StatusIndicator from "./components/StatusIndicator.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectPath, setProjectPath] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/history`);
        setHistory(data);
      } catch (err) {
        setError("No se pudo cargar el historial");
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (!result?.runId) return;
    const refreshHistory = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/history`);
        setHistory(data);
      } catch {
        /* ignore refresh errors */
      }
    };
    refreshHistory();
  }, [result?.runId]);

  const handleGenerate = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData();
    if (selectedFile) {
      formData.append("project", selectedFile);
    }
    if (projectPath) {
      formData.append("projectPath", projectPath);
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
      setStatus("success");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al generar documentación";
      setError(msg);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-400">Sprint 6</p>
          <h1 className="text-2xl font-bold">Generador Automático de Documentación</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Backend: {API_URL}</p>
          <p className="text-sm text-slate-500">Puerto Frontend: 8978</p>
        </div>
      </header>

      <main className="px-6 pb-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 glass rounded-2xl p-6">
          <ProjectSelector
            onSubmit={handleGenerate}
            selectedFile={selectedFile}
            onFileChange={setSelectedFile}
            projectPath={projectPath}
            onPathChange={setProjectPath}
            status={status}
          />
          <StatusIndicator status={status} error={error} />
          {status === "success" && result && (
            <ResultPanel result={result} apiUrl={API_URL} />
          )}
        </section>

        <aside className="glass rounded-2xl p-6">
          <HistoryPanel history={history} apiUrl={API_URL} />
        </aside>
      </main>
    </div>
  );
}

export default App;
