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