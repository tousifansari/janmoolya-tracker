import React, { useMemo } from 'react'
import { useApp, catKeyFromLabel } from '../store'
import { CITY_WARDS, ISSUE_CATS, EXPENSE_DEPTS, SEG_COLORS, fmtCr, fmtCrSmart } from '../data/seed'
import CityPicker from '../components/CityPicker'

// Aman (Data team) - Looker Studio embed for the utility expenditure + ML forecast report.
// Real embed link shared by Aman via TINA on 28 Nov 2026 (stray ':' after .com in his snippet cleaned).
const UTILITY_EMBED_URL = 'https://datastudio.google.com/embed/reporting/89b8ef89-e6b4-44db-9326-e1d0381ad03b/page/DyYEG'

export function projectStats(p, votes) {
  const spentPct = p.approved > 0 ? Math.round((p.spent / p.approved) * 100) : 0
  const yes = (p.votesYes || 0) + (votes[p.id] === 'yes' ? 1 : 0)
  const no = (p.votesNo || 0) + (votes[p.id] === 'no' ? 1 : 0)
  const gap = (typeof p.paperPct === 'number' && typeof p.groundPct === 'number') ? p.paperPct - p.groundPct : 0
  // Citizens lead: when more citizens say "not done" than "done" (at least 3 voices), it is a mismatch on its own.
  const citizensSaidNo = no >= 3 && no > yes
  const mismatch = citizensSaidNo || gap >= 30 || (p.paper === 'Complete' && p.ground === 'Not Fixed') || (spentPct >= 80 && no >= yes && no > 0)
  const citizenVerified = !mismatch && yes > no
  return { spentPct, yes, no, gap, citizensSaidNo, mismatch, citizenVerified }
}

function riskChip(risk) {
  if (risk === 'High') return 'bg-red-100 text-red-700'
  if (risk === 'Medium') return 'bg-cyan-100 text-cyan-800'
  return 'bg-green-100 text-green-700'
}

function statusChip(status) {
  if (status === 'Resolved' || status === 'Citizen Verified') return 'bg-green-100 text-green-700'
  if (status === 'In Progress') return 'bg-cyan-100 text-cyan-800'
  return 'bg-slate-200 text-slate-700'
}

export default function Dashboard() {
  const { t, lang, navigate, projects, reports, votes, loc, currentBudget } = useApp()
  const hl = lang === 'hl'

  const openReports = useMemo(() => reports.filter((r) => r.status === 'Submitted' || r.status === 'In Progress').length, [reports])
  const cityWards = CITY_WARDS[loc.city] || []
  const avgScore = cityWards.length ? Math.round(cityWards.reduce((s, w) => s + w.score, 0) / cityWards.length) : 0
  const mismatches = useMemo(() => projects
    .map((p) => ({ p, s: projectStats(p, votes) }))
    .filter((x) => x.s.mismatch)
    .sort((a, b) => (b.s.no - a.s.no) || (b.s.gap - a.s.gap))
    .map((x) => x.p), [projects, votes])

  const catCounts = useMemo(() => {
    return ISSUE_CATS.map((c) => {
      const count = reports.filter((r) => (r.catKey || catKeyFromLabel(r.cat || '')) === c.key).length
      return { ...c, count }
    }).sort((a, b) => b.count - a.count)
  }, [reports])
  const maxCat = Math.max(1, ...catCounts.map((c) => c.count))
  const recent = useMemo(() => [...reports].sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 5), [reports])

  const kpis = [
    { labelEn: 'Projects Tracked', labelHl: 'Projects Track Ho Rahe Hain', value: projects.length },
    { labelEn: 'Open Reports', labelHl: 'Khuli Reports', value: openReports },
    { labelEn: 'Mismatch Alerts', labelHl: 'Mismatch Alerts', value: mismatches.length },
    { labelEn: 'Average City Score', labelHl: 'Average City Score', value: avgScore + '/100' }
  ]

  const steps = [
    { en: 'You pay tax', hl: 'Aap tax dete hain', icon: '🧾' },
    { en: 'Money reaches the city fund', hl: 'Paisa shehar ke khazane mein', icon: '🏛️' },
    { en: 'It is divided among departments', hl: 'Vibhagon mein bant-ta hai', icon: '🧩' },
    { en: 'It becomes projects in your ward', hl: 'Aapke ward mein project banta hai', icon: '🏗️' },
    { en: 'Work should show on the ground', hl: 'Kaam zameen par dikhna chahiye', icon: '📍' }
  ]

  return (
    <div className="py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{t('City Dashboard', 'City Dashboard')}</h1>
          <p className="mt-1 text-sm text-slate-500">📍 {loc.city}, {loc.state}</p>
        </div>
        <button className="btn-ghost !px-4 !py-2 text-sm" onClick={() => navigate('projects')}>{t('Open Project Tracker', 'Project Tracker Kholein')}</button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-600">{t('City:', 'Shehar:')}</span>
        <CityPicker />
      </div>

      {/* Real city budget of the selected city */}
      {currentBudget ? (
        <section className="card mt-6 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('The City Budget at a Glance', 'Shehar ka Budget Ek Nazar Mein')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t((currentBudget.bodyName || currentBudget.city) + ', FY ' + currentBudget.fy + '. The real, approved budget of this city.', (currentBudget.bodyName || currentBudget.city) + ', FY ' + currentBudget.fy + '. Is shehar ka asal approved budget.')}</p>
            </div>
            <span className="chip bg-secondary/20 text-slate-700">{currentBudget.city} • FY {currentBudget.fy}</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-cream px-5 py-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('Total Income (Aaya)', 'Kul Aamdani (Aaya)')}</div>
              <div className="mt-1 text-2xl font-bold text-primary sm:text-3xl">{fmtCrSmart(currentBudget.income)}</div>
              {currentBudget.prevIncome ? <div className="mt-1 text-xs text-slate-500">{t('Last year ' + fmtCrSmart(currentBudget.prevIncome), 'Pichhle saal ' + fmtCrSmart(currentBudget.prevIncome))}</div> : null}
            </div>
            <div className="rounded-2xl bg-cream px-5 py-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('Total Expenditure (Kharch)', 'Kul Kharch')}</div>
              <div className="mt-1 text-2xl font-bold text-primary sm:text-3xl">{fmtCrSmart(currentBudget.expenditure)}</div>
              {currentBudget.prevExpenditure ? <div className="mt-1 text-xs text-slate-500">{t('Last year ' + fmtCrSmart(currentBudget.prevExpenditure), 'Pichhle saal ' + fmtCrSmart(currentBudget.prevExpenditure))}</div> : null}
            </div>
            <div className="rounded-2xl bg-cream px-5 py-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('Deficit (Ghata)', 'Ghata')}</div>
              <div className="mt-1 text-2xl font-bold text-red-700 sm:text-3xl">{fmtCrSmart(currentBudget.deficit != null ? currentBudget.deficit : Math.max(0, Math.round((currentBudget.expenditure - currentBudget.income) * 100) / 100))}</div>
              {currentBudget.reserve ? <div className="mt-1 text-xs text-slate-500">{t('Includes the 5% reserve provision of ' + fmtCrSmart(currentBudget.reserve), 'Isme 5% reserve ka pravadhan ' + fmtCrSmart(currentBudget.reserve) + ' shamil hai')}</div> : null}
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">{hl ? currentBudget.sourceHl : currentBudget.sourceEn}</p>
        </section>
      ) : (
        <section className="card mt-6 px-5 py-6 sm:px-8">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('The City Budget at a Glance', 'Shehar ka Budget Ek Nazar Mein')}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{t('The official budget of ' + loc.city + ' has not been added yet. This is exactly the gap JanMoolya is built to close: for most cities, this account is not visible anywhere. As soon as the budget is added, this page will show it with the same Rs100 template.', loc.city + ' ka official budget abhi joda nahi gaya hai. Yahi woh khali jagah hai jise bharne ke liye JanMoolya bana hai: zyadaatar shehron ka ye hisaab kahin dikhta hi nahi. Budget judte hi ye page usi Rs100 template mein usey dikhayega.')}</p>
          <button className="mt-4 text-sm font-semibold text-primary" onClick={() => navigate('budget')}>{t('See how a city account looks in Budget Explorer', 'Budget Explorer mein dekhein ek shehar ka hisaab kaisa dikhta hai')} →</button>
        </section>
      )}

      {/* The journey of your Rs 100 */}
      <section className="card mt-6 px-5 py-6 sm:px-8">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('The Journey of Your ₹100', 'Aapke ₹100 ka Safar')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('Crores are hard to picture. So we show the same budget as your ₹100.', 'Crore samajhna mushkil hota hai. Isliye hum wahi budget aapke ₹100 mein dikhate hain.')}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.en} className="rounded-2xl bg-cream px-4 py-4 text-center">
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-2 text-xs font-semibold text-ink sm:text-sm">{hl ? s.hl : s.en}</div>
              {i < steps.length - 1 && <div className="mt-1 text-secondary">➜</div>}
            </div>
          ))}
        </div>
        <div className="mt-5 flex h-7 w-full overflow-hidden rounded-full">
          {EXPENSE_DEPTS.map((d, i) => (
            <div key={d.key} style={{ width: d.share + '%', background: SEG_COLORS[i % SEG_COLORS.length] }} title={(hl ? d.nameHl : d.nameEn) + ' ₹' + d.share} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {EXPENSE_DEPTS.slice(0, 5).map((d, i) => (
            <span key={d.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SEG_COLORS[i % SEG_COLORS.length] }} />
              {hl ? d.nameHl : d.nameEn}: <strong className="text-ink">₹{d.share}</strong>
            </span>
          ))}
        </div>
        <button className="mt-4 text-sm font-semibold text-primary" onClick={() => navigate('budget')}>{t('See the full ₹100 breakdown in Budget Explorer', 'Poora ₹100 hisaab Budget Explorer mein dekhein')} →</button>
      </section>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.labelEn} className="card px-5 py-5">
            <div className="text-2xl font-bold text-primary sm:text-3xl">{k.value}</div>
            <div className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{t(k.labelEn, k.labelHl)}</div>
          </div>
        ))}
      </div>

      {/* Mismatch Alerts */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-ink">⚠️ {t('Mismatch Alerts', 'Mismatch Alerts')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('Projects where the paper record and the ground reality do not match. The more citizens vote that the work is not done, the higher the alert rises.', 'Wo projects jahan kagaz ka record aur zameen ki haqiqat match nahi karti. Jitne zyada nagrik vote karte hain ki kaam nahi hua, alert utna upar aata hai.')}</p>
        {mismatches.length === 0 ? (
          <div className="card mt-4 px-5 py-6 text-sm text-slate-600">{t('No mismatch alerts right now.', 'Abhi koi mismatch alert nahi hai.')}</div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {mismatches.map((p) => {
              const s = projectStats(p, votes)
              return (
                <div key={p.id} className="card border-l-4 border-primary px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-ink">{p.name}</h3>
                    <span className="chip bg-red-100 text-red-700">MISMATCH</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{p.ward} • {p.loc}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-cream px-2 py-2"><div className="font-bold text-ink">{s.spentPct}%</div><div className="text-xs text-slate-500">{t('Budget Spent', 'Budget Kharch')}</div></div>
                    <div className="rounded-lg bg-cream px-2 py-2"><div className="font-bold text-ink">{p.paper}</div><div className="text-xs text-slate-500">{t('On Paper', 'Kagaz Par')}</div></div>
                    <div className="rounded-lg bg-cream px-2 py-2"><div className="font-bold text-ink">{p.ground}</div><div className="text-xs text-slate-500">{t('On Ground', 'Zameen Par')}</div></div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-red-700">👎 {s.no} {t('citizens voted: work not done', 'nagrikon ka vote: kaam nahi hua')} <span className="font-medium text-slate-500">• 👍 {s.yes} {t('said done', 'ne kaha ho gaya')}</span></p>
                  <button className="mt-4 text-sm font-semibold text-primary" onClick={() => navigate('projects')}>{t('See in Project Tracker', 'Project Tracker Mein Dekhein')} →</button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Ward Comparison */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-ink">{t('Ward Comparison', 'Ward Tulna')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cityWards.map((w) => {
            const pct = w.allocated > 0 ? Math.round((w.spent / w.allocated) * 100) : 0
            return (
              <div key={w.id} className="card px-5 py-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-ink">{w.name}</h3>
                  <span className={'chip ' + riskChip(w.risk)}>{w.risk} Risk</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="text-3xl font-bold text-ink">{w.score}<span className="text-base text-slate-400">/100</span></div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-jgreen" style={{ width: w.score + '%' }} />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {t('Allocated', 'Aavantit')} <strong>₹{w.allocated} Cr</strong> • {t('Spent', 'Kharch')} <strong>₹{w.spent} Cr</strong> ({pct}%)
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-secondary" style={{ width: pct + '%' }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(hl ? w.issuesHl : w.issues).map((i) => (
                    <span key={i} className="chip bg-cream text-slate-700">{i}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-500">{hl ? w.noteHl : w.note}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Issue Category Breakdown */}
        <section className="card px-5 py-6">
          <h2 className="font-display text-xl font-bold text-ink">{t('Issue Category Breakdown', 'Samasya Category Breakdown')}</h2>
          <div className="mt-4 space-y-3">
            {catCounts.map((c) => (
              <div key={c.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{hl ? c.hl : c.en}</span>
                  <span className="font-semibold text-slate-500">{c.count}</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-primary" style={{ width: (c.count / maxCat) * 100 + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Reports */}
        <section className="card px-5 py-6">
          <h2 className="font-display text-xl font-bold text-ink">{t('Recent Reports', 'Haal Ki Reports')}</h2>
          <div className="mt-4 space-y-3">
            {recent.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-3 rounded-xl bg-cream px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink">{r.title || r.cat}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{r.area || r.loc || ''}{r.city ? ' • ' + r.city : ''} • {r.id}</div>
                </div>
                <span className={'chip shrink-0 ' + statusChip(r.status)}>{r.status}</span>
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm text-slate-500">{t('No reports yet.', 'Abhi koi report nahi hai.')}</p>}
          </div>
          <button className="mt-4 text-sm font-semibold text-primary" onClick={() => navigate('feed')}>{t('See all in Community Feed', 'Community Feed Mein Sab Dekhein')} →</button>
        </section>
      </div>

      {/* City Utility Expenditure & ML Budget Forecast (Looker Studio, by the Data team) */}
      <section className="card mt-10 px-5 py-6 sm:px-8">
        <span className="inline-flex items-center rounded-full bg-jcyan/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
          ● {t('LIVE ML BUDGET & UTILITY FORECAST', 'LIVE ML BUDGET & UTILITY FORECAST')}
        </span>
        <h2 className="font-display mt-2 text-xl font-bold text-ink sm:text-2xl">{t('City Utility Expenditure & 6-Month ML Budget Forecast', 'Shehar Ka Utility Kharch & 6-Mahine Ka ML Budget Forecast')}</h2>
        <p className="mt-1 text-sm text-slate-600">{t('Verified historical municipal utility spending compared against AI-predicted water, wastewater, and electricity expenses.', 'Purana verified nagar utility kharch, AI dwara anumaanit paani, gutter-paani aur bijli ke kharch ke saath tulna mein.')}</p>

        <div className="relative mt-4 h-[540px] w-full overflow-hidden rounded-xl border border-slate-200 md:h-[680px] lg:h-[750px]">
          <iframe
            src={UTILITY_EMBED_URL}
            title="City Utility Expenditure & ML Budget Forecast"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-cream p-4 text-sm text-slate-700">
          <p className="font-semibold text-ink">📊 {t('How to Read This Dashboard:', 'Is Dashboard Ko Kaise Padhein:')}</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>{t('Actual Historical Spend:', 'Asli Purana Kharch:')}</strong> {t('Verified rupee expenditure recorded across past municipal water supply, sewage treatment (STP), and public electricity bills.', 'Pichhle nagar paani supply, sewage treatment (STP) aur public bijli billon par darj verified kharch (rupayon mein).')}</li>
            <li><strong>{t('ML Predicted 6-Month Spend:', 'ML Anumaanit 6-Mahine Ka Kharch:')}</strong> {t('Projected upcoming utility costs calculated by our machine learning model using seasonal weather and consumption trends.', 'Humare machine learning model dwara mausam aur khapat ke trend se hisaab kiya gaya aane wala utility kharch.')}</li>
            <li><strong>{t('Expense Trend Line:', 'Kharch Trend Line:')}</strong> {t('Tracks past spending alongside future projections so citizens and ward officials can spot seasonal spikes, water leaks, and budget gaps before deficits occur.', 'Purane kharch ko aane wale anumaan ke saath dikhati hai, taaki nagrik aur ward adhikari mausami badhotri, paani leak aur budget ki kammi ko ghata hone se pehle pakad sakein.')}</li>
          </ul>
        </div>
      </section>

    </div>
  )
}
