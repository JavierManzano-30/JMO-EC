const btnAgregar = document.getElementById('btnAgregar');

btnAgregar.addEventListener('click', () => {
    console.log("👉 Has hecho clic en el botón");
});

btnAgregar.addEventListener('click', () => {
    const texto = document.getElementById('textoItem').value;
});

btnAgregar.addEventListener('click', () => {
  const texto = document.getElementById('textoItem').value;

  if (texto.trim() !== "") { // Evita añadir vacíos
    const li = document.createElement('li'); // Crear el <li>
    li.textContent = texto; // Ponerle el contenido
    document.getElementById('lista').appendChild(li); // Añadirlo a la lista
  }
});

document.getElementById('textoItem').value = "";
