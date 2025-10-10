// === Datos ===
const estudiantes = [
  { nombre: "Juan", ciudad: "Madrid", beca: false, edad: 21, calificaciones: { matematicas: 5, fisica: 7, historia: 6 } },
  { nombre: "Ana", ciudad: "Barcelona", beca: true, edad: 20, calificaciones: { matematicas: 9, fisica: 6, historia: 8 } },
  { nombre: "Pedro", ciudad: "Madrid", beca: false, edad: 23, calificaciones: { matematicas: 4, fisica: 5, historia: 7 } },
  { nombre: "Maria", ciudad: "Sevilla", beca: true, edad: 19, calificaciones: { matematicas: 8, fisica: 7, historia: 9 } },
  { nombre: "Jose", ciudad: "Madrid", beca: false, edad: 22, calificaciones: { matematicas: 6, fisica: 7, historia: 5 } },
  { nombre: "Isabel", ciudad: "Valencia", beca: true, edad: 20, calificaciones: { matematicas: 5, fisica: 8, historia: 7 } },
  { nombre: "David", ciudad: "Bilbao", beca: false, edad: 24, calificaciones: { matematicas: 7, fisica: 6, historia: 8 } },
  { nombre: "Laura", ciudad: "Barcelona", beca: true, edad: 19, calificaciones: { matematicas: 6, fisica: 8, historia: 7 } },
  { nombre: "Miguel", ciudad: "Sevilla", beca: false, edad: 21, calificaciones: { matematicas: 7, fisica: 7, historia: 8 } },
  { nombre: "Sara", ciudad: "Madrid", beca: true, edad: 20, calificaciones: { matematicas: 6, fisica: 5, historia: 9 } },
  { nombre: "Daniela", ciudad: "Valencia", beca: false, edad: 22, calificaciones: { matematicas: 8, fisica: 9, historia: 6 } },
  { nombre: "Alberto", ciudad: "Bilbao", beca: true, edad: 23, calificaciones: { matematicas: 5, fisica: 8, historia: 6 } },
  { nombre: "Gabriel", ciudad: "Sevilla", beca: false, edad: 19, calificaciones: { matematicas: 8, fisica: 5, historia: 7 } },
  { nombre: "Carmen", ciudad: "Barcelona", beca: true, edad: 24, calificaciones: { matematicas: 9, fisica: 9, historia: 9 } },
  { nombre: "Roberto", ciudad: "Madrid", beca: false, edad: 20, calificaciones: { matematicas: 4, fisica: 5, historia: 5 } },
  { nombre: "Carolina", ciudad: "Valencia", beca: true, edad: 22, calificaciones: { matematicas: 5, fisica: 7, historia: 6 } },
  { nombre: "Alejandro", ciudad: "Bilbao", beca: false, edad: 23, calificaciones: { matematicas: 9, fisica: 8, historia: 8 } },
  { nombre: "Lucia", ciudad: "Barcelona", beca: true, edad: 21, calificaciones: { matematicas: 7, fisica: 7, historia: 7 } },
  { nombre: "Ricardo", ciudad: "Sevilla", beca: false, edad: 19, calificaciones: { matematicas: 6, fisica: 5, historia: 6 } },
  { nombre: "Marina", ciudad: "Madrid", beca: true, edad: 20, calificaciones: { matematicas: 5, fisica: 9, historia: 8 } }
];

// === Funciones ===
function estudiantesDestacadosPorAsignatura(estudiantes, asignatura) {
  return estudiantes
    .filter(e => e.calificaciones[asignatura] !== undefined)
    .sort((a, b) => b.calificaciones[asignatura] - a.calificaciones[asignatura])
    .slice(0, 3);
}

function asignaturaMenorRendimiento(estudiantes) {
  const asignaturas = Object.keys(estudiantes[0].calificaciones);
  const promedios = asignaturas.map(asig => {
    const promedio = estudiantes.reduce((acc, e) => acc + e.calificaciones[asig], 0) / estudiantes.length;
    return { asignatura: asig, promedio };
  });
  return promedios.sort((a, b) => a.promedio - b.promedio)[0].asignatura;
}

function mejoraNotasBeca(estudiantes) {
  return estudiantes.map(e => {
    if (e.beca) {
      const nuevasCalificaciones = {};
      for (const [materia, nota] of Object.entries(e.calificaciones)) {
        nuevasCalificaciones[materia] = Math.min(10, +(nota * 1.1).toFixed(1));
      }
      return { ...e, calificaciones: nuevasCalificaciones };
    }
    return e;
  });
}

function filtrarPorCiudadYAsignatura(estudiantes, ciudad, asignatura) {
  return estudiantes
    .filter(e => e.ciudad.toLowerCase() === ciudad.toLowerCase())
    .sort((a, b) => b.calificaciones[asignatura] - a.calificaciones[asignatura]);
}

function estudiantesSinBecaPorCiudad(estudiantes, ciudad) {
  return estudiantes.filter(e => e.ciudad.toLowerCase() === ciudad.toLowerCase() && !e.beca);
}

function promedioEdadEstudiantesConBeca(estudiantes) {
  const conBeca = estudiantes.filter(e => e.beca);
  const total = conBeca.reduce((acc, e) => acc + e.edad, 0);
  return +(total / conBeca.length).toFixed(0);
}

function mejoresEstudiantes(estudiantes) {
  const promedios = estudiantes.map(e => {
    const notas = Object.values(e.calificaciones);
    const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
    return { ...e, promedio };
  });
  return promedios.sort((a, b) => b.promedio - a.promedio).slice(0, 2);
}

function estudiantesAprobados(estudiantes) {
  return estudiantes
    .filter(e => Object.values(e.calificaciones).every(nota => nota >= 5))
    .map(e => e.nombre);
}

// === Mostrar resultados ===
function mostrarResultado(parte) {
  const ciudad = document.getElementById("ciudadInput").value;
  const asignatura = document.getElementById("asignaturaInput").value;
  const infoDiv = document.getElementById("infoCiudad");
  infoDiv.style.display = "none"; // 👈 Ocultamos siempre al inicio

  let resultado;

  switch (parte) {
    case 1:
      resultado = estudiantesDestacadosPorAsignatura(estudiantes, asignatura);
      break;
    case 2:
      resultado = asignaturaMenorRendimiento(estudiantes);
      break;
    case 3:
      resultado = mejoraNotasBeca(estudiantes);
      break;
    case 4:
      resultado = filtrarPorCiudadYAsignatura(estudiantes, ciudad, asignatura);
      break;
    case 5:
      const sinBeca = estudiantesSinBecaPorCiudad(estudiantes, ciudad);
      resultado = sinBeca.length;
      mostrarEstudiantesSinBeca(sinBeca, ciudad);
      break;
    case 6:
      resultado = promedioEdadEstudiantesConBeca(estudiantes);
      break;
    case 7:
      resultado = mejoresEstudiantes(estudiantes);
      break;
    case 8:
      resultado = estudiantesAprobados(estudiantes);
      break;
    default:
      resultado = "Opción no válida";
  }

  document.getElementById("resultado").textContent = JSON.stringify(resultado, null, 2);
}

// === Mostrar estudiantes sin beca solo cuando se pulsa el botón ===
function mostrarEstudiantesSinBeca(lista, ciudad) {
  const infoDiv = document.getElementById("infoCiudad");
  if (lista.length > 0) {
    infoDiv.innerHTML = `
      <h3>Estudiantes sin beca en ${ciudad} (${lista.length}):</h3>
      <ul>${lista.map(e => `<li>${e.nombre} (${e.edad} años)</li>`).join("")}</ul>
    `;
  } else {
    infoDiv.innerHTML = `<h3>No hay estudiantes sin beca en ${ciudad}.</h3>`;
  }
  infoDiv.style.display = "block"; // 👈 Se muestra solo al presionar el botón
}
