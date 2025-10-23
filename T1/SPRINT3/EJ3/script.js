// API Configuration
const API_BASE_URL = 'http://localhost:3000';

const API_ENDPOINTS = {
    getAllMembers: `${API_BASE_URL}/guildmembers`,
    getMemberById: (userId) => `${API_BASE_URL}/guildmembers/${userId}`,
    createMember: `${API_BASE_URL}/guildmembers`,
    updateMember: (userId) => `${API_BASE_URL}/guildmembers/${userId}`,
    deleteMember: (userId) => `${API_BASE_URL}/guildmembers/${userId}`
};

// API Service
class GuildAPIService {
    async request(url, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            // Handle endpoints that may return empty body
            const rawText = await response.text();
            const data = rawText ? JSON.parse(rawText) : {};

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getAllMembers() {
        return this.request(API_ENDPOINTS.getAllMembers);
    }

    async createMember(memberData) {
        return this.request(API_ENDPOINTS.createMember, 'POST', memberData);
    }

    async updateMember(userId, updateData) {
        return this.request(API_ENDPOINTS.updateMember(userId), 'PUT', updateData);
    }

    async deleteMember(userId) {
        return this.request(API_ENDPOINTS.deleteMember(userId), 'DELETE');
    }
}

// Global variables
const apiService = new GuildAPIService();
let currentEditingId = null;
let allMembers = [];

// Modal functions
function openModal(editMode = false, memberId = null) {
    const modal = document.getElementById('memberModal');
    const form = document.getElementById('memberForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtnText');
    
    if (editMode && memberId) {
        currentEditingId = memberId;
        modalTitle.textContent = 'Edit Member';
        submitBtn.textContent = 'Update Member';
        loadMemberData(memberId);
    } else {
        currentEditingId = null;
        modalTitle.textContent = 'Add New Member';
        submitBtn.textContent = 'Add Member';
        form.reset();
        // Ensure user_id is enabled for creating a new member
        if (form.elements['user_id']) {
            form.elements['user_id'].disabled = false;
        }
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('memberModal');
    const form = document.getElementById('memberForm');
    modal.classList.remove('active');
    form.reset();
    currentEditingId = null;
    // Reset user_id field to normal state
    if (form && form.elements['user_id']) {
        form.elements['user_id'].readOnly = false;
        form.elements['user_id'].style.backgroundColor = '';
        form.elements['user_id'].style.cursor = '';
    }
}

function loadMemberData(memberId) {
    const member = allMembers.find(m => m.user_id === memberId);
    if (member) {
        const form = document.getElementById('memberForm');
        
        // Reset form first
        form.reset();
        
        // Load all member data
        Object.keys(member).forEach(key => {
            const input = form.elements[key];
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = Boolean(member[key]);
                } else {
                    input.value = member[key] || '';
                }
            }
        });
        
        // Keep user_id field enabled but make it readonly for visual indication
        form.elements['user_id'].readOnly = true;
        form.elements['user_id'].style.backgroundColor = '#374151';
        form.elements['user_id'].style.cursor = 'not-allowed';
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(data) {
    const errors = [];
    
    // Check required fields
    const requiredFields = ['user_id', 'username', 'level', 'ilvl', 'character_role', 'guild_role', 'main_archetype', 'secondary_archetype', 'grandmaster_profession_one', 'grandmaster_profession_two', 'email'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].toString().trim() === '') {
            errors.push(`${field.replace('_', ' ')} is required`);
        }
    });
    
    // Validate email format
    if (data.email && !validateEmail(data.email)) {
        errors.push('Invalid email format');
    }
    
    // Validate numbers
    if (data.level && (isNaN(data.level) || data.level < 1)) {
        errors.push('Level must be a positive number');
    }
    
    if (data.ilvl && (isNaN(data.ilvl) || data.ilvl < 1)) {
        errors.push('Item Level must be a positive number');
    }
    
    return errors;
}

// CRUD Operations
async function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('memberForm');
    
    // Handle disabled fields manually since FormData ignores them
    const data = {};
    const formElements = form.elements;
    
    for (let element of formElements) {
        if (element.name) {
            if (element.type === 'checkbox') {
                data[element.name] = element.checked;
            } else if (element.type === 'number') {
                data[element.name] = parseInt(element.value) || 0;
            } else {
                data[element.name] = element.value;
            }
        }
    }
    
    // Trim string fields
    ['user_id','username','email'].forEach(k=>{ if (typeof data[k] === 'string') data[k] = data[k].trim(); });

    console.log('Processed data before validation:', data);

    // Validate form
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
        alert('Validation errors:\n' + validationErrors.join('\n'));
        return;
    }

    try {
        if (currentEditingId) {
            await apiService.updateMember(currentEditingId, data);
            alert('Member updated successfully!');
        } else {
            // Refresh list before validating uniqueness
            try { 
                allMembers = await apiService.getAllMembers(); 
            } catch (err) {
                console.log('Error fetching members for validation:', err);
            }
            if (allMembers.some(m => String(m.user_id) === String(data.user_id))) {
                alert('Error: User ID already exists!');
                return;
            }
            await apiService.createMember(data);
            alert('Member created successfully!');
        }
        closeModal();
        await loadMembers();
    } catch (error) {
        alert('Error: ' + (error?.message || 'No se pudo completar la operación'));
    }
}

function editMember(userId) {
    openModal(true, userId);
}

async function deleteMember(userId) {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            await apiService.deleteMember(userId);
            alert('Member deleted successfully!');
            await loadMembers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function loadMembers() {
    try {
        console.log('Loading members from database...');
        allMembers = await apiService.getAllMembers();
        console.log('Members loaded:', allMembers.length, 'members');
        renderTable(allMembers);
    } catch (error) {
        console.error('Error loading members:', error);
        
        // Check if it's a database schema error
        if (error.message && error.message.includes('created_at')) {
            console.error('Database schema issue: missing created_at column');
            renderTable([]);
            showDatabaseError();
        } else {
            // Show empty state if API is not available
            renderTable([]);
        }
    }
}

function showDatabaseError() {
    const tbody = document.getElementById('membersTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="13" class="error-state">
                <div>
                    <h3>⚠️ Database Schema Issue</h3>
                    <p>The backend expects a 'created_at' column in the guildmembers table.</p>
                    <p>Please check your database structure or contact the administrator.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Retry</button>
                </div>
            </td>
        </tr>
    `;
}

function renderTable(members) {
    const tbody = document.getElementById('membersTable');
    
    if (members.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="13" class="empty-state">
                    <div>No members found</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.user_id}</td>
            <td>${member.username}</td>
            <td>${member.level}</td>
            <td>${member.ilvl}</td>
            <td><span class="badge badge-${member.character_role.toLowerCase()}">${member.character_role}</span></td>
            <td>${member.guild_role}</td>
            <td>${member.main_archetype || '-'}</td>
            <td>${member.secondary_archetype || '-'}</td>
            <td>${member.grandmaster_profession_one || '-'}</td>
            <td>${member.grandmaster_profession_two || '-'}</td>
            <td>${member.email !== undefined ? member.email : '-'}</td>
            <td><span class="${member.notify_email ? 'notification-enabled' : 'notification-disabled'}">${member.notify_email ? '✓' : '✗'}</span></td>
            <td class="actions">
                <button class="btn btn-edit edit-btn" data-user-id="${member.user_id}">Edit</button>
                <button class="btn btn-danger delete-btn" data-user-id="${member.user_id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    tbody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-user-id');
            editMember(userId);
        });
    });
    
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-user-id');
            deleteMember(userId);
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allMembers.filter(member => 
                member.username.toLowerCase().includes(searchTerm) ||
                member.user_id.includes(searchTerm)
            );
            renderTable(filtered);
        });
    }
}

// Initialize application
function initializeApp() {
    // Load members on page load
    loadMembers();

    // Setup search functionality
    setupSearch();

    // Event listeners
    const addBtn = document.getElementById('addMemberBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const modal = document.getElementById('memberModal');

    if (addBtn) {
        addBtn.addEventListener('click', () => openModal(false, null));
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmit);
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'memberModal') {
                closeModal();
            }
        });
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
