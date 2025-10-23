// API Service para Party Finder
class PartyAPIService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    async createParty(partySize, partyData) {
        try {
            const response = await fetch(`${this.baseURL}/partyfinder/${partySize}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partyData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating party:', error);
            throw error;
        }
    }

    async getPartyDetails(partySize, partyId) {
        try {
            const response = await fetch(`${this.baseURL}/partyfinder/${partySize}/${partyId}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Party not found' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching party details:', error);
            throw error;
        }
    }

    async deleteParty(partySize, partyId, userId) {
        try {
            const response = await fetch(`${this.baseURL}/partyfinder/${partySize}/${partyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting party:', error);
            throw error;
        }
    }

    async getAllParties() {
        try {
            console.log('Fetching all parties from backend...');
            
            // El backend del profesor no tiene /partyfinder/all
            // Necesitamos hacer múltiples peticiones para obtener todas las parties
            const allParties = [];
            
            // Intentar obtener parties de cada tamaño (3, 5, 8)
            const partySizes = [3, 5, 8];
            
            for (const partySize of partySizes) {
                try {
                    // Intentar obtener parties de este tamaño
                    // Como no hay endpoint para listar todas, vamos a intentar IDs comunes
                    for (let partyId = 1; partyId <= 20; partyId++) {
                        try {
                            const response = await fetch(`${this.baseURL}/partyfinder/${partySize}/${partyId}`);
                            if (response.ok) {
                                const party = await response.json();
                                // Agregar información del tamaño de party para el renderizado
                                party.partySize = partySize;
                                allParties.push(party);
                                console.log(`Found party ${partyId} of size ${partySize}:`, party);
                                console.log(`Party members count: ${party.party_members ? party.party_members.length : 0}`);
                            } else if (response.status === 404) {
                                // Party no existe, continuar con el siguiente
                                continue;
                            } else {
                                // Error diferente, parar la búsqueda para este tamaño
                                break;
                            }
                        } catch (error) {
                            // Error de red, parar la búsqueda para este tamaño
                            console.log(`Network error for party ${partyId} of size ${partySize}`);
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`No parties found for size ${partySize}`);
                }
            }
            
            console.log(`Total parties found: ${allParties.length}`);
            return allParties;
            
        } catch (error) {
            console.error('Error fetching all parties:', error);
            throw error;
        }
    }
}

// Variables globales
let apiService;
let allParties = [];

// Elementos del DOM
let partyModal, partyForm, partiesList;
let userModal, userForm;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Party Finder initialized');
    
    apiService = new PartyAPIService();
    
    // Obtener elementos del DOM
    partyModal = document.getElementById('partyModal');
    partyForm = document.getElementById('partyForm');
    partiesList = document.getElementById('partiesList');
    
    userModal = document.getElementById('userModal');
    userForm = document.getElementById('userForm');
    
    initializeApp();
});

function initializeApp() {
    console.log('Initializing Party Finder app...');
    
    // Cargar parties existentes (simulado por ahora)
    loadParties();
    
    // Configurar event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Botón crear party
    const createPartyBtn = document.getElementById('createPartyBtn');
    if (createPartyBtn) {
        createPartyBtn.addEventListener('click', () => openModal());
    }

    // Botón crear usuario
    const createUserBtn = document.getElementById('createUserBtn');
    if (createUserBtn) {
        createUserBtn.addEventListener('click', () => openUserModal());
    }

    // Botón limpiar parties
    const clearPartiesBtn = document.getElementById('clearPartiesBtn');
    if (clearPartiesBtn) {
        clearPartiesBtn.addEventListener('click', () => clearAllParties());
    }

    // Botones del modal de party
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Botones del modal de usuario
    const closeUserModalBtn = document.getElementById('closeUserModalBtn');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    
    if (closeUserModalBtn) {
        closeUserModalBtn.addEventListener('click', closeUserModal);
    }
    
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', closeUserModal);
    }

    // Formularios
    if (partyForm) {
        partyForm.addEventListener('submit', handleSubmit);
    }
    
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }

    // Cerrar modales al hacer click fuera
    if (partyModal) {
        partyModal.addEventListener('click', (e) => {
            if (e.target === partyModal) {
                closeModal();
            }
        });
    }
    
    if (userModal) {
        userModal.addEventListener('click', (e) => {
            if (e.target === userModal) {
                closeUserModal();
            }
        });
    }

    // Cerrar modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (partyModal.classList.contains('active')) {
                closeModal();
            } else if (userModal.classList.contains('active')) {
                closeUserModal();
            }
        }
    });
}

function openModal() {
    console.log('Opening party creation modal');
    
    if (partyModal) {
        partyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Resetear formulario
        resetForm();
        
        // Focus en el primer campo
        const firstInput = partyForm.querySelector('input, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal() {
    console.log('Closing party creation modal');
    
    if (partyModal) {
        partyModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Resetear formulario
        resetForm();
    }
}

function resetForm() {
    if (partyForm) {
        partyForm.reset();
        
        // Limpiar clases de validación
        const inputs = partyForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Limpiar mensajes de error
        const errorMessages = partyForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
}

function validateForm(data) {
    const errors = [];
    
    // Validar campos obligatorios
    const requiredFields = ['partySize', 'creatorId', 'partyRole', 'plannedStart'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field} is required`);
        }
    });
    
    // Validar formato de fecha
    if (data.plannedStart) {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}_\d{2}:\d{2}$/;
        if (!dateRegex.test(data.plannedStart)) {
            errors.push('Planned Start must be in format DD/MM/YYYY_HH:mm');
        } else {
            // Validar que sea una fecha futura
            const [datePart, timePart] = data.plannedStart.split('_');
            const [day, month, year] = datePart.split('/');
            const [hour, minute] = timePart.split(':');
            
            const plannedDate = new Date(year, month - 1, day, hour, minute);
            const now = new Date();
            
            if (plannedDate <= now) {
                errors.push('Planned Start must be a future date and time');
            }
        }
    }
    
    // Validar números positivos
    if (data.levelCap && (isNaN(data.levelCap) || data.levelCap <= 0)) {
        errors.push('Level Cap must be a positive number');
    }
    
    if (data.ilvlCap && (isNaN(data.ilvlCap) || data.ilvlCap <= 0)) {
        errors.push('Item Level Cap must be a positive number');
    }
    
    // Validar Creator ID (debe ser string no vacío)
    if (data.creatorId && data.creatorId.trim().length === 0) {
        errors.push('Creator ID must be a valid identifier');
    }
    
    return errors;
}

function showFieldError(fieldName, message) {
    const field = partyForm.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remover mensaje de error existente
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(fieldName) {
    const field = partyForm.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    console.log('Submitting party form...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Convertir FormData a objeto
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (key === 'levelCap' || key === 'ilvlCap') {
            data[key] = value ? parseInt(value) : null;
        } else {
            data[key] = value;
        }
    }
    
    console.log('Form data:', data);
    
    // Validar formulario
    const errors = validateForm(data);
    
    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        
        // Mostrar errores
        errors.forEach(error => {
            // Determinar qué campo tiene el error
            if (error.includes('partySize')) {
                showFieldError('partySize', error);
            } else if (error.includes('creatorId')) {
                showFieldError('creatorId', error);
            } else if (error.includes('partyRole')) {
                showFieldError('partyRole', error);
            } else if (error.includes('Planned Start')) {
                showFieldError('plannedStart', error);
            } else if (error.includes('Level Cap')) {
                showFieldError('levelCap', error);
            } else if (error.includes('Item Level Cap')) {
                showFieldError('ilvlCap', error);
            }
        });
        
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
    }
    
    // Limpiar errores de validación
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('error');
        input.classList.add('success');
    });
    
    try {
        // Preparar datos para la API - Solo datos esenciales para crear party con creador
        const partyData = {
            creator_id: data.creatorId.trim(),
            level_cap: data.levelCap ? parseInt(data.levelCap) : null,
            ilvl_cap: data.ilvlCap ? parseInt(data.ilvlCap) : null,
            party_role_creator: data.partyRole,
            planned_start: data.plannedStart.trim(),
            forum_thread_id: data.forumThreadId ? data.forumThreadId.trim() : null
        };
        
        console.log('Creating party with data:', partyData);
        
        // Mostrar loading
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
        }
        
        // Crear party
        const result = await apiService.createParty(data.partySize, partyData);
        
        console.log('Party created successfully:', result);
        console.log('Party data sent:', partyData);
        
        // Mostrar éxito con más información
        alert(`Party created successfully!\nParty ID: ${result.party_id}\nCreator: ${partyData.creator_id}\nRole: ${partyData.party_role_creator}`);
        
        // Cerrar modal y recargar lista desde la base de datos
        closeModal();
        loadParties();
        
    } catch (error) {
        console.error('Error creating party:', error);
        alert('Error creating party: ' + error.message);
    } finally {
        // Restaurar botón
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Party';
        }
    }
}

function loadParties() {
    console.log('Loading parties...');
    
    // Cargar parties existentes de la base de datos
    apiService.getAllParties()
        .then(parties => {
            console.log('Parties loaded from database:', parties.length, 'parties');
            allParties = parties; // Actualizar el array local
            renderParties(allParties);
        })
        .catch(error => {
            console.error('Error loading parties:', error);
            partiesList.innerHTML = '<p class="error">Error loading parties. Please try again.</p>';
        });
}

function renderParties(parties) {
    if (!partiesList) return;
    
    if (parties.length === 0) {
        partiesList.innerHTML = `
            <div class="empty-state">
                <h3>No Active Parties</h3>
                <p>Create your first party to get started!</p>
            </div>
        `;
        return;
    }
    
    partiesList.innerHTML = parties.map(party => `
        <div class="party-card">
            <div class="party-header">
                <span class="party-id">Party #${party.party_id}</span>
                <span class="party-size">${party.partySize || 'Unknown'} Members</span>
            </div>
            
            <div class="party-details">
                <div class="party-detail">
                    <span class="party-detail-label">Creator</span>
                    <span class="party-detail-value">${party.creator_id}</span>
                </div>
                
                <div class="party-detail">
                    <span class="party-detail-label">Creator Role</span>
                    <span class="party-detail-value">${party.party_role_creator}</span>
                </div>
                
                <div class="party-detail">
                    <span class="party-detail-label">Level Cap</span>
                    <span class="party-detail-value">${party.level_cap || 'No limit'}</span>
                </div>
                
                <div class="party-detail">
                    <span class="party-detail-label">Item Level Cap</span>
                    <span class="party-detail-value">${party.ilvl_cap || 'No limit'}</span>
                </div>
                
                <div class="party-detail">
                    <span class="party-detail-label">Planned Start</span>
                    <span class="party-detail-value">${party.planned_start}</span>
                </div>
                
                ${party.forum_thread_id ? `
                    <div class="party-detail">
                        <span class="party-detail-label">Forum Thread</span>
                        <span class="party-detail-value">${party.forum_thread_id}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="party-members">
                <h4>Members (${party.party_members ? party.party_members.length : 0}/${party.partySize || 'Unknown'})</h4>
                <div class="members-list">
                    ${party.party_members && party.party_members.length > 0 ? 
                        party.party_members.map((member, index) => {
                            if (member.user_id && member.user_id !== 'null' && member.user_id !== null) {
                                return `<span class="member-badge creator">${member.username || member.user_id} (${member.role || 'Unknown'})</span>`;
                            } else {
                                return `<span class="member-badge empty">Empty Slot ${index + 1}</span>`;
                            }
                        }).join('') : 
                        '<span class="member-badge empty">No members yet</span>'
                    }
                </div>
                ${party.party_members && party.party_members.length > 0 ? 
                    `<small style="color: #666; margin-top: 0.5rem; display: block;">Debug: Found ${party.party_members.length} members in party ${party.party_id}</small>` : 
                    ''
                }
            </div>
            
            <div class="party-actions">
                <button class="btn btn-secondary" onclick="viewPartyDetails(${party.party_id}, ${party.partySize})">
                    View Details
                </button>
                <button class="btn btn-danger" onclick="deleteParty(${party.party_id}, ${party.partySize}, '${party.creator_id}')">
                    Delete Party
                </button>
            </div>
        </div>
    `).join('');
}

// Funciones de utilidad para validación en tiempo real
function setupRealTimeValidation() {
    const plannedStartInput = document.getElementById('plannedStart');
    if (plannedStartInput) {
        plannedStartInput.addEventListener('blur', validatePlannedStart);
    }
    
    const levelCapInput = document.getElementById('levelCap');
    if (levelCapInput) {
        levelCapInput.addEventListener('blur', validateLevelCap);
    }
    
    const ilvlCapInput = document.getElementById('ilvlCap');
    if (ilvlCapInput) {
        ilvlCapInput.addEventListener('blur', validateIlvlCap);
    }
}

function validatePlannedStart() {
    const input = document.getElementById('plannedStart');
    const value = input.value.trim();
    
    if (!value) return;
    
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}_\d{2}:\d{2}$/;
    if (!dateRegex.test(value)) {
        showFieldError('plannedStart', 'Format must be DD/MM/YYYY_HH:mm');
        return;
    }
    
    const [datePart, timePart] = value.split('_');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');
    
    const plannedDate = new Date(year, month - 1, day, hour, minute);
    const now = new Date();
    
    if (plannedDate <= now) {
        showFieldError('plannedStart', 'Must be a future date and time');
        return;
    }
    
    clearFieldError('plannedStart');
}

function validateLevelCap() {
    const input = document.getElementById('levelCap');
    const value = parseInt(input.value);
    
    if (input.value && (isNaN(value) || value <= 0)) {
        showFieldError('levelCap', 'Must be a positive number');
        return;
    }
    
    clearFieldError('levelCap');
}

function validateIlvlCap() {
    const input = document.getElementById('ilvlCap');
    const value = parseInt(input.value);
    
    if (input.value && (isNaN(value) || value <= 0)) {
        showFieldError('ilvlCap', 'Must be a positive number');
        return;
    }
    
    clearFieldError('ilvlCap');
}

// Funciones para manejar parties
async function clearAllParties() {
    if (!confirm('Are you sure you want to delete ALL parties? This action cannot be undone.')) {
        return;
    }
    
    try {
        console.log('Clearing all parties...');
        
        // Eliminar todas las parties encontradas
        const deletePromises = [];
        
        for (const party of allParties) {
            if (party.party_id && party.partySize && party.creator_id) {
                deletePromises.push(
                    apiService.deleteParty(party.partySize, party.party_id, party.creator_id)
                        .catch(error => {
                            console.log(`Error deleting party ${party.party_id}:`, error);
                            // Continuar con las demás parties aunque una falle
                        })
                );
            }
        }
        
        // Esperar a que se eliminen todas las parties
        await Promise.all(deletePromises);
        
        // Limpiar la lista local
        allParties = [];
        
        alert('All parties have been cleared!');
        
        // Recargar la lista
        loadParties();
        
    } catch (error) {
        console.error('Error clearing parties:', error);
        alert('Error clearing parties: ' + error.message);
    }
}

async function viewPartyDetails(partyId, partySize) {
    try {
        console.log(`Viewing details for party ${partyId} (size ${partySize})`);
        
        const details = await apiService.getPartyDetails(partySize, partyId);
        console.log('Party details:', details);
        
        // Mostrar detalles en un alert por ahora
        // En una implementación real, podrías abrir un modal con más detalles
        alert(`Party Details:\n\n` +
              `ID: ${details.party_id}\n` +
              `Creator: ${details.creator_id}\n` +
              `Level Cap: ${details.level_cap || 'No limit'}\n` +
              `Item Level Cap: ${details.ilvl_cap || 'No limit'}\n` +
              `Planned Start: ${details.planned_start}\n` +
              `Members: ${details.party_members ? details.party_members.length : 0}\n` +
              `Updated: ${details.updated_at}`);
              
    } catch (error) {
        console.error('Error fetching party details:', error);
        alert('Error fetching party details: ' + error.message);
    }
}

async function deleteParty(partyId, partySize, creatorId) {
    if (!confirm(`Are you sure you want to delete Party #${partyId}?`)) {
        return;
    }
    
    try {
        console.log(`Deleting party ${partyId} (size ${partySize}) with creator ${creatorId}`);
        
        await apiService.deleteParty(partySize, partyId, creatorId);
        
        // Remover de la lista local
        allParties = allParties.filter(party => party.party_id !== partyId);
        
        alert('Party deleted successfully!');
        
        // Recargar la lista desde la base de datos
        loadParties();
        
    } catch (error) {
        console.error('Error deleting party:', error);
        alert('Error deleting party: ' + error.message);
    }
}

// Inicializar validación en tiempo real cuando se abre el modal
function openModal() {
    console.log('Opening party creation modal');
    
    if (partyModal) {
        partyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Resetear formulario
        resetForm();
        
        // Configurar validación en tiempo real
        setupRealTimeValidation();
        
        // Focus en el primer campo
        const firstInput = partyForm.querySelector('input, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// ===== FUNCIONES PARA CREAR USUARIOS =====

function openUserModal() {
    console.log('Opening user creation modal');
    
    if (userModal) {
        userModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Resetear formulario
        resetUserForm();
        
        // Focus en el primer campo
        const firstInput = userForm.querySelector('input, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeUserModal() {
    console.log('Closing user creation modal');
    
    if (userModal) {
        userModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Resetear formulario
        resetUserForm();
    }
}

function resetUserForm() {
    if (userForm) {
        userForm.reset();
        
        // Limpiar clases de validación
        const inputs = userForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Limpiar mensajes de error
        const errorMessages = userForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
}

function validateUserForm(data) {
    const errors = [];
    
    const requiredFields = ['userId', 'username', 'level', 'ilvl', 'characterRole', 'guildRole', 'mainArchetype', 'secondaryArchetype', 'professionOne', 'professionTwo', 'email'];
    requiredFields.forEach(field => {
        const value = data[field];
        if (!value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value <= 0)) {
            errors.push(`${field} is required`);
        }
    });
    
    if (data.level && (isNaN(data.level) || data.level <= 0)) {
        errors.push('Level must be a positive number');
    }
    
    if (data.ilvl && (isNaN(data.ilvl) || data.ilvl <= 0)) {
        errors.push('Item Level must be a positive number');
    }
    
    if (data.email && !validateEmail(data.email)) {
        errors.push('Email must be in valid format');
    }
    
    return errors;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function handleUserSubmit(event) {
    event.preventDefault();
    console.log('Submitting user form...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (key === 'level' || key === 'ilvl') {
            data[key] = parseInt(value);
        } else if (key === 'notifyEmail') {
            data[key] = true; // Checkbox checked
        } else {
            data[key] = value;
        }
    }
    
    // Si el checkbox no está marcado, no se incluye en FormData
    if (!formData.has('notifyEmail')) {
        data.notifyEmail = false;
    }
    
    console.log('User form data:', data);
    
    const errors = validateUserForm(data);
    
    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
    }
    
    try {
        const userData = {
            user_id: data.userId,
            username: data.username,
            level: data.level,
            ilvl: data.ilvl,
            character_role: data.characterRole,
            guild_role: data.guildRole,
            main_archetype: data.mainArchetype,
            secondary_archetype: data.secondaryArchetype,
            grandmaster_profession_one: data.professionOne,
            grandmaster_profession_two: data.professionTwo,
            email: data.email,
            notify_email: data.notifyEmail
        };
        
        console.log('Creating user with data:', userData);
        
        const submitBtn = document.getElementById('submitUserBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
        }
        
        // Crear usuario usando la API
        const response = await fetch(`${apiService.baseURL}/guildmembers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        console.log('User created successfully:', result);
        
        alert(`User created successfully! User ID: ${result.user_id}`);
        
        closeUserModal();
        
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    } finally {
        const submitBtn = document.getElementById('submitUserBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create User';
        }
    }
}
