import React, { useEffect, useState } from 'react'
import { useApp } from '../store'
import { INDIA_GEO } from '../data/seed'

export default function AuthModal() {
  const { authOpen, setAuthOpen, completeAuth, loc, t, bannedMobiles } = useApp()
  const [f, setF] = useState({ name: '', age: '', mobile: '', email: '', state: loc.state, city: loc.city })
  const [err, setErr] = useState('')

  useEffect(() => { if (authOpen) setF(prev => ({ ...prev, state: loc.state, city: loc.city })) }, [authOpen, loc])

  useEffect(() => {
    if (!authOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setAuthOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authOpen, setAuthOpen])

  if (!authOpen) return null
  const states = Object.keys(INDIA_GEO)
  const cities = INDIA_GEO[f.state] || []

  const submit = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setErr(t('Please enter your full name.', 'Apna poora naam likhein.'))
    const age = parseInt(f.age, 10)
    if (!age || age < 13 || age > 120) return setErr(t('Age must be between 13 and 120.', 'Age 13 se 120 ke beech honi chahiye.'))
    if (!/^\d{10}$/.test(f.mobile.trim())) return setErr(t('Enter a valid 10-digit mobile number.', 'Sahi 10-digit mobile number likhein.'))
    if ((bannedMobiles || []).includes(f.mobile.trim())) return setErr(t('This mobile number has been blocked by the admin, so an account cannot be created with it.', 'Ye mobile number admin ne block kar diya hai, isse account nahi ban sakta.'))
    if (!f.city) return setErr(t('Please choose your city.', 'Apna shehar chunein.'))
    setErr('')
    completeAuth({ name: f.name.trim(), age, mobile: f.mobile.trim(), email: f.email.trim(), state: f.state, city: f.city })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3" onClick={() => setAuthOpen(false)}>
      <div className="card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl">{t('Login / Sign Up', 'Login / Sign Up')}</h3>
            <p className="mt-1 text-sm text-slate-500">{t('Reports, comments and votes need a free citizen account.', 'Reports, comments aur votes ke liye free citizen account chahiye.')}</p>
          </div>
          <button onClick={() => setAuthOpen(false)} className="text-2xl leading-none">✕</button>
        </div>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div><label className="lbl">{t('Full Name', 'Poora Naam')} *</label>
            <input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Priya Sharma" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl">{t('Age', 'Age')} *</label>
              <input className="input" type="number" min="13" max="120" value={f.age} onChange={e => setF({ ...f, age: e.target.value })} /></div>
            <div><label className="lbl">{t('Mobile (10-digit)', 'Mobile (10-digit)')} *</label>
              <input className="input" inputMode="numeric" maxLength="10" value={f.mobile} onChange={e => setF({ ...f, mobile: e.target.value.replace(/\D/g, '') })} /></div>
          </div>
          <div><label className="lbl">{t('Email / Handle (optional)', 'Email / Handle (optional)')}</label>
            <input className="input" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl">{t('State', 'State')}</label>
              <select className="input" value={f.state} onChange={e => setF({ ...f, state: e.target.value, city: (INDIA_GEO[e.target.value] || [])[0] || '' })}>
                {states.map(s => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className="lbl">{t('City', 'City')}</label>
              <select className="input" value={f.city} onChange={e => setF({ ...f, city: e.target.value })}>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select></div>
          </div>
          {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-primary-dark">{err}</p>}
          <button type="submit" className="btn-primary w-full justify-center">{t('Continue', 'Aage Badhein')}</button>
          <p className="text-center text-xs text-slate-400">{t('Your mobile number is never shown publicly.', 'Aapka mobile number publicly kabhi nahi dikhaya jaata.')}</p>
        </form>
      </div>
    </div>
  )
}
