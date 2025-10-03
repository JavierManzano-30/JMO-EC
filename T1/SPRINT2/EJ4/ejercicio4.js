let segundos = 0;
let minutos = 0;
let intervalo;
let corriendo = false; // Para evitar múltiples intervalos

function actualizarTiempo() {
  segundos++;
  if (segundos === 60) {
    segundos = 0;
    minutos++;
  }

  // Formatear con ceros a la izquierda
  const formatoMin = minutos < 10 ? "0" + minutos : minutos;
  const formatoSeg = segundos < 10 ? "0" + segundos : segundos;

  document.getElementById("tiempo").textContent = `${formatoMin}:${formatoSeg}`;
}

document.getElementById("iniciar").addEventListener("click", function() {
  if (!corriendo) {
    intervalo = setInterval(actualizarTiempo, 1000);
    corriendo = true;
  }
});

document.getElementById("pausar").addEventListener("click", function() {
  clearInterval(intervalo);
  corriendo = false;
});

document.getElementById("reiniciar").addEventListener("click", function() {
  clearInterval(intervalo);
  corriendo = false;
  segundos = 0;
  minutos = 0;
  document.getElementById("tiempo").textContent = "00:00";
});
