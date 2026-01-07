import axios from "axios";

const AI_URL = process.env.AI_URL || process.env.LMSTUDIO_URL;
const AI_MODEL = process.env.AI_MODEL || "local-model";

function fallbackNotes(summary) {
  return [
    "Recomendaciones generadas automaticamente:",
    `- Se detectaron ${summary.classes} clases distribuidas en ${summary.packages} paquetes.`,
    "- Considere extraer interfaces donde se repite logica compartida.",
    "- Revise la visibilidad de metodos publicos para evitar exposicion innecesaria.",
  ].join("\n");
}

export async function enrichWithAI(context) {
  const { summary } = context;

  if (!AI_URL) {
    return fallbackNotes(summary);
  }

  try {
    const prompt = [
      "Genera un breve resumen tecnico y recomendaciones de mejora.",
      `Archivos: ${summary.files}`,
      `Paquetes: ${summary.packages}`,
      `Clases: ${summary.classes}`,
    ].join("\n");

    const { data } = await axios.post(AI_URL, {
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "Eres un asistente tecnico que resume proyectos Java.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    const content = data?.choices?.[0]?.message?.content?.trim();
    return content || fallbackNotes(summary);
  } catch (_error) {
    return fallbackNotes(summary);
  }
}
