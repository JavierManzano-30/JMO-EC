// Placeholder for LMStudio or any local LLM integration.
export async function enrichWithAI(context) {
  const { summary } = context;
  return [
    "Recomendaciones generadas automáticamente:",
    `- Se detectaron ${summary.classes} clases distribuidas en ${summary.packages} paquetes.`,
    "- Considere extraer interfaces donde se repite lógica compartida.",
    "- Revise la visibilidad de métodos públicos para evitar exposición innecesaria.",
  ].join("\n");
}
