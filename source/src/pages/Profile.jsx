import React, { useEffect, useMemo, useState } from "react"
import { useApp } from "../store"
import { INDIA_GEO } from "../data/seed"

const STATUS_STYLE = {
  Submitted: "bg-cyan-100 text-cyan-900",
  "In Progress": "bg-sky-100 text-sky-900",
  Resolved: "bg-green-100 text-green-900",
  "Citizen Verified": "bg-green-100 text-green-900"
}

export default function Profile() {
  const { user, setAuthOpen, completeAuth, signOut, navigate, t, reports, feedComments, feedVotes } = useApp()
  const states = Object.keys(INDIA_GEO)
  const [f, setF] = useState({ name: "", age: "", mobile: "", email: "", state: states[0], city: "" })
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState("")

  useEffect(() => {
    if (user) setF({ name: user.name || "", age: user.age || "", mobile: user.mobile || "", email: user.email || "", state: user.state || states[0], city: user.city || "" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const myReports = useMemo(() => reports.filter(r => r.mine), [reports])
  const myComments = useMemo(() => {
    if (!user) return 0
    return Object.values(feedComments).reduce((sum, arr) => sum + arr.filter(c => c.name === user.name).length, 0)
  }, [feedComments, user])
  const myReactions = useMemo(() => Object.values(feedVotes).filter(v => v === 1 || v === -1).length, [feedVotes])

  if (!user) {
    return (
      <div className="w-full py-8">
        <div className="card mx-auto max-w-md p-8 text-center">
          <p className="text-5xl">👤</p>
          <h1 className="mt-3 font-display text-2xl">{t("Login to see your profile", "Apna profile dekhne ke liye login karein")}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {t("Your reports, comments and reactions live here once you login with your free citizen account.",
              "Login karne ke baad aapki reports, comments aur reactions yahan dikhte hain, free citizen account ke saath.")}
          </p>
          <button onClick={() => setAuthOpen(true)} className="btn-primary mt-5 w-full justify-center">{t("Login / Sign Up", "Login / Sign Up")}</button>
        </div>
      </div>
    )
  }

  const cities = INDIA_GEO[f.state] || []
  const initial = (user.name || "?").trim()[0].toUpperCase()

  const save = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setErr(t("Please enter your full name.", "Apna poora naam likhein."))
    const age = parseInt(f.age, 10)
    if (!age || age < 13 || age > 120) return setErr(t("Age must be between 13 and 120.", "Age 13 se 120 ke beech honi chahiye."))
    if (!/^\d{10}$/.test(String(f.mobile).trim())) return setErr(t("Enter a valid 10-digit mobile number.", "Sahi 10-digit mobile number likhein."))
    if (!f.city) return setErr(t("Please choose your city.", "Apna shehar chunein."))
    setErr("")
    completeAuth({ ...user, name: f.name.trim(), age, mobile: String(f.mobile).trim(), email: String(f.email || "").trim(), state: f.state, city: f.city })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const logout = () => { signOut(); navigate("home") }

  return (
    <div className="w-full py-8">
      <div className="card flex flex-wrap items-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-white">{initial}</div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl">{user.name}</h1>
          <p className="text-sm text-slate-500">📍 {user.city}{user.state ? ", " + user.state : ""}{user.email ? " • " + user.email : ""}</p>
        </div>
        <button onClick={logout} className="btn-ghost ml-auto !py-2 text-sm">{t("Logout", "Logout")}</button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="card p-4 text-center">
          <p className="font-display text-3xl font-bold text-primary">{myReports.length}</p>
          <p className="mt-1 text-sm text-slate-600">{t("My Reports", "Meri Reports")}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-display text-3xl font-bold text-primary">{myComments}</p>
          <p className="mt-1 text-sm text-slate-600">{t("My Comments", "Mere Comments")}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-display text-3xl font-bold text-primary">{myReactions}</p>
          <p className="mt-1 text-sm text-slate-600">{t("My Likes / Reactions", "Mere Likes / Reactions")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={save} className="card h-fit p-6">
          <h2 className="font-display text-xl">{t("Edit Profile", "Profile Edit Karein")}</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="lbl">{t("Full Name", "Poora Naam")} *</label>
              <input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="lbl">{t("Age", "Age")} *</label>
                <input className="input" type="number" min="13" max="120" value={f.age} onChange={e => setF({ ...f, age: e.target.value })} />
              </div>
              <div>
                <label className="lbl">{t("Mobile (10-digit)", "Mobile (10-digit)")} *</label>
                <input className="input" inputMode="numeric" maxLength="10" value={f.mobile} onChange={e => setF({ ...f, mobile: e.target.value.replace(/\D/g, "") })} />
              </div>
            </div>
            <div>
              <label className="lbl">{t("Email / Handle (optional)", "Email / Handle (optional)")}</label>
              <input className="input" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="lbl">{t("State", "State")}</label>
                <select className="input" value={f.state} onChange={e => setF({ ...f, state: e.target.value, city: (INDIA_GEO[e.target.value] || [])[0] || "" })}>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="lbl">{t("City", "City")}</label>
                <select className="input" value={f.city} onChange={e => setF({ ...f, city: e.target.value })}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          {err && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-primary-dark">{err}</p>}
          <button type="submit" className="btn-primary mt-5 w-full justify-center">{t("Save Profile", "Profile Save Karein")}</button>
          {saved && <p className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-center text-sm font-semibold text-jgreen">✓ {t("Profile saved.", "Profile save ho gaya.")}</p>}
          <p className="mt-3 text-center text-xs text-slate-400">{t("Your mobile number is never shown publicly.", "Aapka mobile number publicly kabhi nahi dikhaya jaata.")}</p>
        </form>

        <div>
          <h2 className="font-display text-xl">{t("My Reports", "Meri Reports")}</h2>
          {myReports.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
              {t("You have not posted any report yet.", "Aapne abhi tak koi report nahi bheji.")}
              <button onClick={() => navigate("report")} className="ml-2 font-semibold text-primary">{t("Report an issue", "Issue report karein")}</button>
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {myReports.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-primary">{r.id}</span>
                    <span className={"chip " + (STATUS_STYLE[r.status] || "bg-slate-100 text-slate-700")}>{r.status}</span>
                  </div>
                  <p className="mt-2 font-semibold">{r.title || r.cat}</p>
                  <p className="text-sm text-slate-500">{r.cat} • {r.city}{r.area ? ", " + r.area : ""}</p>
                  {r.photo && <img src={r.photo} alt={r.title || r.cat} className="mt-2 max-h-40 w-full rounded-xl object-cover" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
