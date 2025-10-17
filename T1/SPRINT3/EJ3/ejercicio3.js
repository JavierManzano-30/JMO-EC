/**
 * guild.js
 * Implementa CRUD en interfaz + modal.
 *
 * IMPORTANTE: Ajusta API_BASE_URL y endpoints si tienes el YML con las rutas.
 *
 * Funcionamiento:
 * - Intenta usar la API real (endpoints configurables).
 * - Si la petición falla (no existe backend o CORS), cae en modo localStorage para pruebas.
 *
 * Punto importante: user_id debe ser único (comprobado localmente antes de crear/editar).
 */

/* ========== CONFIG - poner aquí las URLs que te proporcione el YML ========= */
// Si tienes endpoints específicos, sustituye estas rutas.
// Por ejemplo:
// API_BASE_URL = "https://mi-backend.com/api/v1";
// membersEndpointGet = `${API_BASE_URL}/guilds/{guildId}/members` (etc)
const API_BASE_URL = ""; // <-- Pon la URL base si la tienes. Si queda vacío usa solo localStorage.
const membersEndpointGet = API_BASE_URL ? `${API_BASE_URL}/members` : "";
const membersEndpointCreate = API_BASE_URL ? `${API_BASE_URL}/members` : "";
const membersEndpointUpdate = (id) => API_BASE_URL ? `${API_BASE_URL}/members/${encodeURIComponent(id)}` : "";
const membersEndpointDelete = (id) => API_BASE_URL ? `${API_BASE_URL}/members/${encodeURIComponent(id)}` : "";

/* ========== Utilidades ========== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const localKey = "guild_members_demo_v1";

function showMessage(msg, timeout = 3500) {
  const el = $("#message");
  el.textContent = msg;
  clearTimeout(el._t);
  if (timeout) el._t = setTimeout(() => el.textContent = "", timeout);
}

/* ========== Datos iniciales (solo para demo) ========== */
const sampleData = [
  { user_id: "u1001", username: "Arthas", level: 80, ilvl: 540, character_role:"TANK", guild_role:"LIDER",
    main_archetype:"FIGHTER", secondary_archetype:"TANK", grandmaster_profession_one:"METALWORKING", grandmaster_profession_two:"WEAPONSMITHING",
    email:"arthas@realm.example", notify_email:true },
  { user_id: "u1002", username: "Lyra", level: 78, ilvl: 500, character_role:"HEALER", guild_role:"GERENTE",
    main_archetype:"CLERIC", secondary_archetype:"BARD", grandmaster_profession_one:"ALCHEMY", grandmaster_profession_two:"COOKING",
    email:"lyra@realm.example", notify_email:false },
  { user_id: "u1003", username: "Thorn", level: 77, ilvl: 512, character_role:"DAMAGE", guild_role:"MEMBER",
    main_archetype:"ROGUE", secondary_archetype:"RANGER", grandmaster_profession_one:"HUNTING", grandmaster_profession_two:"FISHING",
    email:"thorn@realm.example", notify_email:true }
];

/* ========== API wrapper con fallback a localStorage ========== */
async function apiGetMembers() {
  if (!API_BASE_URL) return Promise.resolve(_getLocalMembers());
  try {
    const r = await fetch(membersEndpointGet);
    if (!r.ok) throw new Error("API error");
    return await r.json();
  } catch (e) {
    console.warn("FALLBACK: get members -> localStorage", e);
    return _getLocalMembers();
  }
}

async function apiCreateMember(member) {
  if (!API_BASE_URL) {
    const created = _createLocalMember(member);
    return Promise.resolve(created);
  }
  try {
    const r = await fetch(membersEndpointCreate, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(member)
    });
    if (!r.ok) throw new Error("API create failed");
    return await r.json();
  } catch (e) {
    console.warn("FALLBACK: create member -> localStorage", e);
    return _createLocalMember(member);
  }
}

async function apiUpdateMember(user_id, member) {
  if (!API_BASE_URL) {
    return Promise.resolve(_updateLocalMember(user_id, member));
  }
  try {
    const r = await fetch(membersEndpointUpdate(user_id), {
      method: "PUT",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(member)
    });
    if (!r.ok) throw new Error("API update failed");
    return await r.json();
  } catch (e) {
    console.warn("FALLBACK: update -> localStorage", e);
    return _updateLocalMember(user_id, member);
  }
}

async function apiDeleteMember(user_id) {
  if (!API_BASE_URL) {
    return Promise.resolve(_deleteLocalMember(user_id));
  }
  try {
    const r = await fetch(membersEndpointDelete(user_id), { method: "DELETE" });
    if (!r.ok) throw new Error("API delete failed");
    return await r.json();
  } catch (e) {
    console.warn("FALLBACK: delete -> localStorage", e);
    return _deleteLocalMember(user_id);
  }
}

/* ===== LocalStorage helpers ===== */
function _getLocalMembers() {
  const raw = localStorage.getItem(localKey);
  if (!raw) {
    localStorage.setItem(localKey, JSON.stringify(sampleData));
    return sampleData.slice();
  }
  return JSON.parse(raw);
}

function _saveLocal(members) {
  localStorage.setItem(localKey, JSON.stringify(members));
}

function _createLocalMember(member) {
  const all = _getLocalMembers();
  all.push(member);
  _saveLocal(all);
  return member;
}

function _updateLocalMember(user_id, member) {
  const all = _getLocalMembers();
  const idx = all.findIndex(m => m.user_id === user_id);
  if (idx === -1) throw new Error("Member not found locally");
  all[idx] = member;
  _saveLocal(all);
  return member;
}

function _deleteLocalMember(user_id) {
  let all = _getLocalMembers();
  const beforeLen = all.length;
  all = all.filter(m => m.user_id !== user_id);
  _saveLocal(all);
  return { deleted: beforeLen - all.length };
}

/* ========== RENDER y lógica UI ========== */
const modalBackdrop = $("#modalBackdrop");
const form = $("#memberForm");
let editingUserId = null; // null => crear; string => editar

async function loadAndRender() {
  const members = await apiGetMembers();
  renderTable(members);
}

function renderTable(members) {
  const tbody = $("#membersBody");
  tbody.innerHTML = "";
  if (!members || members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align:center; padding:18px">No hay miembros.</td></tr>`;
    return;
  }
  members.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(m.user_id)}</td>
      <td>${escapeHtml(m.username)}</td>
      <td>${escapeHtml(m.level)}</td>
      <td>${escapeHtml(m.ilvl)}</td>
      <td>${escapeHtml(m.character_role)}</td>
      <td>${escapeHtml(m.guild_role)}</td>
      <td>${escapeHtml(m.main_archetype)}</td>
      <td>${escapeHtml(m.secondary_archetype)}</td>
      <td>${escapeHtml(m.grandmaster_profession_one)}</td>
      <td>${escapeHtml(m.grandmaster_profession_two)}</td>
      <td>${escapeHtml(m.email)}</td>
      <td>${m.notify_email ? "true" : "false"}</td>
      <td>
        <button class="muted" data-action="edit" data-id="${escapeHtml(m.user_id)}">Edit</button>
        <button class="danger" data-action="delete" data-id="${escapeHtml(m.user_id)}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  // attach listeners
  tbody.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", async (ev) => {
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === "edit") openModalForEdit(id);
      if (action === "delete") handleDelete(id);
    });
  });
}

/* ========== Modal controls ========== */
function openModalForCreate() {
  editingUserId = null;
  $("#modalTitle").textContent = "Add New Member";
  $("#btnSubmit").textContent = "Add Member";
  clearForm();
  showModal();
}

function openModalForEdit(user_id) {
  editingUserId = user_id;
  $("#modalTitle").textContent = `Edit Member: ${user_id}`;
  $("#btnSubmit").textContent = "Save Changes";
  // precargar datos
  const members = _getLocalMembers();
  const member = members.find(m => m.user_id === user_id);
  if (!member) {
    showMessage("Miembro no encontrado para editar", 4000);
    return;
  }
  populateForm(member);
  showModal();
}

function showModal() {
  $("#formError").classList.add("hidden");
  modalBackdrop.classList.remove("hidden");
  // focus primer campo
  setTimeout(() => $("#user_id").focus(), 80);
}

function hideModal() {
  modalBackdrop.classList.add("hidden");
  clearForm();
  editingUserId = null;
}

function clearForm() {
  form.reset();
  $("#user_id").removeAttribute("disabled");
  $("#formError").classList.add("hidden");
}

function populateForm(member) {
  $("#user_id").value = member.user_id;
  $("#user_id").setAttribute("disabled", "true"); // no permitir cambiar user_id al editar
  $("#username").value = member.username;
  $("#level").value = member.level;
  $("#ilvl").value = member.ilvl;
  $("#character_role").value = member.character_role;
  $("#guild_role").value = member.guild_role;
  $("#main_archetype").value = member.main_archetype;
  $("#secondary_archetype").value = member.secondary_archetype;
  $("#grandmaster_profession_one").value = member.grandmaster_profession_one;
  $("#grandmaster_profession_two").value = member.grandmaster_profession_two;
  $("#email").value = member.email;
  $("#notify_email").value = String(member.notify_email);
}

/* ========== Validaciones ========== */
function validateFormValues(values) {
  // todos obligatorios
  const required = ["user_id","username","level","ilvl","character_role","guild_role","main_archetype","secondary_archetype","grandmaster_profession_one","grandmaster_profession_two","email","notify_email"];
  for (const k of required) {
    if (values[k] === undefined || values[k] === null || String(values[k]).trim() === "") {
      return `El campo ${k} es obligatorio.`;
    }
  }
  // email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email)) return "Email con formato inválido.";
  // nivel e ilvl enteros positivos
  if (!Number.isInteger(+values.level) || +values.level < 1) return "Level debe ser un entero >= 1.";
  if (!Number.isInteger(+values.ilvl) || +values.ilvl < 0) return "Item Level debe ser un entero >= 0.";
  // user_id único (si creando o si editando y user_id distinto)
  const members = _getLocalMembers();
  if (!editingUserId) {
    // creando: comprobar existencia
    const exists = members.some(m => m.user_id === values.user_id);
    if (exists) return "user_id ya existe en la guild. Debe ser único.";
  } else {
    // editando: user_id está bloqueado, no hace falta chequear
  }
  return null;
}

/* ========== Eventos del formulario ========== */
form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  $("#formError").classList.add("hidden");
  const vals = {
    user_id: $("#user_id").value.trim(),
    username: $("#username").value.trim(),
    level: parseInt($("#level").value, 10),
    ilvl: parseInt($("#ilvl").value, 10),
    character_role: $("#character_role").value,
    guild_role: $("#guild_role").value,
    main_archetype: $("#main_archetype").value,
    secondary_archetype: $("#secondary_archetype").value,
    grandmaster_profession_one: $("#grandmaster_profession_one").value,
    grandmaster_profession_two: $("#grandmaster_profession_two").value,
    email: $("#email").value.trim(),
    notify_email: $("#notify_email").value === "true"
  };

  const err = validateFormValues(vals);
  if (err) {
    const el = $("#formError");
    el.textContent = err;
    el.classList.remove("hidden");
    return;
  }

  try {
    if (!editingUserId) {
      // create
      await apiCreateMember(vals);
      showMessage("Miembro creado correctamente.");
    } else {
      // update
      await apiUpdateMember(editingUserId, vals);
      showMessage("Miembro actualizado correctamente.");
    }
    hideModal();
    await loadAndRender();
  } catch (e) {
    $("#formError").textContent = `Error al guardar: ${e.message || e}`;
    $("#formError").classList.remove("hidden");
  }
});

/* ========== Delete flow ========== */
async function handleDelete(user_id) {
  const ok = confirm(`¿Seguro que quieres eliminar al miembro con user_id "${user_id}"?`);
  if (!ok) return;
  try {
    await apiDeleteMember(user_id);
    showMessage("Miembro eliminado.");
    await loadAndRender();
  } catch (e) {
    showMessage("Error al eliminar miembro.", 4000);
    console.error(e);
  }
}

/* ========== util escape html ========== */
function escapeHtml(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'", "&#39;");
}

/* ========== Botones globales ========== */
$("#btnAddNew").addEventListener("click", openModalForCreate);
$("#btnCancel").addEventListener("click", hideModal);
$("#btnReload").addEventListener("click", async () => {
  await loadAndRender();
  showMessage("Recargado.");
});

/* cerrar modal con backdrop click (si se hace click fuera del modal) */
modalBackdrop.addEventListener("click", (ev) => {
  if (ev.target === modalBackdrop) {
    // cerrar y descartar cambios (comportamiento pedido)
    hideModal();
  }
});

/* ESC para cerrar */
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && !modalBackdrop.classList.contains("hidden")) hideModal();
});

/* ========== Inicialización ========== */
loadAndRender();
