// Obtenemos referencias
const form = document.getElementById("encuestaForm");
const btnEnviar = document.getElementById("btnEnviar");
const resultadosDiv = document.getElementById("resultados");

// Objeto para almacenar los votos
const votos = {
  Rojo: 0,
  Verde: 0,
  Azul: 0,
  Amarillo: 0
};

// Evento al hacer clic en "Enviar"
btnEnviar.addEventListener("click", () => {
  // Capturamos la opción seleccionada
  const seleccion = form.color.value;

  if (!seleccion) {
    alert("Por favor, selecciona una opción antes de enviar.");
    return;
  }

  // Sumar un voto
  votos[seleccion]++;

  // Actualizar gráfico
  mostrarResultados();
});

// Función para mostrar resultados
function mostrarResultados() {
  resultadosDiv.innerHTML = ""; // Limpiar contenido

  const totalVotos = Object.values(votos).reduce((a, b) => a + b, 0);

  for (let color in votos) {
    const porcentaje = totalVotos > 0 ? (votos[color] / totalVotos) * 100 : 0;

    const container = document.createElement("div");
    container.className = "bar-container";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = porcentaje + "%";
    bar.textContent = `${color}: ${votos[color]}`;

    container.appendChild(bar);
    resultadosDiv.appendChild(container);
  }
}
