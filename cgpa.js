// THEME SYSTEM
let body = document.body;
// ==================== CGPA Calculator Script ====================

document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);

    const setupScreen = $('setup-screen');
    const sgpasScreen = $('sgpas-screen');
    const resultScreen = $('result-screen');

    const yearSelect = $('year-select');
    const submitSemestersBtn = $('submit-semesters');
    const semestersContainer = $('semesters-container');
    const calculateCgpaBtn = $('calculate-cgpa');
    const cgpaResultSpan = $('cgpa-result');
    const recalculateCgpaBtn = $('recalculate-cgpa');
    const totalCgpaSelect = $('total-cgpa-select');

    let numSemesters = 1;

    // ==================== Submit Year selection (compute semesters) ====================
    submitSemestersBtn.addEventListener('click', () => {
        const years = parseInt(yearSelect.value) || 4;
        numSemesters = years * 2;
        createSemesterInputs(numSemesters);

        // populate total CGPA select (1 .. numSemesters)
        if (totalCgpaSelect) {
            totalCgpaSelect.innerHTML = '';
            for (let i = 1; i <= numSemesters; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                totalCgpaSelect.appendChild(opt);
            }
            totalCgpaSelect.value = numSemesters;
        }

        // Show SGPAs screen, hide setup screen
        setupScreen.classList.add('hidden');
        sgpasScreen.classList.remove('hidden');
    });

    // ==================== Create Semester SGPA Input Fields ====================
    function createSemesterInputs(count) {
        semestersContainer.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            const semesterItem = document.createElement('div');
            semesterItem.className = 'semester-item';
            semesterItem.innerHTML = `
                <label for="semester-${i}">Semester ${i} SGPA (0.00 - 10.00):</label>
                <input 
                    type="number" 
                    id="semester-${i}" 
                    class="sgpa-input"
                    min="0" 
                    max="10" 
                    step="0.01"
                    placeholder="Enter SGPA"
                    data-semester="${i}"
                >
            `;
            semestersContainer.appendChild(semesterItem);
        }
    }

    // ==================== Calculate CGPA ====================
    calculateCgpaBtn.addEventListener('click', () => {
        const take = totalCgpaSelect ? parseInt(totalCgpaSelect.value) : numSemesters;
        if (!take || take < 1 || take > numSemesters) {
            alert('Please select number of semesters to include in total CGPA');
            return;
        }

        let sum = 0;
        let count = 0;

        for (let i = 1; i <= take; i++) {
            const sgpaInput = $(`semester-${i}`);
            const sgpaValue = parseFloat(sgpaInput.value);

            if (isNaN(sgpaValue) || sgpaValue < 0 || sgpaValue > 10) {
                alert(`Please enter a valid SGPA for Semester ${i} (0.00 - 10.00)`);
                return;
            }

            sum += sgpaValue;
            count += 1;
        }

        if (count === 0) {
            alert('No valid SGPAs entered');
            return;
        }

        const cgpa = (sum / count).toFixed(2);
        cgpaResultSpan.textContent = cgpa;

        // Show result screen, hide SGPAs screen
        sgpasScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    });

    // ==================== Recalculate ====================
    recalculateCgpaBtn.addEventListener('click', () => {
        // Reset to setup screen
        setupScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        semestersContainer.innerHTML = '';
        numSemesters = 0;
    });

    // ==================== In-page Back Handler ====================
    // Allows the back button to navigate within the CGPA flow first.
    window.pageBackHandler = function() {
        // If result screen is visible, go back to sgpas screen
        if (!resultScreen.classList.contains('hidden')) {
            resultScreen.classList.add('hidden');
            sgpasScreen.classList.remove('hidden');
            return true;
        }

        // If sgpas screen is visible, go back to setup screen
        if (!sgpasScreen.classList.contains('hidden')) {
            sgpasScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
            return true;
        }

        return false;
    };

    // Allow Enter key on year select
    if (yearSelect) {
        yearSelect.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitSemestersBtn.click();
        });
    }
});
