// Global variables
let stream = null;
let capturedPhoto = null;
let reports = [];
let currentUser = null;

// Demo users database (in real app, this would be server-side)
const users = [
    {
        email: 'worker@company.com',
        password: 'password123',
        name: 'John Worker',
        role: 'worker',
        department: 'manufacturing'
    },
    {
        email: 'safety@company.com',
        password: 'password123',
        name: 'Safety Officer Smith',
        role: 'safety_officer',
        department: 'safety'
    }
];

// Authentication functions
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        showAlert('Login successful! Welcome back.', 'success', 'alertContainerMain');
        return true;
    }
    
    showAlert('Invalid email or password. Please try again.', 'error');
    return false;
}


function signup(userData) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
        showAlert('An account with this email already exists.', 'error');
        return false;
    }

    // Validate password confirmation
    if (userData.password !== userData.confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return false;
    }

    // Create new user
    const newUser = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
        department: userData.department
    };

    users.push(newUser);
    currentUser = newUser;
    showAlert('Account created successfully! Welcome to the Safety Reporting System.', 'success', 'alertContainerMain');
    return true;
}

function logout() {
    currentUser = null;
    window.location.href = 'login.html';
}