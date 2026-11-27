# JanMoolya Tracker (React + Tailwind)

Civic transparency platform connecting public money, ground reality and citizen participation.
Tagline: **Apka Tax. Apka Ward. Poora Hisaab.**
Slogan: *Tax hum sab dete hain... par wo paisa jaata kahan hai?*

Built for the Tutedude Buildathon, CityFix challenge.

## Stack

- **React + Vite** (build tool)
- **Tailwind CSS v4** (utility styling, Sarab-based public theme, Spark-style admin theme)
- **No backend / no database**: all app data lives in the browser (localStorage, key `jmt_state_v1`; signed-in profile in `jmt_user_v1`). Data does not sync across devices.
- **Routing**: hash-based (`#home`, `#dashboard`, `#budget`, `#projects`, `#report`, `#feed`, `#ai`, `#profile`, `#admin`)
- **Fonts**: Poppins + Playfair Display (public site), Plus Jakarta Sans (admin), via Google Fonts
- **Only external API**: India Post PIN verification, `api.postalpincode.in` (live, from the Report form)

## Project structure

```
janmoolya-react/
  index.html
  public/logo.svg            official logo
  src/
    main.jsx                 entry
    App.jsx                  shell (navbar, footer, search, auth modal, page switch)
    store.jsx                global state (React context), localStorage persistence,
                             auth gate helpers, admin session, tracking ID generator
    index.css                Tailwind v4 theme tokens + shared classes
    data/seed.js             all platform data (projects, wards, budgets, feed seeds,
                             reports, issue categories, India geo: 36 states, 455 cities)
    components/
      Navbar.jsx  Footer.jsx  GlobalSearch.jsx (Ctrl+K)  AuthModal.jsx
    pages/
      Home.jsx  Dashboard.jsx  Budget.jsx  Projects.jsx  Report.jsx
      Feed.jsx  AI.jsx  Profile.jsx  Admin.jsx
```

## Pages and features

- **Home**: landing content, city chooser (opens global search), report CTA
- **Dashboard**: computed KPIs, Mismatch Alerts, ward comparison, issue breakdown, recent reports
- **Budget Explorer**: funding sources, department-wise spending, ward budgets, search + filters
- **Project Tracker**: search, State/City/Department/Status/Budget filters, sorting, citizen voting with MISMATCH / CITIZEN VERIFIED badges
- **Report Issue**: login-gated form, State/City from India geo data, live PIN verification, photo upload, JMT-2026-XXXX tracking ID
- **Community Feed**: Facebook-style feed, like/dislike, login-gated comments, filters, computed Community Impact
- **AI Assistant**: Paise Samjho (rule-based, in-browser, answers from the app's own budget data in simple Hindi/English) and Photo Pehchano (in-browser photo inspection with a prepared analysis, no external AI API)
- **Profile**: citizen account, editable details, activity summary
- **Admin** (hidden, `#admin` only): front-end login gate (SHA-256 check, demo gate, not production auth), computed KPIs, report queue with status control, Add Project publishing to the Tracker, Reset Data

Language toggle switches the whole UI between English and Hinglish.

## Run locally

```
npm install
npm run dev
```

## Build and deploy

```
npm run build
```

The build produces a single self-contained `dist/index.html` (plus `logo.svg`, `favicon.svg`, `icons.svg` copied from `public/`). Deploy the `dist/` folder to Vercel as a static site. For the `/admin` path to open the app, keep a rewrite from `/admin` to `/index.html` (see `vercel.json` in the earlier deployment package).

## Notes

- Figures shown in the app are the platform's tracked/sample records unless a source is linked on the page.
- The admin gate is a front-end demo gate for the buildathon, not production authentication.
- No licence file yet.
