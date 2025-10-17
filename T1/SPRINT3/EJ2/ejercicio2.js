// ==========================
// PARTE 1: Información Básica
// ==========================
async function obtenerInfoBasicaPokemon(nombrePokemon) {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado");

        const data = await respuesta.json();
        const tipos = data.types.map(t => t.type.name);
        const pokemonInfo = {
            nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            id: data.id,
            tipos: tipos,
            imagen: data.sprites.other["official-artwork"].front_default
        };
        return pokemonInfo;
    } catch (error) {
        throw new Error("Pokémon no encontrado");
    }
}

// ==========================
// PARTE 2: Comparativa de Pokémon
// ==========================
async function compararPokemon(pokemon1, pokemon2) {
    try {
        const [p1, p2] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1.toLowerCase()}`).then(r => r.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2.toLowerCase()}`).then(r => r.json())
        ]);

        const stats1 = p1.stats.map(s => s.base_stat);
        const stats2 = p2.stats.map(s => s.base_stat);
        const nombresStats = p1.stats.map(s => s.stat.name);

        const total1 = stats1.reduce((a, b) => a + b, 0);
        const total2 = stats2.reduce((a, b) => a + b, 0);
        const ganador = total1 > total2 ? p1.name : total2 > total1 ? p2.name : "Empate";

        let tabla = `<table><tr><th>Estadística</th><th>${p1.name}</th><th>${p2.name}</th></tr>`;
        nombresStats.forEach((stat, i) => {
            tabla += `<tr><td>${stat}</td><td>${stats1[i]}</td><td>${stats2[i]}</td></tr>`;
        });
        tabla += `<tr><th>Total</th><th>${total1}</th><th>${total2}</th></tr>`;
        tabla += `</table><h3>Ganador: ${ganador.toUpperCase()}</h3>`;

        return tabla;
    } catch (error) {
        throw new Error("Error al comparar los Pokémon.");
    }
}

// ==========================
// PARTE 3: Cadena Evolutiva y Habilidades (corregido)
// ==========================
async function obtenerCadenaEvolutiva(nombrePokemon) {
    try {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
        if (!resp.ok) throw new Error("Pokémon no encontrado");

        const data = await resp.json();

        // Obtenemos información de species para hallar la cadena evolutiva
        const speciesResp = await fetch(data.species.url);
        const speciesData = await speciesResp.json();

        // Si no existe la propiedad evolution_chain → no tiene evoluciones
        if (!speciesData.evolution_chain) {
            return `<p>El Pokémon <strong>${nombrePokemon.toUpperCase()}</strong> no tiene cadena evolutiva.</p>`;
        }

        // Obtenemos la cadena completa
        const evoResp = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoResp.json();

        // Recorremos la cadena evolutiva
        const evoluciones = [];
        let actual = evoData.chain;

        while (actual) {
            evoluciones.push(actual.species.name);
            actual = actual.evolves_to[0];
        }

        // Si solo tiene una forma, también consideramos que no tiene evolución
        if (evoluciones.length === 1) {
            return `<p>El Pokémon <strong>${nombrePokemon.toUpperCase()}</strong> no tiene cadena evolutiva.</p>`;
        }

        // Obtenemos habilidades de cada Pokémon en la cadena
        const detalles = [];
        for (const nombre of evoluciones) {
            const pResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
            const pData = await pResp.json();
            detalles.push({
                nombre: pData.name,
                habilidades: pData.abilities.map(a => a.ability.name)
            });
        }

        // Construimos HTML de salida
        let html = `<h3>Cadena evolutiva de ${nombrePokemon.toUpperCase()}</h3>`;
        detalles.forEach(p => {
            html += `<p><strong>${p.nombre.toUpperCase()}</strong> — Habilidades: ${p.habilidades.join(", ")}</p>`;
        });

        return html;

    } catch (error) {
        return `<p>Error: Pokémon no encontrado o sin cadena evolutiva.</p>`;
    }
}


// ==========================
// FUNCIONES PARA BOTONES
// ==========================
async function probarInfoBasica() {
    const nombre = document.getElementById("nombrePokemon").value;
    const div = document.getElementById("resultado");
    div.innerHTML = "Cargando...";

    try {
        const res = await obtenerInfoBasicaPokemon(nombre);
        div.innerHTML = `
      <h3>${res.nombre} (ID: ${res.id})</h3>
      <p>Tipos: ${res.tipos.join(", ")}</p>
      <img src="${res.imagen}" alt="${res.nombre}" />
    `;
    } catch (err) {
        div.textContent = err.message;
    }
}

async function probarComparacion() {
    const p1 = document.getElementById("pokemon1").value;
    const p2 = document.getElementById("pokemon2").value;
    const div = document.getElementById("resultado");
    div.innerHTML = "Cargando...";

    try {
        const tabla = await compararPokemon(p1, p2);
        div.innerHTML = tabla;
    } catch (err) {
        div.textContent = err.message;
    }
}

async function probarEvoluciones() {
    const nombre = document.getElementById("pokemonEvo").value;
    const div = document.getElementById("resultado");
    div.innerHTML = "Cargando...";

    const resultado = await obtenerCadenaEvolutiva(nombre);
    div.innerHTML = resultado;
}
