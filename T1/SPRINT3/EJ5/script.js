// API Service para Party Finder Avanzado (Backend del Profesor)
class AdvancedPartyAPIService {
    constructor() {
        this.baseURL = 'http://localhost:3000'; // Backend del profesor
        this.simulationMode = false; // Usar base de datos real del profesor
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

    async addMemberToParty(partySize, partyId, memberData) {
        try {
            const response = await fetch(`${this.baseURL}/partyfinder/${partySize}/${partyId}/addMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding member to party:', error);
            throw error;
        }
    }

    async removeMemberFromParty(partySize, partyId, memberData) {
        try {
            const response = await fetch(`${this.baseURL}/partyfinder/${partySize}/${partyId}/removeMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error removing member from party:', error);
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
    
    // Método para obtener todas las parties
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
                                
                                // Normalizar la estructura de datos del backend del profesor
                                // Filtrar miembros null/undefined y solo mostrar miembros reales
                                const realMembers = (party.party_members || []).filter(member => 
                                    member && 
                                    member.user_id && 
                                    member.user_id !== 'null' && 
                                    member.user_id !== null &&
                                    member.user_id !== undefined
                                );
                                
                                // Crear party normalizada
                                const normalizedParty = {
                                    ...party,
                                    partySize: partySize,
                                    party_members: realMembers
                                };
                                
                                allParties.push(normalizedParty);
                                console.log(`Found party ${partyId} of size ${partySize} with ${realMembers.length} real members`);
                            } else if (response.status === 404) {
                                // Party no existe, continuar
                                continue;
                            } else {
                                // Otro error, parar para este tamaño
                                break;
                            }
                        } catch (error) {
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
            return [];
        }
    }

    // Método para crear usuario
    async createUser(userData) {
        try {
            const response = await fetch(`${this.baseURL}/guildmembers`, {
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

            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Método para obtener todos los usuarios
    async getAllUsers() {
        try {
            const response = await fetch(`${this.baseURL}/guildmembers`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
}

// Variables globales
let apiService;
let allParties = [];
let allUsers = [];

// Referencias a elementos DOM
let createPartyModal, createUserModal, addMemberModal, partyDetailsModal;
let createPartyForm, createUserForm, addMemberForm;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Party Finder Avanzado iniciado');
    
    // Inicializar servicio API
    apiService = new AdvancedPartyAPIService();
    
    // Obtener referencias a elementos DOM
    initializeDOMElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos iniciales
    loadInitialData();
    
    console.log('✅ Party Finder Avanzado listo');
});

function initializeDOMElements() {
    // Modales
    createPartyModal = document.getElementById('partyModal');
    createUserModal = document.getElementById('userModal');
    addMemberModal = document.getElementById('addMemberModal');
    partyDetailsModal = document.getElementById('partyDetailsModal');
    
    // Formularios
    createPartyForm = document.getElementById('partyForm');
    createUserForm = document.getElementById('userForm');
    addMemberForm = document.getElementById('addMemberForm');
}

function setupEventListeners() {
    // Botones principales
    const createPartyBtn = document.getElementById('createPartyBtn');
    const createUserBtn = document.getElementById('createUserBtn');
    const refreshBtn = document.getElementById('refreshPartiesBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    
    if (createPartyBtn) createPartyBtn.addEventListener('click', () => openModal('partyModal'));
    if (createUserBtn) createUserBtn.addEventListener('click', () => openModal('userModal'));
    if (refreshBtn) refreshBtn.addEventListener('click', loadParties);
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    
    // Formularios
    if (createPartyForm) {
        createPartyForm.addEventListener('submit', handlePartySubmit);
    }
    
    if (createUserForm) {
        createUserForm.addEventListener('submit', handleUserSubmit);
    }
    
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', handleAddMemberSubmit);
    }
    
    // Botones de cerrar modal
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Cerrar modal al hacer clic fuera
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

async function loadInitialData() {
    try {
        await loadParties();
        await loadUsers();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

async function loadParties() {
    try {
        console.log('Loading parties...');
        allParties = await apiService.getAllParties();
        renderParties();
        console.log(`Loaded ${allParties.length} parties`);
    } catch (error) {
        console.error('Error loading parties:', error);
        showError('Error loading parties: ' + error.message);
    }
}

async function loadUsers() {
    try {
        console.log('Loading users...');
        allUsers = await apiService.getAllUsers();
        console.log(`Loaded ${allUsers.length} users`);
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Error loading users: ' + error.message);
    }
}

function renderParties() {
    const partiesContainer = document.getElementById('partiesList');
    if (!partiesContainer) return;
    
    if (allParties.length === 0) {
        partiesContainer.innerHTML = `
            <div class="no-parties">
                <h3>No hay parties activas</h3>
                <p>Crea tu primera party para comenzar</p>
            </div>
        `;
        return;
    }
    
    partiesContainer.innerHTML = allParties.map(party => `
        <div class="party-card">
            <div class="party-header">
                <h3>Party #${party.party_id}</h3>
                <span class="party-size">Tamaño: ${party.partySize}</span>
            </div>
            
            <div class="party-info">
                <p><strong>Creador:</strong> ${party.creator_id}</p>
                <p><strong>Rol del Creador:</strong> ${party.party_role_creator}</p>
                ${party.level_cap ? `<p><strong>Nivel Mínimo:</strong> ${party.level_cap}</p>` : ''}
                ${party.ilvl_cap ? `<p><strong>iLvl Mínimo:</strong> ${party.ilvl_cap}</p>` : ''}
                ${party.planned_start ? `<p><strong>Inicio Planificado:</strong> ${party.planned_start}</p>` : ''}
            </div>
            
            <div class="party-members">
                <h4>Miembros (${party.party_members ? party.party_members.length : 0}/${party.partySize})</h4>
                <div class="members-list">
                    ${party.party_members && party.party_members.length > 0 ? 
                        party.party_members.map(member => `
                            <span class="member-badge ${member.user_id === party.creator_id ? 'creator' : 'member'}">
                                ${member.username || member.user_id} (${member.role})
                            </span>
                        `).join('') : 
                        '<span class="member-badge empty">No hay miembros</span>'
                    }
                </div>
            </div>
            
            <div class="party-actions">
                <button class="btn btn-secondary" onclick="viewPartyDetails(${party.party_id}, ${party.partySize})">
                    Ver Detalles
                </button>
                <button class="btn btn-primary" onclick="openAddMemberModal(${party.party_id}, ${party.partySize})">
                    Añadir Miembro
                </button>
                <button class="btn btn-danger" onclick="deleteParty(${party.party_id}, ${party.partySize}, '${party.creator_id}')">
                    Eliminar Party
                </button>
            </div>
        </div>
    `).join('');
}

// Funciones de modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Limpiar formularios
        if (modalId === 'partyModal' && createPartyForm) {
            createPartyForm.reset();
        } else if (modalId === 'userModal' && createUserForm) {
            createUserForm.reset();
        } else if (modalId === 'addMemberModal' && addMemberForm) {
            addMemberForm.reset();
        } else if (modalId === 'partyDetailsModal') {
            // Limpiar contenido de detalles
            const detailsContent = document.getElementById('partyDetailsContent');
            if (detailsContent) {
                detailsContent.innerHTML = '';
            }
        }
    }
}

function openAddMemberModal(partyId, partySize) {
    console.log('🔓 Abriendo modal de añadir miembro para party:', partyId, 'size:', partySize);
    
    // Guardar datos de la party para el formulario
    document.getElementById('addMemberPartyId').value = partyId;
    document.getElementById('addMemberPartySize').value = partySize;
    
    console.log('✅ Datos de party guardados:', {
        partyId: document.getElementById('addMemberPartyId').value,
        partySize: document.getElementById('addMemberPartySize').value
    });
    
    // Cargar detalles de la party para mostrar roles disponibles
    loadPartyDetailsForAddMember(partyId, partySize);
    
    openModal('addMemberModal');
}

async function loadPartyDetailsForAddMember(partyId, partySize) {
    try {
        const party = await apiService.getPartyDetails(partySize, partyId);
        updateAvailableRoles(party);
    } catch (error) {
        console.error('Error loading party details:', error);
        showError('Error loading party details: ' + error.message);
    }
}

function updateAvailableRoles(party) {
    const availableRolesContainer = document.getElementById('availableRoles');
    if (!availableRolesContainer) return;
    
    const allRoles = ['TANK', 'HEALER', 'DAMAGE', 'SUPPORT'];
    const occupiedRoles = party.party_members.map(member => member.role);
    
    availableRolesContainer.innerHTML = allRoles.map(role => {
        const isOccupied = occupiedRoles.includes(role);
        const isAvailable = !isOccupied && party.party_members.length < party.partySize;
        
        return `
            <span class="role-badge ${isOccupied ? 'occupied' : isAvailable ? 'available' : 'unavailable'}">
                ${role} ${isOccupied ? '(Ocupado)' : isAvailable ? '(Disponible)' : '(No disponible)'}
            </span>
        `;
    }).join('');
}

// Funciones de formulario
async function handlePartySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(createPartyForm);
    const data = {
        partySize: formData.get('partySize'),
        creatorId: formData.get('creatorId'),
        levelCap: formData.get('levelCap'),
        ilvlCap: formData.get('ilvlCap'),
        partyRole: formData.get('partyRole'),
        plannedStart: formData.get('plannedStart'),
        forumThreadId: formData.get('forumThreadId')
    };
    
    // Validación básica
    if (!data.partySize || !data.creatorId || !data.partyRole) {
        showError('Por favor completa todos los campos obligatorios');
        return;
    }
    
    try {
        const partyData = {
            creator_id: data.creatorId.trim(),
            level_cap: data.levelCap ? parseInt(data.levelCap) : null,
            ilvl_cap: data.ilvlCap ? parseInt(data.ilvlCap) : null,
            party_role_creator: data.partyRole,
            planned_start: data.plannedStart.trim(),
            forum_thread_id: data.forumThreadId ? data.forumThreadId.trim() : null
        };
        
        const result = await apiService.createParty(data.partySize, partyData);
        
        console.log('Party created successfully:', result);
        alert(`Party creada exitosamente!\nParty ID: ${result.party_id}\nCreador: ${partyData.creator_id}\nRol: ${partyData.party_role_creator}`);
        
        closeModal('partyModal');
        await loadParties();
        
    } catch (error) {
        console.error('Error creating party:', error);
        showError('Error creating party: ' + error.message);
    }
}

async function handleUserSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(createUserForm);
    const data = {
        userId: formData.get('userId'),
        username: formData.get('username'),
        level: formData.get('level'),
        ilvl: formData.get('ilvl'),
        role: formData.get('role'),
        email: formData.get('email')
    };
    
    // Validación básica
    if (!data.userId || !data.username || !data.level || !data.role) {
        showError('Por favor completa todos los campos obligatorios');
        return;
    }
    
    try {
        const userData = {
            user_id: data.userId.trim(),
            username: data.username.trim(),
            level: parseInt(data.level),
            ilvl: data.ilvl ? parseInt(data.ilvl) : null,
            role: data.role,
            email: data.email ? data.email.trim() : null
        };
        
        const result = await apiService.createUser(userData);
        
        console.log('User created successfully:', result);
        alert(`Usuario creado exitosamente!\nUser ID: ${result.user_id || userData.user_id}\nUsername: ${userData.username}`);
        
        closeModal('userModal');
        await loadUsers();
        
    } catch (error) {
        console.error('Error creating user:', error);
        showError('Error creating user: ' + error.message);
    }
}

async function handleAddMemberSubmit(e) {
    e.preventDefault();
    console.log('📝 Enviando formulario de añadir miembro...');
    
    const formData = new FormData(addMemberForm);
    const data = {
        userId: formData.get('memberUserId'),
        role: formData.get('memberRole')
    };
    
    console.log('📋 Datos del formulario:', data);
    
    const partyId = parseInt(document.getElementById('addMemberPartyId').value);
    const partySize = parseInt(document.getElementById('addMemberPartySize').value);
    
    console.log('🎯 Datos de la party:', { partyId, partySize });
    
    // Validación básica
    if (!data.userId || !data.role) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    try {
        const memberData = {
            user_id: data.userId.trim(),
            role: data.role
        };
        
        const result = await apiService.addMemberToParty(partySize, partyId, memberData);
        
        console.log('Member added successfully:', result);
        alert('Miembro añadido a la party exitosamente!');
        
        closeModal('addMemberModal');
        await loadParties();
        
    } catch (error) {
        console.error('Error adding member:', error);
        showError('Error adding member: ' + error.message);
    }
}

// Funciones de acción
async function viewPartyDetails(partyId, partySize) {
    try {
        const party = await apiService.getPartyDetails(partySize, partyId);
        
        // Mostrar detalles en el modal
        const detailsContainer = document.getElementById('partyDetailsContent');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <h3>Party #${party.party_id}</h3>
                <div class="party-details">
                    <p><strong>Tamaño:</strong> ${party.partySize}</p>
                    <p><strong>Creador:</strong> ${party.creator_id}</p>
                    <p><strong>Rol del Creador:</strong> ${party.party_role_creator}</p>
                    ${party.level_cap ? `<p><strong>Nivel Mínimo:</strong> ${party.level_cap}</p>` : ''}
                    ${party.ilvl_cap ? `<p><strong>iLvl Mínimo:</strong> ${party.ilvl_cap}</p>` : ''}
                    ${party.planned_start ? `<p><strong>Inicio Planificado:</strong> ${party.planned_start}</p>` : ''}
                    ${party.forum_thread_id ? `<p><strong>Thread del Foro:</strong> ${party.forum_thread_id}</p>` : ''}
                    
                    <h4>Miembros (${party.party_members.length}/${party.partySize})</h4>
                    <div class="members-list">
                        ${party.party_members.map(member => `
                            <div class="member-item">
                                <span class="member-name">${member.username || member.user_id}</span>
                                <span class="member-role ${member.user_id === party.creator_id ? 'creator' : 'member'}">${member.role}</span>
                                ${member.user_id !== party.creator_id ? `
                                    <button class="btn btn-sm btn-danger" onclick="removeMemberFromParty(${partyId}, ${partySize}, '${member.user_id}')">
                                        Eliminar
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        openModal('partyDetailsModal');
        
    } catch (error) {
        console.error('Error viewing party details:', error);
        showError('Error viewing party details: ' + error.message);
    }
}

async function removeMemberFromParty(partyId, partySize, userId) {
    if (!confirm(`¿Estás seguro de que quieres eliminar al miembro ${userId} de la party?`)) {
        return;
    }
    
    try {
        const memberData = { user_id: userId };
        const result = await apiService.removeMemberFromParty(partySize, partyId, memberData);
        
        console.log('Member removed successfully:', result);
        alert('Miembro eliminado de la party exitosamente!');
        
        // Recargar detalles de la party
        await viewPartyDetails(partyId, partySize);
        await loadParties();
        
    } catch (error) {
        console.error('Error removing member:', error);
        showError('Error removing member: ' + error.message);
    }
}

async function deleteParty(partyId, partySize, creatorId) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la Party #${partyId}?`)) {
        return;
    }
    
    try {
        const result = await apiService.deleteParty(partySize, partyId, creatorId);
        
        console.log('Party deleted successfully:', result);
        alert('Party eliminada exitosamente!');
        
        await loadParties();
        
    } catch (error) {
        console.error('Error deleting party:', error);
        showError('Error deleting party: ' + error.message);
    }
}

async function clearAllData() {
    if (!confirm('¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        // Eliminar todas las parties
        const deletePromises = [];
        for (const party of allParties) {
            if (party.party_id && party.partySize && party.creator_id) {
                deletePromises.push(
                    apiService.deleteParty(party.partySize, party.party_id, party.creator_id)
                        .catch(error => {
                            console.log(`Error deleting party ${party.party_id}:`, error);
                        })
                );
            }
        }
        
        await Promise.all(deletePromises);
        
        alert('Todos los datos han sido eliminados!');
        
        await loadParties();
        await loadUsers();
        
    } catch (error) {
        console.error('Error clearing data:', error);
        showError('Error clearing data: ' + error.message);
    }
}

// Función de utilidad para mostrar errores
function showError(message) {
    alert('Error: ' + message);
}