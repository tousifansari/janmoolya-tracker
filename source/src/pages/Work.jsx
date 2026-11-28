import React, { useMemo, useState } from 'react'
import { useApp } from '../store'
import { INDIA_GEO, isSuccessful, ratingOf, fmtMoney, projectImage } from '../data/seed'

export function Stars({ avg, size = 'text-lg' }) {
  const full = Math.round(avg)
  return (
    <span className={size + ' leading-none tracking-tight text-amber-500'} aria-label={avg + ' out of 5 stars'}>
      {'★★★★★'.slice(0, full)}<span className="text-slate-300">{'★★★★★'.slice(0, 5 - full)}</span>
    </span>
  )
}

function WorkCard({ p, rank, list, t, hl, onFeedback }) {
  const { user, requireAuth } = useApp()
  const [open, setOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [loginHint, setLoginHint] = useState(false)
  const r = ratingOf(list)

  const doSubmit = () => {
    onFeedback(p.id, { name: name.trim(), stars, text: text.trim(), ts: Date.now() })
    setName(''); setText(''); setStars(5); setDone(true); setLoginHint(false)
    setTimeout(() => setDone(false), 3000)
  }
  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    if (!user) { setLoginHint(true); requireAuth(() => doSubmit()); return }
    doSubmit()
  }

  const img = projectImage(p)
  return (
    <article className="card flex flex-col overflow-hidden px-5 py-5">
      {img && <img src={img} alt={p.name} className="-mx-5 -mt-5 mb-4 h-44 w-[calc(100%+2.5rem)] max-w-none object-cover" loading="lazy" />}
      <div className="flex items-start justify-between gap-2">
        <span className="chip bg-navy text-white">#{rank} {t('Top Rated', 'Top Rated')}</span>
        <span className="chip bg-green-100 text-green-700">✓ {t('COMPLETED', 'COMPLETED')}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink">{p.name}</h3>
      <p className="mt-1 text-sm text-slate-500">📍 {p.city}{p.state ? ', ' + p.state : ''} • {p.ward}</p>

      <div className="mt-3 flex items-center gap-2">
        <Stars avg={r.avg} />
        <span className="font-bold text-ink">{r.avg.toFixed(1)}</span>
        <span className="text-xs text-slate-500">({r.count} {t('citizen feedbacks', 'citizen feedbacks')})</span>
      </div>

      <div className="mt-4 space-y-2.5">
        <div>
          <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">📄 {t('Paper Progress', 'Kagaz Par Progress')}</span><span className="text-ink">{p.paperPct}%</span></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-secondary" style={{ width: Math.min(100, p.paperPct || 0) + '%' }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">🏗️ {t('Ground Progress', 'Zameen Par Progress')}</span><span className="text-ink">{p.groundPct}%</span></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-jgreen" style={{ width: Math.min(100, p.groundPct || 0) + '%' }} /></div>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-slate-600">{t('Sanctioned', 'Sanction')} <strong className="text-ink">{fmtMoney(p.approved)}</strong></span>
        <span className="text-slate-600">{t('Spent', 'Kharch')} <strong className="text-ink">{fmtMoney(p.spent)}</strong></span>
      </div>
      <p className="mt-2 text-sm text-slate-600">👍 {p.votesYes || 0} {t('citizens confirmed the work', 'nagrikon ne kaam ki pushti ki')} • 👎 {p.votesNo || 0}</p>

      <button onClick={() => setOpen(!open)} className="mt-4 text-left text-sm font-semibold text-primary">
        {open ? t('Hide Details', 'Details Chhupayein') + ' ▴' : t('Full Details', 'Poori Detail') + ' ▾'}
      </button>
      {open && (
        <div className="mt-3 space-y-1.5 rounded-xl bg-cream px-4 py-3 text-sm text-slate-700">
          <div><strong>{t('Department', 'Department')}:</strong> {p.dept}</div>
          {(p.bodyName || p.bodyType) && <div><strong>{t('Money Passed To', 'Paisa Kisko Pass Hua')}:</strong> {p.bodyName || ''}{p.bodyType ? ' (' + p.bodyType + ')' : ''}</div>}
          {p.sanctionNo && <div><strong>{t('Sanction / Tender No.', 'Sanction / Tender Number')}:</strong> {p.sanctionNo}{p.sanctionDate ? ' • ' + p.sanctionDate : ''}</div>}
          {p.contractor && <div><strong>{t('Contractor (work done by)', 'Thekedaar (kaam kisne kiya)')}:</strong> {p.contractor}</div>}
          {p.engineer && <div><strong>{t('Site Engineer', 'Site Engineer')}:</strong> {p.engineer}</div>}
          {typeof p.workers === 'number' && <div><strong>{t('Workers on site', 'Site par workers')}:</strong> {p.workers}</div>}
          <div><strong>{t('Duration', 'Samay')}:</strong> {p.dates}</div>
          <div><strong>{t('Area / PIN', 'Area / PIN')}:</strong> {p.area || p.ward}{p.pin ? ' • ' + p.pin : ''}</div>
          
        </div>
      )}

      {/* Citizen feedback */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="text-sm font-semibold text-ink">💬 {t('Citizen Feedback', 'Citizen Feedback')}</div>
        <div className="mt-2 space-y-2.5">
          {list.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 4).map((f, i) => (
            <div key={i} className="rounded-xl bg-cream px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{f.name}</span>
                <Stars avg={f.stars} size="text-sm" />
              </div>
              <p className="mt-1 text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-slate-500">{t('No feedback yet. Be the first to rate this work.', 'Abhi koi feedback nahi. Is kaam ko rate karne wale pehle aap banein.')}</p>}
        </div>
        {!formOpen ? (
          <button onClick={() => setFormOpen(true)} className="btn-ghost mt-3 !px-4 !py-2 text-sm">⭐ {t('Give Your Feedback', 'Apna Feedback Dein')}</button>
        ) : (
          <form onSubmit={submit} className="mt-3 space-y-2.5 rounded-xl border border-slate-100 px-3 py-3">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Your name', 'Aapka naam')} />
            <div className="flex items-center gap-1">
              <span className="mr-1 text-sm text-slate-600">{t('Your rating:', 'Aapki rating:')}</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setStars(n)} className={'text-2xl leading-none ' + (n <= stars ? 'text-amber-500' : 'text-slate-300')} aria-label={n + ' stars'}>★</button>
              ))}
              <span className="ml-1 text-sm font-semibold text-ink">{stars}/5</span>
            </div>
            <textarea className="input" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('How is this work on the ground?', 'Zameen par ye kaam kaisa hai?')} />
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary !px-4 !py-2 text-sm">{t('Submit Feedback', 'Feedback Bhejein')}</button>
              {loginHint && !user && (
                <p className="text-xs font-medium text-cyan-800">{t('Feedback needs a login. Your text is saved here - login, then tap Submit Feedback once more.', 'Feedback ke liye login zaroori hai. Aapka text yahin saved hai - login karein, phir Submit Feedback ek baar aur dabayein.')}</p>
              )}
              <button type="button" onClick={() => setFormOpen(false)} className="text-sm font-semibold text-slate-500">{t('Cancel', 'Cancel')}</button>
            </div>
            {done && <p className="text-sm font-semibold text-jgreen">✓ {t('Thank you! Your feedback is now part of this work\u2019s rating.', 'Dhanyavaad! Aapka feedback ab is kaam ki rating ka hissa hai.')}</p>}
          </form>
        )}
      </div>
    </article>
  )
}

export default function Work() {
  const { t, lang, projects, feedbacks, addFeedback } = useApp()
  const hl = lang === 'hl'
  const [query, setQuery] = useState('')
  const [fState, setFState] = useState('All')
  const [fCity, setFCity] = useState('All')
  const [sort, setSort] = useState('rating')

  const successful = useMemo(() => projects.filter(isSuccessful), [projects])
  const citiesCount = useMemo(() => new Set(successful.map((p) => p.city)).size, [successful])
  const totalFeedbacks = useMemo(() => successful.reduce((s, p) => s + (feedbacks[p.id] || []).length, 0), [successful, feedbacks])
  const cities = fState === 'All' ? [] : (INDIA_GEO[fState] || [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = successful.filter((p) => {
      if (fState !== 'All' && p.state !== fState) return false
      if (fCity !== 'All' && p.city !== fCity) return false
      if (q && !(p.name + ' ' + (p.city || '') + ' ' + (p.ward || '') + ' ' + (p.dept || '')).toLowerCase().includes(q)) return false
      return true
    })
    const withR = filtered.map((p) => ({ p, r: ratingOf(feedbacks[p.id] || []) }))
    if (sort === 'rating') withR.sort((a, b) => (b.r.avg - a.r.avg) || (b.r.count - a.r.count))
    else if (sort === 'feedback') withR.sort((a, b) => b.r.count - a.r.count)
    else if (sort === 'newest') withR.sort((a, b) => String(b.p.end || '').localeCompare(String(a.p.end || '')))
    return withR.map((x) => x.p)
  }, [successful, query, fState, fCity, sort, feedbacks])

  return (
    <div className="py-8">
      <h1 className="font-display text-3xl font-bold text-ink">{t('Our Work', 'Hamara Kaam')}</h1>
      <p className="mt-1 max-w-3xl text-sm text-slate-500">{t('Successful work, proven on the ground. A project reaches this page only when it is Completed, its Ground Progress is 80% or more, and more citizens voted Yes than No. The system decides this itself, and citizens rate every work with stars.', 'Safal kaam, zameen par saabit. Koi project is page par tabhi aata hai jab wo Completed ho, uski Ground Progress 80% ya zyada ho, aur Nahi se zyada nagrikon ne Haan vote diya ho. Ye system khud tay karta hai, aur har kaam ko nagrik stars se rate karte hain.')}</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="card px-5 py-5 text-center"><div className="text-2xl font-bold text-primary sm:text-3xl">{successful.length}</div><div className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{t('Successful Projects', 'Safal Projects')}</div></div>
        <div className="card px-5 py-5 text-center"><div className="text-2xl font-bold text-primary sm:text-3xl">{citiesCount}</div><div className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{t('Cities', 'Shehar')}</div></div>
        <div className="card px-5 py-5 text-center"><div className="text-2xl font-bold text-primary sm:text-3xl">{totalFeedbacks}</div><div className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{t('Citizen Feedbacks', 'Citizen Feedbacks')}</div></div>
      </div>

      <div className="card mt-6 px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="lbl" htmlFor="wq">{t('Search Work', 'Kaam Search Karein')}</label>
            <input id="wq" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Project, ward, department...', 'Project, ward, department...')} />
          </div>
          <div>
            <label className="lbl" htmlFor="wstate">{t('State', 'State')}</label>
            <select id="wstate" className="input" value={fState} onChange={(e) => { setFState(e.target.value); setFCity('All') }}>
              <option value="All">{t('All States', 'Saare States')}</option>
              {Object.keys(INDIA_GEO).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="wcity">{t('City', 'City')}</label>
            <select id="wcity" className="input" value={fCity} onChange={(e) => setFCity(e.target.value)}>
              <option value="All">{t('All Cities', 'Saare Shehar')}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="wsort">{t('Ranking', 'Ranking')}</label>
            <select id="wsort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rating">{t('Top Rated First (Stars)', 'Sabse Zyada Stars Pehle')}</option>
              <option value="feedback">{t('Most Feedback First', 'Sabse Zyada Feedback Pehle')}</option>
              <option value="newest">{t('Recently Completed First', 'Haal Mein Poora Hua Pehle')}</option>
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">{list.length} {t('successful projects found', 'safal projects mile')}</p>
      </div>

      {list.length === 0 ? (
        <div className="card mt-6 px-5 py-10 text-center">
          <div className="text-4xl">🏗️</div>
          <p className="mt-3 font-semibold text-ink">{t('No successful work here yet', 'Yahan abhi koi safal kaam nahi hai')}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{t('No completed, citizen-verified work matches this place yet. As work finishes and citizens verify it, it will appear on this page on its own.', 'Is jagah par abhi koi poora hua, citizen-verified kaam nahi mila. Jaise kaam poora hoga aur nagrik use verify karenge, wo apne aap is page par aa jayega.')}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <WorkCard key={p.id} p={p} rank={i + 1} list={feedbacks[p.id] || []} t={t} hl={hl} onFeedback={addFeedback} />
          ))}
        </div>
      )}
    </div>
  )
}
