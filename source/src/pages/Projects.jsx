import React, { useMemo, useState } from 'react'
import { useApp } from '../store'
import { INDIA_GEO, ISSUE_CATS, PROJECT_STATUSES, fmtMoney, projectImage } from '../data/seed'
import { projectStats } from './Dashboard'

function catLabel(cat, lang) {
  const c = ISSUE_CATS.find((x) => x.proj === cat)
  if (!c) return cat
  return lang === 'hl' ? c.hl : c.en
}

export default function Projects() {
  const { t, lang, projects, votes, vote, loc, requireAuth } = useApp()
  const [query, setQuery] = useState('')
  const [fState, setFState] = useState('All')
  const [fCity, setFCity] = useState('All')
  const [dept, setDept] = useState('All')
  const [status, setStatus] = useState('All')
  const [budgetRange, setBudgetRange] = useState('any')
  const [sort, setSort] = useState('newest')
  const [expanded, setExpanded] = useState(null)

  const cities = fState === 'All' ? [] : (INDIA_GEO[fState] || [])
  const deptOptions = useMemo(() => [...new Set(projects.map((p) => p.dept))], [projects])


  const changeState = (s) => {
    setFState(s)
    setFCity('All')
  }

  const clearAll = () => {
    setQuery('')
    setFState('All')
    setFCity('All')
    setDept('All')
    setStatus('All')
    setBudgetRange('any')
    setSort('newest')
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = projects.filter((p) => {
      if (fState !== 'All' && p.state !== fState) return false
      if (fCity !== 'All' && p.city !== fCity) return false
      if (dept !== 'All' && p.dept !== dept) return false
      if (status !== 'All' && (p.effStatus || p.status) !== status) return false
      if (budgetRange === 'u50' && !(p.approved < 50)) return false
      if (budgetRange === '50-200' && !(p.approved >= 50 && p.approved <= 200)) return false
      if (budgetRange === '200p' && !(p.approved > 200)) return false
      if (q && !(p.name + ' ' + p.loc + ' ' + p.ward + ' ' + p.dept + ' ' + (p.city || '') + ' ' + (p.state || '') + ' ' + (p.contractor || '') + ' ' + (p.engineer || '') + ' ' + (p.pin || '')).toLowerCase().includes(q)) return false
      return true
    })
    const sorted = [...list]
    if (sort === 'budget-desc') sorted.sort((a, b) => b.approved - a.approved)
    else if (sort === 'budget-asc') sorted.sort((a, b) => a.approved - b.approved)
    else if (sort === 'votes') sorted.sort((a, b) => (projectStats(b, votes).yes + projectStats(b, votes).no) - (projectStats(a, votes).yes + projectStats(a, votes).no))
    else if (sort === 'mismatch') sorted.sort((a, b) => {
      const sa = projectStats(a, votes); const sb = projectStats(b, votes)
      if (sa.mismatch !== sb.mismatch) return sa.mismatch ? -1 : 1
      return sb.spentPct - sa.spentPct
    })
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [projects, query, fState, fCity, dept, status, budgetRange, sort, votes])

  const chips = []
  if (query) chips.push({ label: '"' + query + '"', clear: () => setQuery('') })
  if (fState !== 'All' || fCity !== 'All') chips.push({ label: (fState === 'All' ? t('All States', 'Saare States') : fState) + ' • ' + (fCity === 'All' ? t('All Cities', 'Saare Shehar') : fCity), clear: () => { setFState('All'); setFCity('All') } })
  if (dept !== 'All') chips.push({ label: dept, clear: () => setDept('All') })
  if (status !== 'All') chips.push({ label: status, clear: () => setStatus('All') })
  if (budgetRange !== 'any') chips.push({ label: budgetRange === 'u50' ? t('Under ₹50 Lakh', '₹50 Lakh Se Kam') : budgetRange === '50-200' ? '₹50 Lakh – ₹2 Cr' : t('Above ₹2 Cr', '₹2 Cr Se Zyada'), clear: () => setBudgetRange('any') })

  return (
    <div className="py-8">
      <h1 className="font-display text-3xl font-bold text-ink">{t('Project Tracker', 'Project Tracker')}</h1>
      <p className="mt-1 text-sm text-slate-500">{t('Approved money on paper, real condition on the ground, and your vote on whether the work truly happened.', 'Kagaz par approved paisa, zameen par asli haalat, aur aapka vote ki kaam sach mein hua ya nahi.')}</p>

      {/* Toolbar */}
      <div className="card mt-6 px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="lbl" htmlFor="pq">{t('Search Projects', 'Projects Search Karein')}</label>
            <input id="pq" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Name, place, ward, department...', 'Naam, jagah, ward, department...')} />
          </div>
          <div>
            <label className="lbl" htmlFor="pstate">{t('State', 'State')}</label>
            <select id="pstate" className="input" value={fState} onChange={(e) => changeState(e.target.value)}>
              <option value="All">{t('All States', 'Saare States')}</option>
              {Object.keys(INDIA_GEO).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="pcity">{t('City', 'City')}</label>
            <select id="pcity" className="input" value={fCity} onChange={(e) => setFCity(e.target.value)}>
              <option value="All">{t('All Cities', 'Saare Shehar')}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="pdept">{t('Department', 'Department')}</label>
            <select id="pdept" className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="All">{t('All Departments', 'Saare Departments')}</option>
              {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="pstatus">{t('Project Status', 'Project ki Sthiti')}</label>
            <select id="pstatus" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">{t('All', 'Sab')}</option>
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="pbudget">{t('Budget Range (Approved)', 'Budget Range (Approved)')}</label>
            <select id="pbudget" className="input" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
              <option value="any">{t('Any', 'Koi Bhi')}</option>
              <option value="u50">{t('Under ₹50 Lakh', '₹50 Lakh Se Kam')}</option>
              <option value="50-200">₹50 Lakh – ₹2 Cr</option>
              <option value="200p">{t('Above ₹2 Cr', '₹2 Cr Se Zyada')}</option>
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="psort">{t('Sort By', 'Sort Karein')}</label>
            <select id="psort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">{t('Newest First', 'Sabse Naye Pehle')}</option>
              <option value="budget-desc">{t('Budget: High to Low', 'Budget: Zyada Se Kam')}</option>
              <option value="budget-asc">{t('Budget: Low to High', 'Budget: Kam Se Zyada')}</option>
              <option value="votes">{t('Most Votes', 'Sabse Zyada Votes')}</option>
              <option value="mismatch">{t('Most Mismatch First', 'Mismatch Wale Pehle')}</option>
              <option value="name">{t('Name A-Z', 'Naam A-Z')}</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((c, i) => (
            <button key={i} onClick={c.clear} className="chip bg-cream text-slate-700 hover:bg-secondary/20" title={t('Remove filter', 'Filter Hatayein')}>
              {c.label} ✕
            </button>
          ))}
          <button onClick={clearAll} className="ml-auto text-sm font-semibold text-primary">{t('Clear All', 'Sab Saaf Karein')}</button>
        </div>
        <p className="mt-3 text-sm text-slate-500">{filtered.length} {t('projects found', 'projects mile')}</p>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card mt-6 px-5 py-10 text-center">
          <div className="text-4xl">🔍</div>
          <p className="mt-3 font-semibold text-ink">{t('No projects found', 'Koi project nahi mila')}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            {t('No project matches this search or filter yet. Try another city, or clear the filters to see all projects.', 'Is search ya filter par abhi koi project nahi mila. Doosri city try karein, ya saare projects dekhne ke liye filters saaf kar dein.')}
          </p>
          <button className="btn-ghost mt-5 !px-4 !py-2 text-sm" onClick={clearAll}>{t('Clear All Filters', 'Saare Filters Saaf Karein')}</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const s = projectStats(p, votes)
            const total = s.yes + s.no
            const yesPct = total > 0 ? Math.round((s.yes / total) * 100) : 0
            const myVote = votes[p.id]
            const open = expanded === p.id
            return (
              <article key={p.id} className="card flex flex-col overflow-hidden px-5 py-5">
                {projectImage(p) && <img src={projectImage(p)} alt={p.name} className="-mx-5 -mt-5 mb-4 h-40 w-[calc(100%+2.5rem)] max-w-none object-cover" loading="lazy" />}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold leading-snug text-ink">{p.name}</h3>
                  <span className="flex flex-wrap gap-1.5">
                    <span className={'chip ' + ((p.effStatus || p.status) === 'Delayed' ? 'bg-red-100 text-red-700' : (p.effStatus || p.status) === 'Completed' ? 'bg-green-100 text-green-700' : (p.effStatus || p.status) === 'Not Started' ? 'bg-slate-200 text-slate-600' : 'bg-cyan-100 text-cyan-800')}>{(p.effStatus || p.status || '').toUpperCase()}</span>
                    {s.mismatch && <span className="chip bg-red-100 text-red-700">MISMATCH</span>}
                    {!s.mismatch && s.citizenVerified && <span className="chip bg-green-100 text-green-700">CITIZEN VERIFIED</span>}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{p.loc}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="chip bg-cream text-slate-700">{p.ward}</span>
                  <span className="chip bg-secondary/20 text-slate-700">{catLabel(p.cat, lang)}</span>
                  
                  {p.city && <span className="chip bg-slate-100 text-slate-600">📍 {p.city}{p.state ? ', ' + p.state : ''}</span>}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{t('Approved', 'Approved')} <strong className="text-ink">{fmtMoney(p.approved)}</strong></span>
                    <span className="text-slate-600">{t('Spent', 'Kharch')} <strong className="text-ink">{fmtMoney(p.spent)}</strong></span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className={'h-full rounded-full ' + (s.mismatch ? 'bg-primary' : 'bg-jgreen')} style={{ width: Math.min(100, s.spentPct) + '%' }} />
                  </div>
                  <div className="mt-1 text-right text-xs font-semibold text-slate-500">{s.spentPct}% {t('spent', 'kharch')}</div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-cream px-2 py-2">
                    <div className="font-bold text-ink">{p.paper}</div>
                    <div className="text-xs text-slate-500">{t('On Paper', 'Kagaz Par')}</div>
                  </div>
                  <div className="rounded-lg bg-cream px-2 py-2">
                    <div className="font-bold text-ink">{p.ground}</div>
                    <div className="text-xs text-slate-500">{t('On Ground', 'Zameen Par')}</div>
                  </div>
                </div>

                {typeof p.paperPct === 'number' && typeof p.groundPct === 'number' && (
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">📄 {t('Paper Progress', 'Kagaz Par Progress')}</span><span className="text-ink">{p.paperPct}%</span></div>
                      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-secondary" style={{ width: Math.min(100, p.paperPct) + '%' }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">🏗️ {t('Ground Progress', 'Zameen Par Progress')}</span><span className="text-ink">{p.groundPct}%</span></div>
                      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className={'h-full rounded-full ' + (p.paperPct - p.groundPct >= 30 ? 'bg-primary' : 'bg-jgreen')} style={{ width: Math.min(100, p.groundPct) + '%' }} /></div>
                    </div>
                    {p.paperPct - p.groundPct >= 30 && <p className="text-xs font-bold text-red-600">⚠️ {t('Paper and ground differ by', 'Kagaz aur zameen mein')} {p.paperPct - p.groundPct}% {t('difference', 'ka fark hai')}</p>}
                  </div>
                )}

                {(p.effStatus || p.status) === 'Completed' ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="text-sm font-semibold text-ink">{t('Did the work really happen?', 'Kaam asal mein hua?')}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => requireAuth(() => vote(p.id, 'yes'))} className={'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ' + (myVote === 'yes' ? 'bg-jgreen text-white' : 'border-2 border-jgreen text-jgreen hover:bg-jgreen hover:text-white')}>
                      👍 {t('Yes', 'Haan')} • {s.yes}
                    </button>
                    <button onClick={() => requireAuth(() => vote(p.id, 'no'))} className={'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ' + (myVote === 'no' ? 'bg-primary text-white' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white')}>
                      👎 {t('No', 'Nahi')} • {s.no}
                    </button>
                  </div>
                  <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-primary/70">
                    <div className="h-full bg-jgreen" style={{ width: yesPct + '%' }} />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{yesPct}% {t('say Yes', 'Haan kehte hain')}</span>
                    <span>{total} {t('votes', 'votes')}</span>
                  </div>
                </div>
                ) : (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="text-sm font-semibold text-ink">{t('Did the work really happen?', 'Kaam asal mein hua?')}</div>
                  <p className="mt-1 text-xs text-slate-500">🗳️ {t('Voting opens when the Admin marks this project Completed.', 'Vote tab khulega jab Admin is project ko Completed mark karega.')}</p>
                </div>
                )}

                <button onClick={() => setExpanded(open ? null : p.id)} className="mt-4 text-left text-sm font-semibold text-primary">
                  {open ? t('Hide Details', 'Details Chhupayein') + ' ▴' : t('View Details', 'Details Dekhein') + ' ▾'}
                </button>
                {open && (
                  <div className="mt-3 space-y-1.5 rounded-xl bg-cream px-4 py-3 text-sm text-slate-700">
                    <div><strong>{t('Department', 'Department')}:</strong> {p.dept}</div>
                    {(p.bodyName || p.bodyType) && <div><strong>{t('Money Passed To', 'Paisa Kisko Pass Hua')}:</strong> {p.bodyName || ''}{p.bodyType ? ' (' + p.bodyType + ')' : ''}</div>}
                    {p.sanctionNo && <div><strong>{t('Sanction / Tender No.', 'Sanction / Tender Number')}:</strong> {p.sanctionNo}{p.sanctionDate ? ' • ' + p.sanctionDate : ''}</div>}
                    {p.contractor && <div><strong>{t('Contractor (work being done by)', 'Thekedaar (kaam kar raha hai)')}:</strong> {p.contractor}</div>}
                    {p.engineer && <div><strong>{t('Site Engineer', 'Site Engineer')}:</strong> {p.engineer}</div>}
                    {typeof p.workers === 'number' && <div><strong>{t('Workers on site', 'Site par workers')}:</strong> {p.workers}</div>}
                    {p.city && <div><strong>{t('City', 'Shehar')}:</strong> {p.city}{p.state ? ', ' + p.state : ''}{p.pin ? ' • PIN ' + p.pin : ''}</div>}
                    <div><strong>{t('Duration', 'Samay')}:</strong> {p.dates}</div>
                    {(p.effStatus || p.status) && <div><strong>{t('Project Status', 'Project ki Sthiti')}:</strong> {p.effStatus || p.status}</div>}
                    <div><strong>{t('Ward', 'Ward')}:</strong> {p.ward}</div>
                    {(p.effStatus || p.status) === 'Completed' && <div><strong>{t('Citizen votes', 'Citizen votes')}:</strong> {s.yes} {t('Yes', 'Haan')} / {s.no} {t('No', 'Nahi')}{s.mismatch ? ' • MISMATCH' : s.citizenVerified ? ' • CITIZEN VERIFIED' : ''}</div>}
                    
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
