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