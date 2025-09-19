console.log("✅ Script cargado correctamente");
// seleccionamos los elementos del DOM
const inputAncho = document.getElementById('ancho');
const inputAlto = document.getElementById('alto');
const btnCalcular = document.getElementById('btnCalcular');
const resultadoP = document.getElementById('resultado');

function calcularArea() {
    // 1. Leer valores como texto
    const anchoStr = inputAncho.value;
    const altoStr = inputAlto.value;

    // 2. Convertir a número (permitimos decimales)
    const ancho = parseFloat(anchoStr);
    const alto = parseFloat(altoStr);

    // 3. Validar
    if (isNaN(ancho) || isNaN(alto)) {
        resultadoP.textContent = 'Por favor, introduce dos números válidos.';
        return;
    }
    if (ancho < 0 || alto < 0) {
        resultadoP.textContent = 'El ancho y el alto deben ser iguales o mayores que 0.';
        return;
    }

    // 4. Calcular (ancho * alto)
    const area = ancho * alto;

    // 5. Mostrar resultado (formateado)
    const areaStr = Number.isInteger(area) ? area.toString() : area.toFixed(2).replace(/\.?0+$/,'');
    resultadoP.textContent = `Área: ${areaStr} (cm²)`;

}
    btnCalcular.addEventListener('click', calcularArea);