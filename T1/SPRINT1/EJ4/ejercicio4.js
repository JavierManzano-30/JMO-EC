console.log("✅ Script cargado correctamente");

const cajas = document.querySelectorAll('.caja');
console.log("Número de cajas encontradas:", cajas.length);

cajas.forEach(caja => {
  console.log("Caja encontrada:", caja.textContent);
});

cajas.forEach(caja => {
  caja.addEventListener('mouseover', () => {
    caja.style.backgroundColor = "blue";
    caja.style.color = "white";
  });

  caja.addEventListener('mouseout', () => {
    caja.style.backgroundColor = "";
    caja.style.color = "";
  });
});
