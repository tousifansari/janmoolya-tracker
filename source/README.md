# JanMoolya Tracker - Source Code

JanMoolya Tracker is a civic transparency platform that connects public money, ground reality and citizen participation in one place: official municipal budgets, project tracking with Paper vs Ground progress, citizen photo reports with tracking IDs, and Budget Samjho, an assistant that explains the budget in simple Hindi and English.

Live site: https://janmoolya-tracker.vercel.app

## Tech stack

- Frontend: React + Vite + Tailwind CSS (JavaScript)
- Backend: Firebase (Cloud Firestore + Authentication, with security rules)
- Hosting: Vercel
- PIN code lookup: India PIN Code API (api.postalpincode.in)
- Testing: Playwright (automated suites in the tests folder)

## Run locally

1. npm install
2. npm run dev

Production build: npm run build (single-file build via vite-plugin-singlefile; images are served as separate files from the assets folder for speed).

## Structure

- src/pages - Home, Dashboard, Budget Explorer, Project Tracker, Our Work, Report Issue, Community Feed, AI Assistant (Budget Samjho), About, Profile, Admin
- src/components - Navbar, Footer, Auth modal, City picker
- src/data/seed.js - seed data, official city budgets (Indore, Bhopal, Ujjain, FY 2025-26) and the Rs 100 model
- src/firebase.js - Firebase connection (cloud mode with offline seed fallback)
- src/store.jsx - app state, routing, auth, votes, cloud sync
- tests - Playwright QA suites (176 automated checks: flows, admin panel, AI assistant, responsive overflow audits in English and Hinglish)

## Note on the live deployment

The repository root index.html is the production build of this source, and the root assets folder holds the site images. This source folder is the full editable project that the build is made from.

Budget totals for Indore, Bhopal and Ujjain are official figures from the municipal budget documents. The department-wise split is shown through a simple Rs 100 model and is labelled as a model on the site.
