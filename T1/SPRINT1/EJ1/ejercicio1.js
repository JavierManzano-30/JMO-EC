// ejercicio1.js
// Listener principal
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('btnCambiarColor');
  const colorActual = document.getElementById('colorActual');

  // Genera un entero entre 0 y 255
  function aleatorioByte() {
    return Math.floor(Math.random() * 256);
  }

  // Construye un rgb(...) y lo devuelve como string
  function generarColorRGB() {
    const r = aleatorioByte();
    const g = aleatorioByte();
    const b = aleatorioByte();
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Cambia el color de fondo y actualiza el texto
  function cambiarColorFondo() {
    const color = generarColorRGB();
    document.body.style.backgroundColor = color;
    // Opcional: ajustar color del texto para accesibilidad si fondo muy oscuro
    colorActual.textContent = color;
    // Si el fondo es muy oscuro, hacemos el texto más claro (simple comprobación)
    const rgb = color.match(/\d+/g).map(Number);
    const luminancia = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
    if (luminancia < 60) {
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.color = '#111111';
    }
  }

  // Asignamos el evento al botón
  btn.addEventListener('click', cambiarColorFondo);
});
