

# RTU SGPA & CGPA Calculator

A lightweight, responsive web app to calculate SGPA (Semester Grade Point Average) and CGPA (Cumulative Grade Point Average) for RTU (Rajasthan Technical University) students.

This repository contains a simple, dark-themed calculator that uses branch/semester presets (subjects + credits) or a custom/manual mode to compute credit-weighted SGPA and CGPA.

## Features

- Branch-wise semester presets with subjects and credit values
- Custom / Manual mode to add/remove subjects and set credits
- Dark/light theme toggle (persisted in `localStorage`)
- SGPA calculation uses credit-weighted grade points and skips empty grades; subjects with grade `F` are excluded from SGPA calculation
- Simple, dependency-free HTML/CSS/JS (no build step required)

## Grade Points (current mapping)

- A++: 10
- A+: 9
- A : 8
- B+: 7
- B : 6
- C+: 5
- C : 4
- D+: 3
- D : 2
- E+: 1
- E : 0.5
- F : 0

> Note: `E` is currently set to `0.5`. Change values in `sgpa.js` if you need a different mapping.

## Usage

1. Open `index.html` in a browser.
2. Select your B.Tech branch on the home page.
3. Click `Calculate SGPA` or `Calculate CGPA`.
4. On the SGPA page you can choose a semester preset or choose `Custom / Manual` (this option is placed last in the semester list).
5. Enter/select grades (and credits for custom subjects) and click `Calculate SGPA`.
6. The result is shown as `Your SGPA is: X.XX`.

## Files

- `index.html` — Home / branch selector
- `sgpa.html` — SGPA calculator UI
- `cgpa.html` — CGPA calculator UI
- `style.css` — Styling and theme variables
- `script.js` — Shared navigation and theme logic
- `sgpa.js` — SGPA logic, presets and grade mapping
- `cgpa.js` — CGPA logic

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. In repository Settings → Pages, select the branch (`main` or `master`) and root folder.
3. Save and visit `https://<your-username>.github.io/<repo-name>/index.html`.

## Local Test Server (optional)

Run a local static server to test (PowerShell example):

```powershell
cd "c:\Users\Priyanshuu\OneDrive\Desktop\rtu-grade-calc"
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

## Contributing

Contributions are welcome. Suggested improvements:

- Add complete RTU subject lists for all branches and scheme years
- Make grade mapping editable in UI
- Add unit tests for calculation logic
- Improve accessibility and keyboard navigation

## Author

Priyanshu Sharma

---

If you want, I can add a `LICENSE` file (MIT), a GitHub Actions workflow for automatic Pages deployment, or a short demo GIF to include in the README. Tell me which you prefer and I'll add it.


