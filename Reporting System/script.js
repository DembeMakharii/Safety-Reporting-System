// Global variables
let stream = null;
let capturedPhoto = null;
let reports = JSON.parse(localStorage.getItem('safetyReports')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Demo users database (also stored in localStorage)
let users = JSON.parse(localStorage.getItem('users')) || [
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

// Initialize localStorage with demo users if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Authentication functions
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
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
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showAlert('Account created successfully! Welcome to the Safety Reporting System.', 'success', 'alertContainerMain');
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Utility functions
function showAlert(message, type, containerId = 'alertContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(alert);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Camera functionality
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 }, 
                height: { ideal: 720 },
                facingMode: 'environment'
            } 
        });
        
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.style.display = 'block';
        
        document.getElementById('captureControls').style.display = 'block';
        document.getElementById('stopBtn').style.display = 'inline-block';
        
        showAlert('Camera started successfully', 'success', 'alertContainerMain');
    } catch (err) {
        console.error('Error accessing camera:', err);
        showAlert('Error accessing camera. Please ensure camera permissions are granted.', 'error', 'alertContainerMain');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        const video = document.getElementById('video');
        video.srcObject = null;
        video.style.display = 'none';
        document.getElementById('captureControls').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'none';
    }
}

function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('photoPreview');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    capturedPhoto = canvas.toDataURL('image/jpeg');
    preview.innerHTML = `<img src="${capturedPhoto}" alt="Captured photo">`;
    
    showAlert('Photo captured successfully', 'success', 'alertContainerMain');
}

// Report functions
function submitSafetyReport() {
    const form = document.getElementById('safetyReportForm');
    const formData = new FormData(form);
    
    const report = {
        id: Date.now(),
        user: currentUser.email,
        userName: currentUser.name,
        location: formData.get('location'),
        hazardType: formData.get('hazardType'),
        severity: formData.get('severity'),
        description: formData.get('description'),
        safetyOfficer: formData.get('safetyOfficer'),
        photo: capturedPhoto,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    reports.push(report);
    localStorage.setItem('safetyReports', JSON.stringify(reports));
    form.reset();
    capturedPhoto = null;
    document.getElementById('photoPreview').innerHTML = '';
    stopCamera();
    
    showAlert('Safety report submitted successfully!', 'success', 'alertContainerMain');
    displayReports();
}

function displayReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    if (reports.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No reports submitted yet</p>';
        return;
    }

    // Filter reports to show only those by current user unless they're a safety officer
    let filteredReports = reports;
    if (currentUser && currentUser.role !== 'safety_officer') {
        filteredReports = reports.filter(r => r.user === currentUser.email);
    }
    
    container.innerHTML = filteredReports.map(report => `
        <div class="report-item">
            <div class="report-header">
                <h4>${report.hazardType.replace('-', ' ').toUpperCase()}</h4>
                <span class="severity-badge badge-${report.severity}">${report.severity.toUpperCase()}</span>
            </div>
            <p><strong>Location:</strong> ${report.location}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Reported by:</strong> ${report.userName}</p>
            <p><strong>Date:</strong> ${new Date(report.date).toLocaleString()}</p>
            ${report.photo ? `<div class="photo-preview"><img src="${report.photo}" alt="Report photo"></div>` : ''}
        </div>
    `).join('');
}

// Initialize reports display if on the right page
if (document.getElementById('reportsContainer')) {
    displayReports();
}