document.getElementById("calcular").addEventListener("click", function() {
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  const operacion = document.getElementById("operacion").value;
  const resultado = document.getElementById("resultado");

  // Validación de entradas
  if (isNaN(num1) || isNaN(num2)) {
    resultado.textContent = "Por favor introduce ambos números.";
    return;
  }

  let total;

  switch (operacion) {
    case "suma":
      total = num1 + num2;
      break;
    case "resta":
      total = num1 - num2;
      break;
    case "multiplicacion":
      total = num1 * num2;
      break;
    case "division":
      if (num2 === 0) {
        total = "INDEFINIDO";
      } else {
        total = num1 / num2;
      }
      break;
    default:
      total = "Operación no válida";
  }

  resultado.textContent = "Resultado: " + total;
});
