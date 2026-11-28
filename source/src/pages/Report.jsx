import React, { useMemo, useState } from "react"
import { useApp } from "../store"
import { ISSUE_CATS, INDIA_GEO } from "../data/seed"

const DEPT_BY_CAT = {
  roads: "Roads Department",
  drainage: "Drainage Department",
  water: "Water Board",
  garbage: "Sanitation Department",
  lights: "Electrical (Streetlights)",
  toilets: "Sanitation Department",
  safety: "Traffic Police / Nagar Nigam"
}

const STATUS_STYLE = {
  Submitted: "bg-cyan-100 text-cyan-900",
  "In Progress": "bg-sky-100 text-sky-900",
  Resolved: "bg-green-100 text-green-900",
  "Citizen Verified": "bg-green-100 text-green-900"
}

export default function Report() {
  const { user, requireAuth, navigate, t, loc, reports, addReport } = useApp()
  const states = Object.keys(INDIA_GEO)
  const [catKey, setCatKey] = useState(ISSUE_CATS[0].key)
  const [state, setState] = useState(loc.state || states[0])
  const [city, setCity] = useState(loc.city || (INDIA_GEO[loc.state] || [])[0] || "")
  const [pin, setPin] = useState("")
  const [pinState, setPinState] = useState(null)
  const [pinBusy, setPinBusy] = useState(false)
  const [area, setArea] = useState("")
  const [ward, setWard] = useState("")
  const [place, setPlace] = useState("")
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [photo, setPhoto] = useState(null)
  const [err, setErr] = useState("")
  const [done, setDone] = useState(null)

  const cities = INDIA_GEO[state] || []
  const cat = ISSUE_CATS.find(c => c.key === catKey) || ISSUE_CATS[0]
  const myReports = useMemo(() => reports.filter(r => r.mine), [reports])

  const onPhoto = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(f)
  }

  const verifyPin = async () => {
    if (!/^\d{6}$/.test(pin)) { setPinState({ ok: false }); return }
    setPinBusy(true)
    try {
      const res = await fetch("https://api.postalpincode.in/pincode/" + pin)
      const json = await res.json()
      const first = Array.isArray(json) ? json[0] : null
      if (first && first.Status === "Success" && first.PostOffice && first.PostOffice.length) {
        const po = first.PostOffice[0]
        setPinState({ ok: true, name: po.Name, district: po.District, state: po.State })
      } else {
        setPinState({ ok: false })
      }
    } catch {
      setPinState({ ok: false })
    }
    setPinBusy(false)
  }

  const doSubmit = () => {
    if (!catKey) return setErr(t("Please choose a category.", "Pehle category chunein."))
    if (!city) return setErr(t("Please choose your city.", "Apna shehar chunein."))
    if (title.trim().length < 4) return setErr(t("Please write a short title for the issue.", "Issue ke liye ek chhota sa title likhein."))
    if (desc.trim().length < 10) return setErr(t("Please describe the issue in a little detail.", "Issue ko thoda detail mein samjhayein."))
    setErr("")
    const created = addReport({
      cat: cat.rep, catKey, state, city,
      pincode: pin, pinVerified: !!(pinState && pinState.ok),
      area, ward, loc: place,
      title: title.trim(), desc: desc.trim(), photo, priority
    })
    setDone(created)
    window.scrollTo(0, 0)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!user) { requireAuth(() => doSubmit()); return }
    doSubmit()
  }

  const reportAnother = () => {
    setDone(null)
    setCatKey(ISSUE_CATS[0].key)
    setPin(""); setPinState(null); setArea(""); setWard(""); setPlace("")
    setTitle(""); setDesc(""); setPriority("Medium"); setPhoto(null); setErr("")
  }

  return (
    <div className="w-full py-8">
      <h1 className="font-display text-3xl sm:text-4xl">{t("Report an Issue", "Issue Report Karein")}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {t("Tell us what is broken in your area. Your report gets a tracking ID, appears in the Community Feed, and its status can be followed here and on your Profile.",
          "Apne area mein jo kharab hai, wo batayein. Aapki report ko ek tracking ID milti hai, wo Community Feed mein dikhti hai, aur uska status yahan aur aapke Profile par follow kar sakte hain.")}
      </p>

      {!user && (
        <div className="mt-5 rounded-2xl border border-cyan-300 bg-cyan-50 p-4">
          <p className="font-semibold text-cyan-900">🔒 {t("Login required to post a report", "Report post karne ke liye login zaroori hai")}</p>
          <p className="mt-1 text-sm text-cyan-800">
            {t("Login keeps reports genuine and lets you track them later. Fill the form, tap the button below, and login opens first. After login you stay on this page and can submit right away.",
              "Login se reports genuine rehti hain aur baad mein aap unhe track kar sakte hain. Form bharein, neeche wala button dabayein, pehle login khulega. Login ke baad aap isi page par rahenge aur turant submit kar sakenge.")}
          </p>
        </div>
      )}

      {done ? (
        <div className="card mt-6 p-6 sm:p-8">
          <p className="text-3xl">✅</p>
          <h2 className="mt-2 font-display text-2xl">{t("Report submitted", "Report submit ho gayi")}</h2>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{t("Your Tracking ID", "Aapki Tracking ID")}</p>
          <p className="font-display text-4xl font-bold text-primary sm:text-5xl">{done.id}</p>
          <p className="mt-3 text-slate-700">
            {cat.rep} • {done.city}{done.area ? ", " + done.area : ""} • {t("Sent to", "Bheja gaya")}: <strong>{DEPT_BY_CAT[done.catKey] || "Nagar Nigam"}</strong>
          </p>
          <div className="mt-4 rounded-2xl bg-cream p-4 text-sm text-slate-700">
            <p className="font-semibold">{t("What happens next", "Aage kya hoga")}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{t("The concerned department reviews your report.", "Sambandhit department aapki report ki review karega.")}</li>
              <li>{t("Status updates (Submitted, In Progress, Resolved) appear on the Community Feed and your Profile.", "Status updates (Submitted, In Progress, Resolved) Community Feed aur aapke Profile par dikhenge.")}</li>
              <li>{t("Neighbours can like, comment and verify the work on the ground.", "Padosi ground par hue kaam ko like, comment aur verify kar sakte hain.")}</li>
            </ol>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => navigate("feed")}>{t("View in Community Feed", "Community Feed mein Dekhein")}</button>
            <button className="btn-ghost" onClick={reportAnother}>{t("Report Another", "Ek Aur Report Karein")}</button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card mt-6 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="lbl">{t("Issue Category", "Issue Category")} *</label>
              <select className="input" value={catKey} onChange={e => setCatKey(e.target.value)}>
                {ISSUE_CATS.map(c => <option key={c.key} value={c.key}>{c.rep}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">{t("Priority", "Priority")}</label>
              <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="lbl">{t("State", "State")} *</label>
              <select className="input" value={state} onChange={e => { const s = e.target.value; setState(s); setCity((INDIA_GEO[s] || [])[0] || "") }}>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">{t("City", "City")} *</label>
              <select className="input" value={city} onChange={e => setCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">{t("PIN Code", "PIN Code")}</label>
              <div className="flex gap-2">
                <input className="input" inputMode="numeric" maxLength="6" value={pin} placeholder="452001"
                  onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setPinState(null) }} />
                <button type="button" className="btn-ghost shrink-0 !px-4 !py-2 text-sm" onClick={verifyPin} disabled={pinBusy}>
                  {pinBusy ? t("Checking...", "Check ho raha hai...") : t("Verify PIN", "PIN Verify Karein")}
                </button>
              </div>
              {pinState && pinState.ok && (
                <p className="mt-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-jgreen">
                  ✓ {pinState.name}, {pinState.district}, {pinState.state}
                </p>
              )}
              {pinState && !pinState.ok && (
                <p className="mt-2 rounded-xl bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800">
                  {t("PIN could not be verified right now, the report can still be submitted.", "PIN abhi verify nahi ho paya, report phir bhi submit ho sakti hai.")}
                </p>
              )}
            </div>
            <div>
              <label className="lbl">{t("Area / Locality", "Area / Locality")}</label>
              <input className="input" value={area} onChange={e => setArea(e.target.value)} placeholder={t("e.g. Vijay Nagar", "jaise Vijay Nagar")} />
            </div>
            <div>
              <label className="lbl">{t("Ward", "Ward")}</label>
              <input className="input" value={ward} onChange={e => setWard(e.target.value)} placeholder={t("e.g. Ward 12", "jaise Ward 12")} />
            </div>
            <div>
              <label className="lbl">{t("Location / Landmark", "Location / Landmark")}</label>
              <input className="input" value={place} onChange={e => setPlace(e.target.value)} placeholder={t("e.g. Main crossing, near bus stand", "jaise Main crossing, bus stand ke paas")} />
            </div>
          </div>

          <div className="mt-4">
            <label className="lbl">{t("Title", "Title")} *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder={t("Short line about the issue", "Issue par ek chhoti si line")} />
          </div>
          <div className="mt-4">
            <label className="lbl">{t("Description", "Description")} *</label>
            <textarea className="input" rows="4" value={desc} onChange={e => setDesc(e.target.value)}
              placeholder={t("Since when is it broken? How are people affected?", "Kab se kharab hai? Logon ko kya dikkat ho rahi hai?")} />
          </div>

          <div className="mt-4">
            <label className="lbl">{t("Photo (optional)", "Photo (optional)")}</label>
            <input type="file" accept="image/*" onChange={onPhoto} className="block w-full text-sm" />
            <p className="mt-1 text-xs text-slate-500">
              {t("Please blur faces and vehicle number plates before publishing the photo.", "Photo publish karne se pehle chehre aur vehicle number plates blur kar dein.")}
            </p>
            {photo && <img src={photo} alt="Report" className="mt-3 max-h-64 w-full rounded-2xl object-cover" />}
          </div>

          {err && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-primary-dark">{err}</p>}

          <button type="submit" className="btn-primary mt-6 w-full justify-center sm:w-auto">
            {user ? t("Submit Report", "Report Submit Karein") : t("Login to Post Report", "Report Post Karne ke Liye Login Karein")}
          </button>
        </form>
      )}

      <h2 className="mt-10 font-display text-2xl">{t("My Reports", "Meri Reports")}</h2>
      {!user ? (
        <p className="mt-3 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          {t("Login to see the reports you have posted.", "Apni bheji hui reports dekhne ke liye login karein.")}
        </p>
      ) : myReports.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          {t("You have not posted any report yet. Your reports will appear here.", "Aapne abhi tak koi report nahi bheji. Aapki reports yahan dikhengi.")}
        </p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {myReports.map(r => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-primary">{r.id}</span>
                <span className={"chip " + (STATUS_STYLE[r.status] || "bg-slate-100 text-slate-700")}>{r.status}</span>
              </div>
              <p className="mt-2 font-semibold">{r.title || r.cat}</p>
              <p className="text-sm text-slate-500">{r.cat} • {r.city}{r.area ? ", " + r.area : ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
