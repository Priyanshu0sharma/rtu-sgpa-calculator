// ==================== SGPA Calculator Script ====================

// RTU Grade Points Mapping (from rtu-sgpa-calculator.vercel.app)
const GRADE_POINTS = {
    'A++': 10,
    'A+': 9,
    'A': 8.5,
    'B+': 8,
    'B': 7.5,
    'C+': 7,
    'C': 6.5,
    'D+': 6,
    'D': 5.5,
    'E+': 5,
    'E': 4,
    'F': 0
};

const GRADES = [
    'A++', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E', 'F'
];

document.addEventListener('DOMContentLoaded', () => {
    const SELECTED_BRANCH = localStorage.getItem('selectedBranch') || 'AI';
    const SELECTED_YEAR = localStorage.getItem('selectedYear') || 'First';
    const $ = id => document.getElementById(id);

    const setupScreen = $('setup-screen');
    const gradesScreen = $('grades-screen');
    const resultScreen = $('result-screen');

    const submitSubjectsBtn = $('submit-subjects');
    const addSubjectBtn = $('add-subject');
    const semesterSelect = $('semester-select');
    const subjectsContainer = $('subjects-container');
    const calculateSgpaBtn = $('calculate-sgpa');
    const sgpaResultSpan = $('sgpa-result');
    const recalculateSgpaBtn = $('recalculate-sgpa');
    const deptDisplay = $('dept-display');
    const yearDisplay = $('year-display');

    // Display selected department and year on page load
    const deptNames = {
        'CSE': 'Computer Science & Engineering (CSE)',
        'AI': 'AI & Data Science (AI & DS)',
        'IT': 'Information Technology (IT)',
        'ECE': 'Electronics & Communication (ECE)',
        'EE': 'Electrical Engineering (EE)',
        'ME': 'Mechanical Engineering (ME)'
    };
    
    if (deptDisplay) {
        deptDisplay.textContent = deptNames[SELECTED_BRANCH] || SELECTED_BRANCH;
    }
    
    if (yearDisplay) {
        yearDisplay.textContent = SELECTED_YEAR;
    }

    let numSubjects = 0; // will be set when user continues (preset or custom start)

    // First year common presets (used for sem-1 and sem-2 for all branches)
    const FIRST_YEAR_SEM1 = [
        { name: 'Engineering Mathematics-I', credits: 4 },
        { name: 'Engineering Chemistry / Physics', credits: 4 },
        { name: 'Human Values / Communication Skills', credits: 2 },
        { name: 'BME / Programming for Problem Solving', credits: 2 },
        { name: 'BCE / BEE', credits: 2 },
        { name: 'Engineering Chemistry / Physics Lab', credits: 1 },
        { name: 'Human Values / Communication Skills Activities', credits: 1 },
        { name: 'Workshop / Computer Programming Lab', credits: 1.5 },
        { name: 'BCE / BEE Lab', credits: 1 },
        { name: 'Computer Aided Engineering Graphics', credits: 1.5 },
        { name: 'Sports1', credits: 0 }
    ];

    const FIRST_YEAR_SEM2 = [
        { name: 'Engineering Mathematics-II', credits: 4 },
        { name: 'Engineering Physics / Chemistry', credits: 4 },
        { name: 'Communication Skills / Human Values', credits: 2 },
        { name: 'Programming for Problem Solving / BME', credits: 2 },
        { name: 'BEE / BCE', credits: 2 },
        { name: 'Engineering Physics / Chemistry Lab', credits: 1 },
        { name: 'Human Values / Communication Skills Activities', credits: 1 },
        { name: 'Computer Programming Lab / Workshop', credits: 1.5 },
        { name: 'Basic Electrical Engineering Lab', credits: 1 },
        { name: 'Computer Aided Machine Drawing', credits: 1.5 },
        { name: 'Sports2', credits: 0 }
    ];

    // Semester presets (RTU 2021-22 Scheme - Branch-wise subjects)
    const SEMESTER_PRESETS = {
        'CSE': {
            'sem-1': FIRST_YEAR_SEM1,
            'sem-2': FIRST_YEAR_SEM2,
            'sem-3': [
                { name: 'Discrete Mathematics', credits: 4 },
                { name: 'Digital Logic Design', credits: 4 },
                { name: 'Database Management Systems', credits: 4 },
                { name: 'Object Oriented Programming', credits: 3 },
                { name: 'Signals and Systems', credits: 3 },
                { name: 'DLD Lab', credits: 1.5 },
                { name: 'DBMS Lab', credits: 1.5 },
                { name: 'OOP Lab', credits: 1.5 }
            ],
            'sem-4': [
                { name: 'Computer Organization', credits: 4 },
                { name: 'Web Technologies', credits: 4 },
                { name: 'Operating Systems', credits: 4 },
                { name: 'Analysis of Algorithms', credits: 3 },
                { name: 'Mathematics-III', credits: 3 },
                { name: 'Web Technologies Lab', credits: 1.5 },
                { name: 'Operating Systems Lab', credits: 1.5 },
                { name: 'Algorithms Lab', credits: 1.5 }
            ],
            'sem-5': [
                { name: 'Compiler Design', credits: 4 },
                { name: 'Computer Networks', credits: 4 },
                { name: 'Software Engineering', credits: 4 },
                { name: 'Database Management Systems-II', credits: 3 },
                { name: 'Compiler Design Lab', credits: 1.5 },
                { name: 'Networks Lab', credits: 1.5 },
                { name: 'Software Engineering Lab', credits: 1.5 }
            ],
            'sem-6': [
                { name: 'Artificial Intelligence', credits: 4 },
                { name: 'Cloud Computing', credits: 4 },
                { name: 'Distributed Systems', credits: 4 },
                { name: 'Information Security', credits: 3 },
                { name: 'AI Lab', credits: 1.5 },
                { name: 'Cloud Computing Lab', credits: 1.5 },
                { name: 'Minor Project', credits: 2 }
            ],
            'sem-7': [
                { name: 'Machine Learning', credits: 4 },
                { name: 'Advanced Web Development', credits: 4 },
                { name: 'Elective I', credits: 3 },
                { name: 'Elective II', credits: 3 },
                { name: 'ML Lab', credits: 1.5 },
                { name: 'Major Project Phase-I', credits: 3 }
            ],
            'sem-8': [
                { name: 'Elective III', credits: 3 },
                { name: 'Elective IV', credits: 3 },
                { name: 'Entrepreneurship', credits: 2 },
                { name: 'Major Project Phase-II', credits: 6 },
                { name: 'Professional Practice', credits: 1 }
            ]
        },
        'AI': {
            'sem-1': FIRST_YEAR_SEM1,
            'sem-2': FIRST_YEAR_SEM2,
            'sem-3': [
                { name: 'Advanced Engineering Mathematics', credits: 3 },
                { name: 'TC', credits: 2 },
                { name: 'Digital Electronics', credits: 3 },
                { name: 'Data Structures and Algorithms', credits: 3 },
                { name: 'Object Oriented Programming', credits: 3 },
                { name: 'Software Engineering', credits: 3 },
                { name: 'Data Structures and Algorithms Lab', credits: 1.5 },
                { name: 'Object Oriented Programming Lab', credits: 1.5 },
                { name: 'Software Engineering Lab', credits: 1.5 },
                { name: 'Digital Electronics Lab', credits: 1.5 },
                { name: 'Industrial Training', credits: 1 },
                { name: 'Social Outreach, Discipline & Extracurricular Activities', credits: 0.5 }
            ],
            'sem-4': [
                { name: 'Discrete Mathematics Structure', credits: 3 },
                { name: 'Managerial Economics & Financial Accounting', credits: 2 },
                { name: 'Microprocessor & Interfaces', credits: 3 },
                { name: 'Database Management System', credits: 3 },
                { name: 'Theory of Computation', credits: 3 },
                { name: 'Data Communication and Computer Networks', credits: 3 },
                { name: 'Microprocessor & Interfaces Lab', credits: 1 },
                { name: 'Database Management System Lab', credits: 1.5 },
                { name: 'Network Programming Lab', credits: 1.5 },
                { name: 'Linux Shell Programming Lab', credits: 1 },
                { name: 'Java Lab', credits: 1 },
                { name: 'Social Outreach, Discipline & Extracurricular Activities', credits: 0.5 }
            ],
            'sem-5': [
                { name: 'Data Mining-Concepts and Techniques', credits: 2 },
                { name: 'Compiler Design', credits: 3 },
                { name: 'Operating System', credits: 3 },
                { name: 'Computer Graphics & Multimedia', credits: 3 },
                { name: 'Analysis of Algorithms', credits: 3 },
                { name: 'Fundamentals of Blockchain', credits: 2 },
                { name: 'Mathematical Modelling for Data Science', credits: 2 },
                { name: 'Programming for Data Science', credits: 2 },
                { name: 'Computer Graphics & Multimedia Lab', credits: 1 },
                { name: 'Compiler Design Lab', credits: 1 },
                { name: 'Analysis of Algorithms Lab', credits: 1 },
                { name: 'Advance Java Lab', credits: 1 },
                { name: 'Industrial Training', credits: 2.5 },
                { name: 'Social Outreach, Discipline & Extracurricular Activities', credits: 0.5 }
            ],
            'sem-6': [
                { name: 'Digital Image Processing', credits: 2 },
                { name: 'Machine Learning', credits: 3 },
                { name: 'Information Security Systems', credits: 2 },
                { name: 'Computer Architecture and Organization', credits: 3 },
                { name: 'Principles of Artificial Intelligence', credits: 2 },
                { name: 'Cloud Computing', credits: 3 },
                { name: 'Artificial Neural Network', credits: 2 },
                { name: 'Natural Language Processing (NLP)', credits: 2 },
                { name: 'Predictive Modeling and Analytics', credits: 3 },
                { name: 'Digital Image Processing Lab', credits: 1.5 },
                { name: 'Machine Learning Lab', credits: 1.5 },
                { name: 'Python Lab', credits: 1.5 },
                { name: 'Mobile App Development Lab', credits: 1.5 },
                { name: 'Social Outreach, Discipline & Extracurricular Activities', credits: 0.5 }
            ],
            'sem-7': [
                { name: 'Environmental Engineering & Disaster Management', credits: 3 },
                { name: 'Internet Of Things', credits: 3 },
                { name: 'Internet Of Things Lab', credits: 2 },
                { name: 'Cyber Security Lab', credits: 2 },
                { name: 'Industrial Training', credits: 2.5 },
                { name: 'Seminar', credits: 2 },
                { name: 'Social Outreach, Discipline & Extracurricular Activities', credits: 0.5 }
            ],
            'sem-8': [
                { name: 'Big Data Analytics', credits: 3 },
                { name: 'Big Data Analytics Lab', credits: 2 },
                { name: 'Software Testing & Validation Lab', credits: 1 },
                { name: 'Project', credits: 7 },
                { name: 'Social Outreach, Discipline & Extracurricular Activities', credits: 0.5 },
                { name: 'Disaster Management', credits: 3 }
            ]
        },
        'IT': {
            'sem-1': FIRST_YEAR_SEM1,
            'sem-2': FIRST_YEAR_SEM2,
            'sem-3': [
                { name: 'Discrete Mathematics', credits: 4 },
                { name: 'Digital Logic Design', credits: 4 },
                { name: 'Database Management Systems', credits: 4 },
                { name: 'Object Oriented Programming', credits: 3 },
                { name: 'Computer Architecture', credits: 3 },
                { name: 'DLD Lab', credits: 1.5 },
                { name: 'DBMS Lab', credits: 1.5 },
                { name: 'OOP Lab', credits: 1.5 }
            ],
            'sem-4': [
                { name: 'Computer Organization', credits: 4 },
                { name: 'Web Technologies', credits: 4 },
                { name: 'Operating Systems', credits: 4 },
                { name: 'Analysis of Algorithms', credits: 3 },
                { name: 'Mathematics-III', credits: 3 },
                { name: 'Web Technologies Lab', credits: 1.5 },
                { name: 'Operating Systems Lab', credits: 1.5 },
                { name: 'Algorithms Lab', credits: 1.5 }
            ],
            'sem-5': [
                { name: 'Computer Networks', credits: 4 },
                { name: 'Software Engineering', credits: 4 },
                { name: 'System Software', credits: 4 },
                { name: 'Mobile Application Development', credits: 3 },
                { name: 'Networks Lab', credits: 1.5 },
                { name: 'SE Lab', credits: 1.5 },
                { name: 'Mobile Dev Lab', credits: 1.5 }
            ],
            'sem-6': [
                { name: 'Web Services & Cloud', credits: 4 },
                { name: 'Information Security', credits: 4 },
                { name: 'Distributed Systems', credits: 4 },
                { name: 'Enterprise Computing', credits: 3 },
                { name: 'Web Services Lab', credits: 1.5 },
                { name: 'Security Lab', credits: 1.5 },
                { name: 'Minor Project', credits: 2 }
            ],
            'sem-7': [
                { name: 'IoT Systems', credits: 4 },
                { name: 'Advanced Web Development', credits: 4 },
                { name: 'Elective I', credits: 3 },
                { name: 'Elective II', credits: 3 },
                { name: 'IoT Lab', credits: 1.5 },
                { name: 'Major Project Phase-I', credits: 3 }
            ],
            'sem-8': [
                { name: 'Elective III', credits: 3 },
                { name: 'Elective IV', credits: 3 },
                { name: 'Entrepreneurship', credits: 2 },
                { name: 'Major Project Phase-II', credits: 6 },
                { name: 'Professional Practice', credits: 1 }
            ]
        },
        'ECE': {
            'sem-1': FIRST_YEAR_SEM1,
            'sem-2': FIRST_YEAR_SEM2,
            'sem-3': [
                { name: 'Electromagnetic Theory', credits: 4 },
                { name: 'Digital Logic Design', credits: 4 },
                { name: 'Analog Electronics', credits: 4 },
                { name: 'Circuit Analysis', credits: 3 },
                { name: 'Signals and Systems', credits: 3 },
                { name: 'DLD Lab', credits: 1.5 },
                { name: 'Analog Electronics Lab', credits: 1.5 },
                { name: 'Circuits Lab', credits: 1.5 }
            ],
            'sem-4': [
                { name: 'Communication Systems', credits: 4 },
                { name: 'Microprocessors', credits: 4 },
                { name: 'Microwave Engineering', credits: 4 },
                { name: 'Digital Signal Processing', credits: 3 },
                { name: 'Communication Lab', credits: 1.5 },
                { name: 'Microprocessor Lab', credits: 1.5 },
                { name: 'DSP Lab', credits: 1.5 }
            ],
            'sem-5': [
                { name: 'Antenna & Wave Propagation', credits: 4 },
                { name: 'VLSI Design', credits: 4 },
                { name: 'Digital Communication', credits: 4 },
                { name: 'Embedded Systems', credits: 3 },
                { name: 'VLSI Lab', credits: 1.5 },
                { name: 'Embedded Systems Lab', credits: 1.5 },
                { name: 'Digital Communication Lab', credits: 1.5 }
            ],
            'sem-6': [
                { name: 'Optical Communication', credits: 4 },
                { name: 'Power Electronics', credits: 4 },
                { name: 'Control Systems', credits: 4 },
                { name: 'RF & Microwave', credits: 3 },
                { name: 'Optical Lab', credits: 1.5 },
                { name: 'Power Electronics Lab', credits: 1.5 },
                { name: 'Minor Project', credits: 2 }
            ],
            'sem-7': [
                { name: 'Wireless Communication', credits: 4 },
                { name: 'Mobile Communication', credits: 4 },
                { name: 'Elective I', credits: 3 },
                { name: 'Elective II', credits: 3 },
                { name: 'Communication Lab', credits: 1.5 },
                { name: 'Major Project Phase-I', credits: 3 }
            ],
            'sem-8': [
                { name: 'Satellite Communication', credits: 3 },
                { name: 'Elective III', credits: 3 },
                { name: 'Entrepreneurship', credits: 2 },
                { name: 'Major Project Phase-II', credits: 6 },
                { name: 'Professional Practice', credits: 1 }
            ]
        },
        'EE': {
            'sem-1': FIRST_YEAR_SEM1,
            'sem-2': FIRST_YEAR_SEM2,
            'sem-3': [
                { name: 'Circuit Theory', credits: 4 },
                { name: 'Electromagnetic Theory', credits: 4 },
                { name: 'Digital Logic Design', credits: 4 },
                { name: 'Electrical Measurements', credits: 3 },
                { name: 'Signals and Systems', credits: 3 },
                { name: 'DLD Lab', credits: 1.5 },
                { name: 'Electrical Measurements Lab', credits: 1.5 },
                { name: 'Circuits Lab', credits: 1.5 }
            ],
            'sem-4': [
                { name: 'Power Generation', credits: 4 },
                { name: 'Electrical Machines-I', credits: 4 },
                { name: 'Power Transmission', credits: 4 },
                { name: 'Power Electronics', credits: 3 },
                { name: 'Machines Lab', credits: 1.5 },
                { name: 'Power Systems Lab', credits: 1.5 },
                { name: 'Power Electronics Lab', credits: 1.5 }
            ],
            'sem-5': [
                { name: 'Control Systems', credits: 4 },
                { name: 'Electrical Machines-II', credits: 4 },
                { name: 'Power Distribution', credits: 4 },
                { name: 'Switchgear & Protection', credits: 3 },
                { name: 'Control Lab', credits: 1.5 },
                { name: 'Protection Lab', credits: 1.5 },
                { name: 'Power Systems Lab', credits: 1.5 }
            ],
            'sem-6': [
                { name: 'High Voltage Engineering', credits: 4 },
                { name: 'Utilization of Electrical Energy', credits: 4 },
                { name: 'Digital Signal Processing', credits: 4 },
                { name: 'Renewable Energy', credits: 3 },
                { name: 'HV Lab', credits: 1.5 },
                { name: 'Energy Lab', credits: 1.5 },
                { name: 'Minor Project', credits: 2 }
            ],
            'sem-7': [
                { name: 'Microprocessors', credits: 4 },
                { name: 'Smart Grid Technology', credits: 4 },
                { name: 'Elective I', credits: 3 },
                { name: 'Elective II', credits: 3 },
                { name: 'Microprocessor Lab', credits: 1.5 },
                { name: 'Major Project Phase-I', credits: 3 }
            ],
            'sem-8': [
                { name: 'SCADA Systems', credits: 3 },
                { name: 'Elective III', credits: 3 },
                { name: 'Entrepreneurship', credits: 2 },
                { name: 'Major Project Phase-II', credits: 6 },
                { name: 'Professional Practice', credits: 1 }
            ]
        },
        'ME': {
            'sem-1': FIRST_YEAR_SEM1,
            'sem-2': FIRST_YEAR_SEM2,
            'sem-3': [
                { name: 'Mechanics of Solids', credits: 4 },
                { name: 'Thermodynamics', credits: 4 },
                { name: 'Manufacturing Processes', credits: 4 },
                { name: 'Engineering Design', credits: 3 },
                { name: 'Fluid Mechanics', credits: 3 },
                { name: 'Manufacturing Lab', credits: 1.5 },
                { name: 'Mechanics Lab', credits: 1.5 },
                { name: 'Thermal Lab', credits: 1.5 }
            ],
            'sem-4': [
                { name: 'Machine Design', credits: 4 },
                { name: 'Dynamics of Machines', credits: 4 },
                { name: 'Heat Transfer', credits: 4 },
                { name: 'Finite Element Analysis', credits: 3 },
                { name: 'Machine Design Lab', credits: 1.5 },
                { name: 'Dynamics Lab', credits: 1.5 },
                { name: 'FEA Lab', credits: 1.5 }
            ],
            'sem-5': [
                { name: 'Fluid Power Engineering', credits: 4 },
                { name: 'Refrigeration & AC', credits: 4 },
                { name: 'Internal Combustion Engines', credits: 4 },
                { name: 'Vibration Analysis', credits: 3 },
                { name: 'Fluid Power Lab', credits: 1.5 },
                { name: 'Thermal Systems Lab', credits: 1.5 },
                { name: 'Vibration Lab', credits: 1.5 }
            ],
            'sem-6': [
                { name: 'Gas Turbines', credits: 4 },
                { name: 'Power Plant Engineering', credits: 4 },
                { name: 'Computational Fluid Dynamics', credits: 4 },
                { name: 'Renewable Energy Systems', credits: 3 },
                { name: 'CFD Lab', credits: 1.5 },
                { name: 'Power Systems Lab', credits: 1.5 },
                { name: 'Minor Project', credits: 2 }
            ],
            'sem-7': [
                { name: 'Mechanical Vibrations', credits: 4 },
                { name: 'Advanced Manufacturing', credits: 4 },
                { name: 'Elective I', credits: 3 },
                { name: 'Elective II', credits: 3 },
                { name: 'Advanced Manufacturing Lab', credits: 1.5 },
                { name: 'Major Project Phase-I', credits: 3 }
            ],
            'sem-8': [
                { name: 'Robotics & Automation', credits: 3 },
                { name: 'Elective III', credits: 3 },
                { name: 'Entrepreneurship', credits: 2 },
                { name: 'Major Project Phase-II', credits: 6 },
                { name: 'Professional Practice', credits: 1 }
            ]
        },
        // Legacy/fallback generic presets (first year)
        'sem-1': FIRST_YEAR_SEM1,
        'sem-2': FIRST_YEAR_SEM2
    };

    // ==================== Submit number / preset selection ====================
    submitSubjectsBtn.addEventListener('click', () => {
        const SELECTED_BRANCH = localStorage.getItem('selectedBranch');
        
        // Validate that a branch was selected
        if (!SELECTED_BRANCH) {
            alert('⚠️ Please select a B.Tech branch on the home page first!');
            window.location.href = 'index.html';
            return;
        }

        const preset = semesterSelect ? semesterSelect.value : 'custom';

        // Prefer branch-specific presets if available
        if (preset && preset !== 'custom') {
            if (SEMESTER_PRESETS[SELECTED_BRANCH] && SEMESTER_PRESETS[SELECTED_BRANCH][preset]) {
                const presetList = SEMESTER_PRESETS[SELECTED_BRANCH][preset];
                numSubjects = presetList.length;
                createSubjectInputsFromArray(presetList);
            } else if (SEMESTER_PRESETS[preset]) {
                const presetList = SEMESTER_PRESETS[preset];
                numSubjects = presetList.length;
                createSubjectInputsFromArray(presetList);
            } else {
                numSubjects = 1;
                createSubjectInputs(numSubjects);
            }
        } else {
            // start custom with one subject; user can add more
            numSubjects = 1;
            createSubjectInputs(numSubjects);
        }

        // Show grades screen, hide setup screen
        setupScreen.classList.add('hidden');
        gradesScreen.classList.remove('hidden');
    });

    // Add Subject button (for custom mode)
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', () => {
            numSubjects += 1;
            // Only dynamically added subjects get remove button
            appendSubjectInput(numSubjects, true);
        });
    }

    // ==================== Create Subject Input Fields ====================

    function createSubjectInputs(count) {
        subjectsContainer.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            // Only show remove button for subjects added via '+ Add Subject' (never for initial subjects)
            appendSubjectInput(i, false);
        }
    }


    function appendSubjectInput(i, showRemove = false) {
        const subjectItem = document.createElement('div');
        subjectItem.className = 'subject-item';
        subjectItem.style.position = 'relative';
        subjectItem.innerHTML = `
            <label for="subject-${i}">Subject ${i}:</label>
            <input type="text" id="subject-name-${i}" placeholder="Subject name (optional)">
            <div style="display:flex;gap:8px;margin-top:8px;align-items:center;">
                <input type="number" id="subject-credits-${i}" class="credits-input" placeholder="Credits" min="0" step="0.5" value="1">
                <select id="subject-${i}" class="grade-select" data-subject="${i}">
                    <option value="">-- Select Grade --</option>
                    ${GRADES.map(grade => `<option value="${grade}">${grade}</option>`).join('')}
                </select>
            </div>
            <button class="remove-subject-btn" title="Remove Subject" style="position:absolute;top:4px;right:4px;display:${showRemove ? 'block' : 'none'};background:transparent;border:none;font-size:1.2em;color:#f44;cursor:pointer;">&minus;</button>
        `;
        subjectsContainer.appendChild(subjectItem);

        // Remove button logic (only for dynamically added subjects)
        if (showRemove) {
            const removeBtn = subjectItem.querySelector('.remove-subject-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    subjectItem.remove();
                    numSubjects = Math.max(1, subjectsContainer.querySelectorAll('.subject-item').length);
                    // Re-label subjects
                    Array.from(subjectsContainer.querySelectorAll('.subject-item')).forEach((el, idx) => {
                        const label = el.querySelector('label');
                        if (label) label.textContent = `Subject ${idx + 1}:`;
                    });
                });
            }
        }
    }

    function createSubjectInputsFromArray(arr) {
        subjectsContainer.innerHTML = '';
        arr.forEach((s, idx) => {
            const i = idx + 1;
            const subjectItem = document.createElement('div');
            subjectItem.className = 'subject-item';
            subjectItem.style.position = 'relative';
            subjectItem.innerHTML = `
                <label for="subject-${i}">Subject ${i}: ${s.name}</label>
                <div style="display:flex;gap:8px;margin-top:8px;align-items:center;">
                  <input type="number" id="subject-credits-${i}" class="credits-input" value="${s.credits}" readonly>
                  <select id="subject-${i}" class="grade-select" data-subject="${i}">
                    <option value="">-- Select Grade --</option>
                    ${GRADES.map(grade => `<option value="${grade}">${grade}</option>`).join('')}
                  </select>
                </div>
            `;
            subjectsContainer.appendChild(subjectItem);
        });
    }

    // ==================== Calculate SGPA ====================
    calculateSgpaBtn.addEventListener('click', () => {
        let totalCredits = 0;
        let totalWeightedPoints = 0;
        const subjectItems = subjectsContainer.querySelectorAll('.subject-item');
        
        if (subjectItems.length === 0) {
            alert('Please add at least one subject.');
            return;
        }
        
        // Calculate SGPA, skip subjects without a grade (include all grades including F)
        for (const subjectItem of subjectItems) {
            const gradeSelect = subjectItem.querySelector('.grade-select');
            const selectedGrade = gradeSelect ? gradeSelect.value : '';
            
            // Skip subjects without a selected grade
            if (!selectedGrade) {
                continue;
            }
            
            const creditsInput = subjectItem.querySelector('.credits-input');
            let credits = 1;
            if (creditsInput) {
                const creditsValue = parseFloat(creditsInput.value);
                if (!isNaN(creditsValue) && creditsValue > 0) {
                    credits = creditsValue;
                }
            }
            
            totalCredits += credits;
            totalWeightedPoints += credits * GRADE_POINTS[selectedGrade];
        }
        
        // Only calculate if at least one subject has valid data
        if (totalCredits === 0) {
            alert('Please select at least one grade.');
            return;
        }
        
        // Compute SGPA using standard credit-weighted formula (no manual decrease)
        const sgpa = (totalWeightedPoints / totalCredits).toFixed(2);
        sgpaResultSpan.textContent = sgpa;
        
        // Show result screen, hide grades screen
        gradesScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        // Remove any existing summary (show only SGPA value)
        let summaryDiv = document.getElementById('sgpa-summary');
        if (summaryDiv) {
            summaryDiv.remove();
        }
    });

    // ==================== Recalculate ====================
    recalculateSgpaBtn.addEventListener('click', () => {
        // Reset to setup screen
        setupScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        subjectsContainer.innerHTML = '';
        numSubjects = 0;
    });

    // ==================== In-page Back Handler ====================
    // Called by global back button. Return true if handled here.
    window.pageBackHandler = function() {
        // If result screen is visible, go back to grades screen
        if (!resultScreen.classList.contains('hidden')) {
            resultScreen.classList.add('hidden');
            gradesScreen.classList.remove('hidden');
            return true;
        }

        // If grades screen is visible, go back to setup screen
        if (!gradesScreen.classList.contains('hidden')) {
            gradesScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
            return true;
        }

        // Nothing handled here — allow global fallback (history/index)
        return false;
    };

    // Allow Enter key to submit on semester select (optional)
    if (semesterSelect) {
        semesterSelect.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitSubjectsBtn.click();
        });
    }
});
