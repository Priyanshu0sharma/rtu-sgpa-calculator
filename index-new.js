// Department mapping (CS -> CSE for internal use, etc.)
const deptMap = {
    'CS': 'CSE',
    'IT': 'IT',
    'CE': 'ECE',  // Civil Engineering maps to ECE branch for data
    'EC': 'ECE',
    'EE': 'EE',
    'ME': 'ME',
    'AI': 'AI'
};

// Year to semester range mapping
const yearToSemesters = {
    'First': ['sem-1', 'sem-2'],
    'Second': ['sem-3', 'sem-4'],
    'Third': ['sem-5', 'sem-6'],
    'Fourth': ['sem-7', 'sem-8']
};

function selectDept() {
    // Optional: can add logic if needed
}

function submitHandler() {
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;
    
    // Store in localStorage
    localStorage.setItem('selectedBranch', deptMap[dept]);
    localStorage.setItem('selectedYear', year);
    
    // Redirect to SGPA calculator
    window.location.href = 'sgpa.html';
    
    // Prevent default form submission
    return false;
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form.details');
    if (form) {
        form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitHandler();
            }
        });
    }
});
