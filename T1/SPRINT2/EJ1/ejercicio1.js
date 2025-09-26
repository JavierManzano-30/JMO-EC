let intervalo;

document.getElementById("iniciar").addEventListener("click", function() {
  // Limpiar intervalo previo (por si vuelves a darle a iniciar)
  clearInterval(intervalo);

  let segundos = parseInt(document.getElementById("tiempo").value);
  const contador = document.getElementById("contador");

  if (isNaN(segundos) || segundos <= 0) {
    contador.textContent = "Introduce un número válido de segundos.";
    return;
  }

  contador.textContent = segundos;

  intervalo = setInterval(() => {
    segundos--;
    if (segundos > 0) {
      contador.textContent = segundos;
    } else {
      clearInterval(intervalo);
      contador.textContent = "¡Tiempo finalizado!";
      alert("¡Tiempo finalizado!");
    }
  }, 1000);
});
