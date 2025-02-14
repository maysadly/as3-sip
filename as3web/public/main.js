// State management
let currentPage = 1;
let totalPages = 1;
let currentSort = 'name';
let currentOrder = 'asc';
let searchTimeout = null;

// Charts
let ageChart = null;
let occupationChart = null;

// DOM Elements
const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');
const searchInput = document.getElementById('search');
const sortField = document.getElementById('sortField');
const sortOrder = document.getElementById('sortOrder');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

// Initialize charts
function initializeCharts() {
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    const occupationCtx = document.getElementById('occupationChart').getContext('2d');

    ageChart = new Chart(ageCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Users by Age Group',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    occupationChart = new Chart(occupationCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ]
            }]
        }
    });
}

// Fetch and update analytics
async function updateAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();

        // Update age distribution chart
        const ageLabels = data.ageDistribution.map(item => item._id);
        const ageCounts = data.ageDistribution.map(item => item.count);
        ageChart.data.labels = ageLabels;
        ageChart.data.datasets[0].data = ageCounts;
        ageChart.update();

        // Update occupation distribution chart
        const occupationLabels = data.occupationDistribution.map(item => item._id);
        const occupationCounts = data.occupationDistribution.map(item => item.count);
        occupationChart.data.labels = occupationLabels;
        occupationChart.data.datasets[0].data = occupationCounts;
        occupationChart.update();
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
}

// Fetch users with pagination and filtering
async function fetchUsers(page = 1, search = '', sortBy = 'name', order = 'asc') {
    const response = await fetch(`/api/users?page=${page}&limit=10&search=${search}&sortBy=${sortBy}&order=${order}`);
    const { users, total } = await response.json();
    renderTable(users);
    updatePagination(total, page);
}

async function fetchAnalytics() {
    const response = await fetch('/api/analytics');
    const { ageStats, occupationStats } = await response.json();
    updateCharts(ageStats, occupationStats);
}

// Display users in table
function displayUsers(users) {
    userTableBody.innerHTML = users.map(user => `
        <tr class="border-t">
            <td class="px-6 py-4">${user.name}</td>
            <td class="px-6 py-4">${user.email}</td>
            <td class="px-6 py-4">${user.age}</td>
            <td class="px-6 py-4">${user.occupation}</td>
            <td class="px-6 py-4">
                <button onclick="editUser('${user._id}')" 
                        class="text-blue-600 hover:text-blue-800 mr-2">
                    Edit
                </button>
                <button onclick="deleteUser('${user._id}')"
                        class="text-red-600 hover:text-red-800">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Edit user
async function editUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        const user = await response.json();
        
        // Populate form
        document.getElementById('userId').value = user._id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('age').value = user.age;
        document.getElementById('occupation').value = user.occupation;
        
        // Scroll to form
        userForm.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching user:', error);
        alert('Error loading user data');
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });
        
        // Refresh user list
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
}

// Form submission handler
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        occupation: document.getElementById('occupation').value
    };
    
    try {
        const url = userId ? `/api/users/${userId}` : '/api/users';
        const method = userId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Error saving user');
        }
        
        // Reset form
        userForm.reset();
        document.getElementById('userId').value = '';
        
        // Refresh user list
        fetchUsers();
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user');
    }
});

// Search handler with debounce
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 1;
        fetchUsers();
    }, 300);
});

// Sort handlers
sortField.addEventListener('change', () => {
    currentSort = sortField.value;
    currentPage = 1;
    fetchUsers();
});

sortOrder.addEventListener('change', () => {
    currentOrder = sortOrder.value;
    currentPage = 1;
    fetchUsers();
});

// Pagination handlers
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchUsers();
    }
});

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    fetchUsers();
    fetchAnalytics();
});