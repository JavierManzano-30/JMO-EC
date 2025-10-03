const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");
const botonReiniciar = document.getElementById("reiniciar");

let cartas = [];
let cartaSeleccionada1 = null;
let cartaSeleccionada2 = null;
let bloqueo = false;
let parejasEncontradas = 0;

// Cambia estos nombres por tus propias imágenes (en la carpeta /img)
const imagenes = [
  "gato.png", "perro.png", "sol.png", "luna.png",
  "flor.png", "coche.png", "corazon.png", "estrella.png"
];

const reverso = "reverso.png"; // imagen de dorso

function iniciarJuego() {
  tablero.innerHTML = "";
  mensaje.textContent = "";
  parejasEncontradas = 0;
  cartaSeleccionada1 = null;
  cartaSeleccionada2 = null;

  // Duplicar y barajar
  cartas = [...imagenes, ...imagenes];
  cartas.sort(() => 0.5 - Math.random());

  // Crear las cartas en el DOM
  cartas.forEach((imgNombre) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");

    const img = document.createElement("img");
    img.src = "img/" + reverso;
    img.dataset.src = "img/" + imgNombre;
    carta.appendChild(img);

    carta.addEventListener("click", manejarClickCarta);
    tablero.appendChild(carta);
  });
}

function manejarClickCarta(e) {
  const carta = e.currentTarget;
  const img = carta.querySelector("img");

  if (bloqueo || carta.classList.contains("descubierta") || carta === cartaSeleccionada1) {
    return;
  }

  img.src = img.dataset.src; // mostrar imagen real

  if (!cartaSeleccionada1) {
    cartaSeleccionada1 = carta;
  } else {
    cartaSeleccionada2 = carta;
    bloqueo = true;

    const img1 = cartaSeleccionada1.querySelector("img");
    const img2 = cartaSeleccionada2.querySelector("img");

    if (img1.dataset.src === img2.dataset.src) {
      cartaSeleccionada1.classList.add("descubierta");
      cartaSeleccionada2.classList.add("descubierta");
      parejasEncontradas++;
      resetSeleccion();

      if (parejasEncontradas === imagenes.length) {
        mensaje.textContent = "🎉 ¡Has encontrado todas las parejas!";
      }
    } else {
      setTimeout(() => {
        img1.src = "img/" + reverso;
        img2.src = "img/" + reverso;
        resetSeleccion();
      }, 800);
    }
  }
}

function resetSeleccion() {
  cartaSeleccionada1 = null;
  cartaSeleccionada2 = null;
  bloqueo = false;
}

botonReiniciar.addEventListener("click", iniciarJuego);

iniciarJuego();
