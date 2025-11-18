// script.js — used by index.html, sgpa.html, cgpa.html
document.addEventListener("DOMContentLoaded", () => {
    // Safe element getter
    const $ = id => document.getElementById(id);

    // ==================== Theme Toggle ====================
    const themeBtn = $('theme-toggle');
    const body = document.body;

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeBtn) themeBtn.innerText = '🌙';
    } else {
        if (themeBtn) themeBtn.innerText = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeBtn.innerText = isLight ? '🌙' : '☀️';
        });
    }

    // ==================== Navigation ====================
    const sgpaBtn = $('sgpa-btn');
    const cgpaBtn = $('cgpa-btn');
    const backBtn = $('back-btn');
    const branchSelect = $('branch-select');

    // Prefill branch select if present
    if (branchSelect) {
        branchSelect.value = localStorage.getItem('selectedBranch') || 'AI';
    }

    if (sgpaBtn) {
        sgpaBtn.addEventListener('click', () => {
            const branch = branchSelect ? branchSelect.value : (localStorage.getItem('selectedBranch') || 'AI');
            localStorage.setItem('selectedBranch', branch);
            window.location.href = 'sgpa.html';
        });
    }

    if (cgpaBtn) {
        cgpaBtn.addEventListener('click', () => {
            const branch = branchSelect ? branchSelect.value : (localStorage.getItem('selectedBranch') || 'AI');
            localStorage.setItem('selectedBranch', branch);
            window.location.href = 'cgpa.html';
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // If the current page has a custom in-page back handler, call it first.
            // The handler should return true if it handled the back navigation.
            try {
                if (typeof window.pageBackHandler === 'function') {
                    const handled = window.pageBackHandler();
                    if (handled) return;
                }
            } catch (e) {
                // swallow errors and fall back to default behavior
                console.error('pageBackHandler error:', e);
            }

            // Prefer to go back in history; if no history, go to home
            if (window.history && window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
    }
});
