import React, { useEffect, useMemo, useState } from "react"
import { useApp } from "../store"
import logoUrl from "../logo"
import { ISSUE_CATS, REPORT_STATUSES, ADMIN_ACCESS_DIGEST, ADMIN_EMAIL, INDIA_GEO, BUDGET_DEPTS, PROJECT_STATUSES, BODY_TYPES, paperLabel, groundLabel, fmtMoney, fmtDateRange, fmtCr, fmtCrSmart } from "../data/seed"
import { projectStats } from "./Dashboard"
import { CLOUD, cloudAdminSignIn } from "../firebase"

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function Admin() {
  const app = useApp()
  const { adminOk, adminLogin, adminLogout, setSearchOpen, navigate, t } = app

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [gateErr, setGateErr] = useState("")
  const [busy, setBusy] = useState(false)

  const tryLogin = async (e) => {
    e.preventDefault()
    setGateErr("")
    if (!email.trim() || !email.includes("@")) { setGateErr(t("Enter a valid email address.", "Sahi email address likhein.")); return }
    if (!password) { setGateErr(t("Enter the password.", "Password likhein.")); return }
    setBusy(true)
    try {
      if (CLOUD) {
        try {
          await cloudAdminSignIn(email, password)
          adminLogin(); setPassword("")
        } catch {
          setGateErr(t("Wrong details. Please try again.", "Galat details. Dobara try karein."))
        }
        setBusy(false)
        return
      }
      const digest = await sha256Hex(password)
      if (digest === ADMIN_ACCESS_DIGEST && email.trim().toLowerCase() === ADMIN_EMAIL) { adminLogin(); setPassword("") }
      else setGateErr(t("Wrong details. Please try again.", "Galat details. Dobara try karein."))
    } catch {
      setGateErr(t("Login could not be verified in this browser. Please try again.", "Is browser mein login verify nahi ho paya. Dobara try karein."))
    }
    setBusy(false)
  }

  if (!adminOk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-adminbg px-3 py-10 font-admin">
        <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white px-3 py-2 shadow-md ring-1 ring-slate-100">
              <img src={logoUrl} alt="JanMoolya Tracker" className="h-14 w-auto" />
            </div>
          </div>
          <h1 className="mt-4 text-center font-display text-2xl text-navy">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-slate-500">{t("Authorised team members only.", "Sirf authorised team members ke liye.")}</p>
          <form onSubmit={tryLogin} className="mt-5 space-y-3">
            <div>
              <label className="lbl">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="username" />
            </div>
            <div>
              <label className="lbl">Password</label>
              <div className="relative">
                <input className="input pr-12" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {gateErr && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{gateErr}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-full bg-navy py-3 font-semibold text-white transition hover:bg-jcyan disabled:opacity-60">
              {busy ? t("Checking...", "Check ho raha hai...") : "Login"}
            </button>
          </form>
          <button onClick={() => navigate("home")} className="mt-4 w-full text-center text-sm font-medium text-slate-500 hover:text-navy">
            {t("Back to website", "Website par wapas")}
          </button>
        </div>
      </div>
    )
  }

  return <AdminPanel app={app} />
}

function AdminPanel({ app }) {
  const { reports, projects, users, bannedMobiles, banUser, unbanUser, setReportStatus, addProject, updateProject, resetData, adminLogout, setSearchOpen, navigate, t, cityBudgets, addCityBudget } = app

  const [tab, setTab] = useState("dashboard")
  const [statusFilter, setStatusFilter] = useState("All")
  const [q, setQ] = useState("")
  const [pf, setPf] = useState({ name: "", state: "Madhya Pradesh", city: "Indore", pin: "", area: "", cat: "roads", dept: "Roads Department", contractor: "", engineer: "", status: "In Progress", start: "", end: "", approved: "", spent: "", workers: "", paperPct: 0, groundPct: 0, bodyType: BODY_TYPES[0], bodyName: "", sanctionNo: "", sanctionDate: "" })
  const [added, setAdded] = useState(false)
  const [cf, setCf] = useState({ state: "Madhya Pradesh", city: "Indore", bodyType: BODY_TYPES[0], bodyName: "", fy: "2025-26", income: "", expenditure: "", source: "" })
  const [cityAdded, setCityAdded] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [confirmBan, setConfirmBan] = useState("")

  const stats = useMemo(() => {
    const open = reports.filter(r => r.status === "Submitted").length
    const inProg = reports.filter(r => r.status === "In Progress").length
    const mismatches = projects.filter(p => projectStats(p, {}).mismatch).length
    return { open, inProg, mismatches, projects: projects.length, reports: reports.length, users: (users || []).length }
  }, [reports, projects, users])

  const queue = useMemo(() => {
    let list = reports.slice()
    if (statusFilter !== "All") list = list.filter(r => r.status === statusFilter)
    const s = q.trim().toLowerCase()
    if (s) list = list.filter(r => (r.id + " " + r.cat + " " + (r.city || "") + " " + (r.area || "") + " " + (r.title || "")).toLowerCase().includes(s))
    return list
  }, [reports, statusFilter, q])

  const reportCountByName = useMemo(() => {
    const m = {}
    reports.forEach(r => { const n = r.by; if (n) m[n] = (m[n] || 0) + 1 })
    return m
  }, [reports])

  const clampPct = (v) => Math.max(0, Math.min(100, parseInt(v, 10) || 0))

  const submitProject = (e) => {
    e.preventDefault()
    if (!pf.name.trim()) return
    const paperPct = clampPct(pf.paperPct)
    const groundPct = clampPct(pf.groundPct)
    addProject({
      name: pf.name.trim(), state: pf.state, city: pf.city, pin: pf.pin.trim(),
      area: pf.area.trim(), loc: (pf.area.trim() ? pf.area.trim() + " • " : "") + pf.city,
      ward: pf.area.trim() || pf.city, cat: pf.cat, dept: pf.dept,
      contractor: pf.contractor.trim(), engineer: pf.engineer.trim(),
      workers: parseInt(pf.workers, 10) || 0, status: pf.status,
      start: pf.start, end: pf.end, dates: fmtDateRange(pf.start, pf.end),
      approved: (parseFloat(pf.approved) || 0) / 100000, spent: (parseFloat(pf.spent) || 0) / 100000,
      paperPct, groundPct, paper: paperLabel(paperPct), ground: groundLabel(groundPct),
      bodyType: pf.bodyType, bodyName: pf.bodyName.trim(), sanctionNo: pf.sanctionNo.trim(), sanctionDate: pf.sanctionDate,
      votesYes: 0, votesNo: 0, photos: 0
    })
    setPf({ name: "", state: "Madhya Pradesh", city: "Indore", pin: "", area: "", cat: "roads", dept: "Roads Department", contractor: "", engineer: "", status: "In Progress", start: "", end: "", approved: "", spent: "", workers: "", paperPct: 0, groundPct: 0, bodyType: BODY_TYPES[0], bodyName: "", sanctionNo: "", sanctionDate: "" })
    setAdded(true)
  }

  const submitCity = (e) => {
    e.preventDefault()
    const income = (parseFloat(cf.income) || 0) / 10000000
    const expenditure = (parseFloat(cf.expenditure) || 0) / 10000000
    if (!cf.city || income <= 0 || expenditure <= 0) return
    const src = cf.source.trim() || (cf.bodyName.trim() || cf.bodyType)
    addCityBudget({
      state: cf.state, city: cf.city, bodyType: cf.bodyType, bodyName: cf.bodyName.trim(),
      fy: cf.fy.trim() || "2025-26", income, expenditure,
      deficit: Math.max(0, Math.round((expenditure - income) * 100) / 100),
      sourceEn: "Source: " + src, sourceHl: "Source: " + src
    })
    setCityAdded(true)
  }

  const doReset = () => {
    if (!confirmReset) { setConfirmReset(true); return }
    resetData()
    setConfirmReset(false)
    setResetDone(true)
  }

  const menuItems = [
    ["dashboard", "📊 Dashboard"],
    ["projects", "🗂️ All Projects"],
    ["reports", "📋 Reports"],
    ["users", "👥 Users"],
    ["add", "➕ Add Project"],
    ["city", "🏙️ City Budget"]
  ]

  const statCards = [
    { label: "Open Reports", value: stats.open, dark: true, badge: t("Needs action", "Action chahiye") },
    { label: "In Progress", value: stats.inProg, dark: false },
    { label: "Mismatch Alerts", value: stats.mismatches, dark: false },
    { label: "Total Projects", value: stats.projects, dark: false },
    { label: "Total Reports", value: stats.reports, dark: false },
    { label: "Total Users", value: stats.users, dark: false }
  ]

  const projCats = ISSUE_CATS.filter(c => c.proj)
  const deptOptions = [...BUDGET_DEPTS.map(d => d.name), "Other Department"]
  const pfCities = INDIA_GEO[pf.state] || []

  return (
    <div className="flex min-h-screen bg-adminbg font-admin text-ink">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy text-white lg:flex">
        <div className="px-5 py-5">
          <div className="rounded-xl bg-white px-3 py-2">
            <img src={logoUrl} alt="JanMoolya Tracker" className="h-10 w-auto" />
          </div>
          <p className="mt-2 text-xs font-semibold text-white/60">Admin Panel</p>
        </div>
        <p className="px-5 pt-2 text-[11px] font-bold uppercase tracking-widest text-white/40">Menu</p>
        <nav className="mt-2 space-y-1 px-3">
          {menuItems.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={"block w-full rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/10 hover:text-white " + (tab === id ? "bg-white/15 font-bold text-white" : "font-medium text-white/85")}>
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-jcyan font-bold text-white">A</div>
              <div>
                <p className="text-sm font-semibold">Administrator</p>
                <p className="text-xs text-white/60">JanMoolya Team</p>
              </div>
            </div>
            <button onClick={adminLogout} className="mt-3 w-full rounded-full bg-white/15 py-2 text-sm font-semibold transition hover:bg-white/25">Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-white/50 bg-adminbg/80 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="rounded-lg bg-white px-1.5 py-1 shadow-sm">
                <img src={logoUrl} alt="JanMoolya Tracker" className="h-7 w-auto" />
              </div>
            </div>
            <h1 className="font-display text-xl text-navy sm:text-2xl">Admin Panel</h1>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm sm:flex">
                🔍 {t("Search anything…", "Kuch bhi search karein…")} <span className="rounded bg-slate-100 px-1.5 text-xs">Ctrl K</span>
              </button>
              <button onClick={() => setTab("add")} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-jcyan">+ Add Project</button>
              <button onClick={() => setTab("reports")} className="relative rounded-full bg-white p-2.5 shadow-sm" aria-label="Open reports">
                🔔
                {stats.open > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">{stats.open}</span>}
              </button>
              <button onClick={adminLogout} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm lg:hidden">Sign Out</button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {menuItems.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={"shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-white " + (tab === id ? "bg-jcyan" : "bg-navy")}>{label}</button>
            ))}
          </nav>
        </header>

        <div className="space-y-6 px-4 py-6 sm:px-6">
          {tab === "dashboard" && (
            <>
              <section>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                  {statCards.map(c => (
                    <div key={c.label} className={c.dark ? "rounded-3xl bg-navy p-5 text-white shadow-lg" : "rounded-3xl bg-white p-5 shadow-sm"}>
                      <p className={c.dark ? "text-xs font-semibold uppercase tracking-wide text-white/60" : "text-xs font-semibold uppercase tracking-wide text-slate-400"}>{c.label}</p>
                      <p className="mt-2 font-display text-4xl font-bold">{c.value}</p>
                      {c.badge && <span className="mt-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-white">{c.badge}</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
                <h2 className="font-display text-xl text-primary-dark">Reset Data</h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  {t("This clears citizen reports, votes, comments, added projects, registered users and bans stored in this browser, and restores the original data. This cannot be undone.",
                    "Isse is browser mein saved citizen reports, votes, comments, added projects, registered users aur bans saaf ho jayenge aur original data wapas aa jayega. Ye wapas nahi ho sakta.")}
                </p>
                <button onClick={doReset} className={"mt-4 rounded-full px-6 py-3 font-semibold text-white transition " + (confirmReset ? "bg-primary" : "bg-navy hover:bg-primary")}>
                  {confirmReset ? t("Are you sure? Click again to reset", "Pakka? Reset karne ke liye dobara click karein") : t("Reset All Data", "Saara Data Reset Karein")}
                </button>
                {resetDone && <p className="mt-3 text-sm font-semibold text-jgreen">✓ {t("Data has been reset.", "Data reset ho gaya hai.")}</p>}
              </section>
            </>
          )}

          {tab === "projects" && (
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-xl text-navy">All Projects</h2>
                <span className="rounded-full bg-adminbg px-3 py-1 text-xs font-bold text-navy">{projects.length} {t("projects", "projects")}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{t("Every project in the tracker, in one place. Change the status, or update Paper Progress, Ground Progress and the Spent amount, then press Save.", "Tracker ke saare projects ek jagah. Status badlein, ya Paper Progress, Ground Progress aur Kharch ki rakam update karke Save dabayein.")}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[1040px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3">Project</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">📄 Paper %</th>
                      <th className="py-2 pr-3">🏗️ Ground %</th>
                      <th className="py-2 pr-3">Budget</th>
                      <th className="py-2 pr-3">{t("Spent (₹)", "Kharch (₹)")}</th>
                      <th className="py-2 pr-3">Contractor</th>
                      <th className="py-2">Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => <ProjectRow key={p.id} p={p} t={t} onSave={updateProject} />)}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-400">{t("Note: if the closing date has passed and the project is not Completed, it automatically shows as Delayed on the website.", "Note: agar closing date nikal gayi ho aur project Completed na ho, to website par wo apne aap Delayed dikhta hai.")}</p>
            </section>
          )}

          {tab === "reports" && (
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-xl text-navy">Reports</h2>
                <span className="rounded-full bg-adminbg px-3 py-1 text-xs font-bold text-navy">{queue.length} {t("shown", "dikhe")}</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <input className="input !w-52 !py-2 text-sm" value={q} onChange={e => setQ(e.target.value)} placeholder={t("Search ID, category, city…", "ID, category, city search karein…")} />
                  <select className="input !w-44 !py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="All">{t("All Statuses", "Sab Statuses")}</option>
                    {REPORT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3">Tracking ID</th>
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 pr-3">City / Area</th>
                      <th className="py-2 pr-3">Priority</th>
                      <th className="py-2 pr-3">Reporter</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map(r => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-adminbg/50">
                        <td className="py-3 pr-3 font-mono font-bold text-navy">{r.id}</td>
                        <td className="py-3 pr-3">{r.cat}</td>
                        <td className="py-3 pr-3">{r.city || ""}{r.area ? ", " + r.area : ""}</td>
                        <td className="py-3 pr-3">
                          <span className={"chip " + (r.priority === "High" ? "bg-red-50 text-primary-dark" : r.priority === "Low" ? "bg-slate-100 text-slate-600" : "bg-cyan-50 text-cyan-800")}>{r.priority || "Medium"}</span>
                        </td>
                        <td className="py-3 pr-3">{r.by || (r.mine ? "You" : "Citizen")}</td>
                        <td className="py-3">
                          <select className="input !w-44 !py-1.5 text-sm" value={r.status} onChange={e => setReportStatus(r.id, e.target.value)}>
                            {REPORT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {queue.length === 0 && (
                      <tr><td colSpan="6" className="py-6 text-center text-slate-500">{t("No reports match this filter.", "Is filter se koi report match nahi hui.")}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "users" && (
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-xl text-navy">Users</h2>
                <span className="rounded-full bg-adminbg px-3 py-1 text-xs font-bold text-navy">{(users || []).length} {t("users", "users")}</span>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-primary-dark">{(bannedMobiles || []).length} {t("banned", "banned")}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{t("Citizen accounts. If you ban a user, that mobile number can never create an account again. Accounts created on this device appear here automatically; demo members are sample data.", "Citizen accounts. Kisi user ko ban karne par us mobile number se phir kabhi account nahi banega. Is device par bane accounts yahan apne aap aa jaate hain; demo members sample data hain.")}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3">User</th>
                      <th className="py-2 pr-3">Mobile</th>
                      <th className="py-2 pr-3">City / State</th>
                      <th className="py-2 pr-3">Joined</th>
                      <th className="py-2 pr-3">Reports</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map(u => {
                      const banned = (bannedMobiles || []).includes(u.mobile)
                      return (
                        <tr key={u.mobile} className="border-b border-slate-50 hover:bg-adminbg/50">
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{(u.name || "?").trim().charAt(0).toUpperCase()}</span>
                              <span>
                                <span className="block font-semibold text-ink">{u.name}</span>
                                <span className="block text-xs text-slate-400">{u.email || ""}{u.demo ? " • Demo" : ""}</span>
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-3 font-mono">{u.mobile}</td>
                          <td className="py-3 pr-3">{u.city || ""}{u.state ? ", " + u.state : ""}</td>
                          <td className="py-3 pr-3">{u.joined || ""}</td>
                          <td className="py-3 pr-3">{reportCountByName[u.name] || 0}</td>
                          <td className="py-3 pr-3">
                            {banned
                              ? <span className="chip bg-red-100 text-red-700">BANNED</span>
                              : <span className="chip bg-green-100 text-green-700">ACTIVE</span>}
                          </td>
                          <td className="py-3">
                            {banned ? (
                              <button onClick={() => unbanUser(u.mobile)} className="rounded-full border-2 border-jgreen px-4 py-1.5 text-xs font-bold text-jgreen transition hover:bg-jgreen hover:text-white">{t("Unban", "Unban Karein")}</button>
                            ) : confirmBan === u.mobile ? (
                              <span className="flex gap-1.5">
                                <button onClick={() => { banUser(u.mobile); setConfirmBan("") }} className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">{t("Confirm Ban", "Pakka Ban?")}</button>
                                <button onClick={() => setConfirmBan("")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{t("Cancel", "Cancel")}</button>
                              </span>
                            ) : (
                              <button onClick={() => setConfirmBan(u.mobile)} className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition hover:bg-primary-dark">{t("Ban User", "Ban Karein")}</button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {(users || []).length === 0 && (
                      <tr><td colSpan="7" className="py-6 text-center text-slate-500">{t("No users yet.", "Abhi koi user nahi hai.")}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "add" && (
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-display text-xl text-navy">Add a Project</h2>
              <p className="mt-1 text-sm text-slate-500">{t("Published projects appear in the Project Tracker right away, and can be found with the State, City and Status filters.", "Publish kiya gaya project Project Tracker mein turant dikhta hai, aur State, City aur Status filters se mil jaata hai.")}</p>
              <form onSubmit={submitProject} className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="lbl">Project Name *</label>
                  <input className="input" value={pf.name} onChange={e => setPf({ ...pf, name: e.target.value })} placeholder="e.g. Smart Road Construction, MG Road" />
                </div>
                <div>
                  <label className="lbl">State</label>
                  <select className="input" value={pf.state} onChange={e => setPf({ ...pf, state: e.target.value, city: (INDIA_GEO[e.target.value] || [])[0] || "" })}>
                    {Object.keys(INDIA_GEO).map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">City</label>
                  <select className="input" value={pf.city} onChange={e => setPf({ ...pf, city: e.target.value })}>
                    {pfCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">PIN Code</label>
                  <input className="input" inputMode="numeric" maxLength="6" value={pf.pin} onChange={e => setPf({ ...pf, pin: e.target.value.replace(/\D/g, "") })} placeholder="e.g. 452001" />
                </div>
                <div>
                  <label className="lbl">{t("Ward / Area", "Ward / Area")}</label>
                  <input className="input" value={pf.area} onChange={e => setPf({ ...pf, area: e.target.value })} placeholder="e.g. MG Road, Ward 52" />
                </div>
                <div>
                  <label className="lbl">Category</label>
                  <select className="input" value={pf.cat} onChange={e => setPf({ ...pf, cat: e.target.value })}>
                    {projCats.map(c => <option key={c.key} value={c.proj}>{c.en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">Department</label>
                  <select className="input" value={pf.dept} onChange={e => setPf({ ...pf, dept: e.target.value })}>
                    {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">{t("Money Passed To (Body Type)", "Paisa Kisko Pass Hua (Nikay)")}</label>
                  <select className="input" value={pf.bodyType} onChange={e => setPf({ ...pf, bodyType: e.target.value })}>
                    {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">{t("Body Name", "Nikay ka Naam")}</label>
                  <input className="input" value={pf.bodyName} onChange={e => setPf({ ...pf, bodyName: e.target.value })} placeholder="e.g. Nagar Palik Nigam, Indore" />
                </div>
                <div>
                  <label className="lbl">{t("Sanction / Tender No.", "Sanction / Tender Number")}</label>
                  <input className="input" value={pf.sanctionNo} onChange={e => setPf({ ...pf, sanctionNo: e.target.value })} placeholder="e.g. IMC/WS/2026/118" />
                </div>
                <div>
                  <label className="lbl">{t("Sanction Date", "Sanction ki Date")}</label>
                  <input className="input" type="date" value={pf.sanctionDate} onChange={e => setPf({ ...pf, sanctionDate: e.target.value })} />
                </div>
                <div>
                  <label className="lbl">Contractor Name</label>
                  <input className="input" value={pf.contractor} onChange={e => setPf({ ...pf, contractor: e.target.value })} placeholder="e.g. Sharma Constructions" />
                </div>
                <div>
                  <label className="lbl">Site Engineer Name</label>
                  <input className="input" value={pf.engineer} onChange={e => setPf({ ...pf, engineer: e.target.value })} placeholder="e.g. Er. Rakesh Verma" />
                </div>
                <div>
                  <label className="lbl">Project Status</label>
                  <select className="input" value={pf.status} onChange={e => setPf({ ...pf, status: e.target.value })}>
                    {PROJECT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">{t("Workers on Site", "Site Par Workers")}</label>
                  <input className="input" type="number" min="0" value={pf.workers} onChange={e => setPf({ ...pf, workers: e.target.value })} placeholder="e.g. 85" />
                </div>
                <div>
                  <label className="lbl">{t("Start Date", "Shuru Hone ki Date")}</label>
                  <input className="input" type="date" value={pf.start} onChange={e => setPf({ ...pf, start: e.target.value })} />
                </div>
                <div>
                  <label className="lbl">{t("Closing Date", "Band / Poora Hone ki Date")}</label>
                  <input className="input" type="date" value={pf.end} onChange={e => setPf({ ...pf, end: e.target.value })} />
                </div>
                <div>
                  <label className="lbl">{t("Sanctioned Amount / Approved (₹)", "Sanction (Pass) Rakam (₹)")}</label>
                  <input className="input" type="number" min="0" step="1" value={pf.approved} onChange={e => setPf({ ...pf, approved: e.target.value })} placeholder="e.g. 20000" />
                  {pf.approved !== "" && <p className="mt-1 text-xs font-semibold text-slate-500">= {fmtMoney((parseFloat(pf.approved) || 0) / 100000)}</p>}
                </div>
                <div>
                  <label className="lbl">Spent So Far (₹)</label>
                  <input className="input" type="number" min="0" step="1" value={pf.spent} onChange={e => setPf({ ...pf, spent: e.target.value })} placeholder="e.g. 5000" />
                  {pf.spent !== "" && <p className="mt-1 text-xs font-semibold text-slate-500">= {fmtMoney((parseFloat(pf.spent) || 0) / 100000)}</p>}
                </div>
                <div className="rounded-2xl bg-adminbg p-4">
                  <label className="lbl">📄 {t("Paper Progress: kitna % complete kagaz par dikhaya gaya hai", "Paper Progress")}</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" step="1" className="flex-1 accent-[#2EB3C9]" value={pf.paperPct} onChange={e => setPf({ ...pf, paperPct: e.target.value })} />
                    <span className="w-14 text-right font-display text-2xl font-bold text-navy">{pf.paperPct}%</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-adminbg p-4">
                  <label className="lbl">🏗️ {t("Ground Progress: asal mein zameen par kitna % kaam hua hai", "Ground Progress")}</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" step="1" className="flex-1 accent-[#2D6A4F]" value={pf.groundPct} onChange={e => setPf({ ...pf, groundPct: e.target.value })} />
                    <span className="w-14 text-right font-display text-2xl font-bold text-navy">{pf.groundPct}%</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="rounded-full bg-navy px-6 py-3 font-semibold text-white transition hover:bg-jcyan">{t("Publish Project", "Project Publish Karein")}</button>
                  {added && (
                    <span className="ml-3 inline-flex flex-wrap items-center gap-3 text-sm font-semibold text-jgreen">
                      ✓ {t("Project published to the Project Tracker.", "Project Project Tracker mein publish ho gaya hai.")}
                      <button type="button" onClick={() => navigate("projects")} className="font-bold text-navy underline">{t("View in Tracker", "Tracker Mein Dekhein")}</button>
                      <button type="button" onClick={() => setTab("projects")} className="font-bold text-navy underline">{t("See in All Projects", "All Projects Mein Dekhein")}</button>
                    </span>
                  )}
                </div>
              </form>
            </section>
          )}

          {tab === "city" && (
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-display text-xl text-navy">{t("Add a City's Budget", "Kisi Shehar ka Budget Jodein")}</h2>
              <p className="mt-1 text-sm text-slate-500">{t("Add a city's official budget once, and its citizens can explore it on the Dashboard and Budget Explorer with the same Rs100 template. The money is shown against the local body it was passed to.", "Kisi shehar ka official budget ek baar jod dein, uske nagrik Dashboard aur Budget Explorer par usi Rs100 template mein use explore kar sakenge. Paisa usi nikay ke naam par dikhega jisko wo pass hua hai.")}</p>
              <form onSubmit={submitCity} className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="lbl">State</label>
                  <select className="input" value={cf.state} onChange={e => setCf({ ...cf, state: e.target.value, city: (INDIA_GEO[e.target.value] || [])[0] || "" })}>
                    {Object.keys(INDIA_GEO).map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">City</label>
                  <select className="input" value={cf.city} onChange={e => setCf({ ...cf, city: e.target.value })}>
                    {(INDIA_GEO[cf.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">{t("Money Passed To (Body Type)", "Paisa Kisko Pass Hua (Nikay)")}</label>
                  <select className="input" value={cf.bodyType} onChange={e => setCf({ ...cf, bodyType: e.target.value })}>
                    {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">{t("Body Name", "Nikay ka Naam")}</label>
                  <input className="input" value={cf.bodyName} onChange={e => setCf({ ...cf, bodyName: e.target.value })} placeholder="e.g. Nagar Palik Nigam, Indore" />
                </div>
                <div>
                  <label className="lbl">{t("Financial Year", "Vittiya Varsh")}</label>
                  <input className="input" value={cf.fy} onChange={e => setCf({ ...cf, fy: e.target.value })} placeholder="e.g. 2025-26" />
                </div>
                <div>
                  <label className="lbl">{t("Source (document / website)", "Source (document / website)")}</label>
                  <input className="input" value={cf.source} onChange={e => setCf({ ...cf, source: e.target.value })} placeholder="e.g. Nagar Nigam Budget PDF 2025-26" />
                </div>
                <div>
                  <label className="lbl">{t("Total Income (₹)", "Kul Aamdani (₹)")}</label>
                  <input className="input" type="number" min="0" step="1" value={cf.income} onChange={e => setCf({ ...cf, income: e.target.value })} placeholder="e.g. 81749400000" />
                  {cf.income !== "" && <p className="mt-1 text-xs font-semibold text-slate-500">= {fmtCrSmart((parseFloat(cf.income) || 0) / 10000000)}</p>}
                </div>
                <div>
                  <label className="lbl">{t("Total Expenditure (₹)", "Kul Kharch (₹)")}</label>
                  <input className="input" type="number" min="0" step="1" value={cf.expenditure} onChange={e => setCf({ ...cf, expenditure: e.target.value })} placeholder="e.g. 82369800000" />
                  {cf.expenditure !== "" && <p className="mt-1 text-xs font-semibold text-slate-500">= {fmtCrSmart((parseFloat(cf.expenditure) || 0) / 10000000)}</p>}
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="rounded-full bg-navy px-6 py-3 font-semibold text-white transition hover:bg-jcyan">{t("Save City Budget", "City Budget Save Karein")}</button>
                  {cityAdded && <span className="ml-3 text-sm font-semibold text-jgreen">✓ {t("City budget saved. Citizens who select this city will now see its account.", "City budget save ho gaya. Jo nagrik ye shehar chunenge unhe iska hisaab dikhega.")}</span>}
                </div>
              </form>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <h3 className="font-display text-lg text-navy">{t("Cities on JanMoolya", "JanMoolya par Shehar")}</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {Object.values(cityBudgets || {}).map(b => (
                    <div key={b.city} className="rounded-2xl bg-adminbg px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-navy">{b.city}</span>
                        <span className="text-xs font-semibold text-slate-500">FY {b.fy}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{b.bodyName || b.bodyType}</div>
                      <div className="mt-1 text-sm text-slate-600">{t("Income", "Aamdani")} <strong className="text-navy">{fmtCrSmart(b.income)}</strong> • {t("Expenditure", "Kharch")} <strong className="text-navy">{fmtCrSmart(b.expenditure)}</strong></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectRow({ p, t, onSave }) {
  const [paperPct, setPaperPct] = useState(p.paperPct ?? "")
  const [groundPct, setGroundPct] = useState(p.groundPct ?? "")
  const spentInit = String(Math.round((Number(p.spent) || 0) * 100000))
  const [spent, setSpent] = useState(spentInit)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setPaperPct(p.paperPct ?? ""); setGroundPct(p.groundPct ?? "") }, [p.paperPct, p.groundPct])
  useEffect(() => { setSpent(String(Math.round((Number(p.spent) || 0) * 100000))) }, [p.spent])
  const dirty = String(paperPct) !== String(p.paperPct ?? "") || String(groundPct) !== String(p.groundPct ?? "") || String(spent) !== spentInit
  const save = () => {
    onSave(p.id, { paperPct: Math.max(0, Math.min(100, parseInt(paperPct, 10) || 0)), groundPct: Math.max(0, Math.min(100, parseInt(groundPct, 10) || 0)), spent: Math.max(0, (parseFloat(spent) || 0) / 100000) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  return (
    <tr className="border-b border-slate-50 hover:bg-adminbg/50">
      <td className="py-3 pr-3">
        <span className="block font-semibold text-navy">{p.name}</span>
        <span className="block text-xs text-slate-400">{p.city || ""}{p.state ? ", " + p.state : ""}{p.engineer ? " • " + p.engineer : ""}</span>
        {p.effStatus && p.status && p.effStatus !== p.status && <span className="mt-0.5 block text-xs font-bold text-red-600">{t("Auto: Delayed (closing date passed)", "Auto: Delayed (closing date nikal gayi)")}</span>}
      </td>
      <td className="py-3 pr-3">
        <select className="input !w-40 !py-1.5 text-sm" value={p.status || "In Progress"} onChange={e => onSave(p.id, { status: e.target.value })}>
          {PROJECT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      </td>
      <td className="py-3 pr-3">
        <input type="number" min="0" max="100" className="input !w-24 !py-1.5 text-sm" value={paperPct} onChange={e => setPaperPct(e.target.value)} />
      </td>
      <td className="py-3 pr-3">
        <input type="number" min="0" max="100" className="input !w-24 !py-1.5 text-sm" value={groundPct} onChange={e => setGroundPct(e.target.value)} />
      </td>
      <td className="py-3 pr-3 whitespace-nowrap">{fmtMoney(p.approved)}</td>
      <td className="py-3 pr-3">
        <input type="number" min="0" step="1" className="input !w-32 !py-1.5 text-sm" value={spent} onChange={e => setSpent(e.target.value)} />
        <span className="mt-0.5 block text-[11px] font-semibold text-slate-400">= {fmtMoney((parseFloat(spent) || 0) / 100000)}</span>
      </td>
      <td className="py-3 pr-3">{p.contractor || ""}</td>
      <td className="py-3">
        <button onClick={save} disabled={!dirty} className={"rounded-full px-4 py-1.5 text-xs font-bold text-white transition " + (dirty ? "bg-navy hover:bg-jcyan" : "bg-slate-300")}>{saved ? "✓ Saved" : "Save"}</button>
      </td>
    </tr>
  )
}
