import React, { useMemo, useState } from 'react'
import { useApp } from '../store'
import { CITY_WARDS, INCOME_HEADS, EXPENSE_DEPTS, SEG_COLORS, fmtCr, fmtCr1, fmtCrSmart, shareAmt, projectImage } from '../data/seed'
import CityPicker from '../components/CityPicker'

export default function Budget() {
  const { t, lang, navigate, projects, currentBudget, loc } = useApp()
  const hl = lang === 'hl'
  const cb = currentBudget
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')
  const [allocRange, setAllocRange] = useState('any')
  const [expRange, setExpRange] = useState('any')

  const q = query.trim().toLowerCase()

  const depts = useMemo(() => {
    return EXPENSE_DEPTS.filter((d) => {
      if (dept !== 'All' && d.key !== dept) return false
      if (q && !((hl ? d.nameHl : d.nameEn) + ' ' + d.nameEn).toLowerCase().includes(q)) return false
      return true
    })
  }, [dept, q, hl])

  const wards = useMemo(() => {
    return (CITY_WARDS[loc.city] || []).filter((w) => {
      if (q && !(w.name + ' ' + w.breakdown.map((b) => b[0]).join(' ')).toLowerCase().includes(q)) return false
      if (allocRange === 'u18' && !(w.allocated < 18)) return false
      if (allocRange === '18-21' && !(w.allocated >= 18 && w.allocated <= 21)) return false
      if (allocRange === '21p' && !(w.allocated > 21)) return false
      if (expRange === 'u10' && !(w.spent < 10)) return false
      if (expRange === '10-13' && !(w.spent >= 10 && w.spent <= 13)) return false
      if (expRange === '13p' && !(w.spent > 13)) return false
      return true
    })
  }, [q, allocRange, expRange, loc.city])

  const projByDept = useMemo(() => {
    const map = {}
    projects.forEach((p) => { if (p.dept) { (map[p.dept] = map[p.dept] || []).push(p) } })
    return map
  }, [projects])

  const nothingFound = depts.length === 0 && wards.length === 0
  const deficit = cb ? (cb.deficit != null ? cb.deficit : Math.max(0, Math.round((cb.expenditure - cb.income) * 100) / 100)) : 0

  return (
    <div className="py-8">
      <h1 className="font-display text-3xl font-bold text-ink">{t('Budget Explorer', 'Budget Explorer')}</h1>
      <p className="mt-1 text-sm text-slate-500">{t('Where the city money comes from, and where it goes, in simple language.', 'Shehar ka paisa kahan se aata hai aur kahan jaata hai, aasan bhasha mein.')}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-600">{t('City:', 'Shehar:')}</span>
        <CityPicker />
      </div>

      {/* The full account of the selected city */}
      {cb ? (
        <section className="card mt-6 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('The Full Account', 'Poora Hisaab')} • {cb.city}</h2>
              <p className="mt-1 text-sm text-slate-500">{t((cb.bodyName || cb.bodyType || cb.city) + '. Approved figures' + (cb.prevFy ? ', this year and last year.' : '.'), (cb.bodyName || cb.bodyType || cb.city) + '. Approved rakam' + (cb.prevFy ? ', is saal aur pichhle saal.' : '.'))}</p>
            </div>
            <span className="chip bg-secondary/20 text-slate-700">FY {cb.fy}</span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-semibold">{t('Item', 'Mad')}</th>
                  <th className="py-2 pr-4 font-semibold">FY {cb.fy}</th>
                  {cb.prevFy && <th className="py-2 font-semibold">FY {cb.prevFy}</th>}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-ink">{t('Total Income (Aamdani)', 'Kul Aamdani')}</td>
                  <td className="py-3 pr-4 font-bold text-primary">{fmtCrSmart(cb.income)}</td>
                  {cb.prevFy && <td className="py-3 text-slate-600">{cb.prevIncome ? fmtCrSmart(cb.prevIncome) : '-'}</td>}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-ink">{t('Total Expenditure (Kharch)', 'Kul Kharch')}</td>
                  <td className="py-3 pr-4 font-bold text-primary">{fmtCrSmart(cb.expenditure)}</td>
                  {cb.prevFy && <td className="py-3 text-slate-600">{cb.prevExpenditure ? fmtCrSmart(cb.prevExpenditure) : '-'}</td>}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-ink">{t('Deficit (Ghata)', 'Ghata')}</td>
                  <td className="py-3 pr-4 font-bold text-red-700">{fmtCrSmart(deficit)}</td>
                  {cb.prevFy && <td className="py-3 text-slate-600">-</td>}
                </tr>
              </tbody>
            </table>
          </div>
          {cb.reserve ? <p className="mt-3 text-xs text-slate-500">{t('The deficit includes a 5% reserve provision of ' + fmtCrSmart(cb.reserve) + ', kept aside by rule.', 'Ghate mein niyam ke hisaab se rakha gaya 5% reserve pravadhan ' + fmtCrSmart(cb.reserve) + ' shamil hai.')}</p> : null}
          <p className="mt-1 text-xs text-slate-400">{hl ? cb.sourceHl : cb.sourceEn}</p>
        </section>
      ) : (
        <section className="card mt-6 px-5 py-6 sm:px-8">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('The Full Account', 'Poora Hisaab')} • {loc.city}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{t('The official budget of ' + loc.city + ' has not been added yet, so there is no account to show. For most Indian cities this account is not visible anywhere at all. JanMoolya uses one template for every city: as soon as a city budget is added, its full account appears here in the same simple Rs100 language.', loc.city + ' ka official budget abhi joda nahi gaya hai, isliye dikhane ke liye koi hisaab nahi hai. Bharat ke zyadaatar shehron ka ye hisaab kahin dikhta hi nahi. JanMoolya har shehar ke liye ek hi template use karta hai: budget judte hi uska poora hisaab yahan usi aasan Rs100 bhasha mein aa jayega.')}</p>
          <p className="mt-3 text-sm text-slate-500">{t('Below you can still see the Rs100 template and the projects being tracked.', 'Neeche aap Rs100 template aur track ho rahe projects dekh sakte hain.')}</p>
        </section>
      )}

      {/* Search and filters */}
      <div className="card mt-6 px-5 py-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="lbl" htmlFor="bq">{t('Search', 'Search Karein')}</label>
            <input id="bq" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Department, ward, head...', 'Department, ward, head...')} />
          </div>
          <div>
            <label className="lbl" htmlFor="bdept">{t('Department', 'Department')}</label>
            <select id="bdept" className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="All">{t('All Departments', 'Saare Departments')}</option>
              {EXPENSE_DEPTS.map((d) => <option key={d.key} value={d.key}>{hl ? d.nameHl : d.nameEn}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="balloc">{t('Ward Allocation Range', 'Ward Allocation Range')}</label>
            <select id="balloc" className="input" value={allocRange} onChange={(e) => setAllocRange(e.target.value)}>
              <option value="any">{t('Any', 'Koi Bhi')}</option>
              <option value="u18">{t('Under ₹18 Cr', '₹18 Cr Se Kam')}</option>
              <option value="18-21">₹18-21 Cr</option>
              <option value="21p">₹21 Cr+</option>
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="bexp">{t('Ward Expenditure Range', 'Ward Kharch Range')}</label>
            <select id="bexp" className="input" value={expRange} onChange={(e) => setExpRange(e.target.value)}>
              <option value="any">{t('Any', 'Koi Bhi')}</option>
              <option value="u10">{t('Under ₹10 Cr', '₹10 Cr Se Kam')}</option>
              <option value="10-13">₹10-13 Cr</option>
              <option value="13p">₹13 Cr+</option>
            </select>
          </div>
        </div>
        {(query || dept !== 'All' || allocRange !== 'any' || expRange !== 'any') && (
          <button className="mt-4 text-sm font-semibold text-primary" onClick={() => { setQuery(''); setDept('All'); setAllocRange('any'); setExpRange('any') }}>
            {t('Clear All Filters', 'Saare Filters Saaf Karein')}
          </button>
        )}
      </div>

      {nothingFound ? (
        <div className="card mt-6 px-5 py-10 text-center">
          <div className="text-4xl">🔍</div>
          <p className="mt-3 font-semibold text-ink">{t('Nothing found in the records', 'Records mein kuch nahi mila')}</p>
          <p className="mt-1 text-sm text-slate-500">{t('Try a different search word or clear the filters.', 'Doosra search shabd try karein ya filters saaf karein.')}</p>
        </div>
      ) : (
        <>
          {/* Where the money comes from */}
          {cb && (
            <section className="card mt-6 px-5 py-6 sm:px-8">
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('Where the Money Comes From', 'Paisa Aata Kahan Se Hai')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t('Out of every ₹100 the city receives (' + fmtCrSmart(cb.income) + ' in total):', 'Shehar ko milne wale har ₹100 mein se (kul ' + fmtCrSmart(cb.income) + '):')}</p>
              <div className="mt-4 flex h-7 w-full overflow-hidden rounded-full">
                {INCOME_HEADS.map((h, i) => (
                  <div key={h.key} style={{ width: h.share + '%', background: SEG_COLORS[i % SEG_COLORS.length] }} title={(hl ? h.nameHl : h.nameEn) + ' ₹' + h.share} />
                ))}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {INCOME_HEADS.map((h, i) => (
                  <div key={h.key} className="rounded-2xl bg-cream px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-2 font-semibold text-ink">
                        <span className="inline-block h-3 w-3 rounded-sm" style={{ background: SEG_COLORS[i % SEG_COLORS.length] }} />
                        {hl ? h.nameHl : h.nameEn}
                      </span>
                      <span className="text-right">
                        <span className="block font-bold text-primary">₹{h.share} <span className="text-xs font-medium text-slate-500">{t('of ₹100', 'har ₹100 mein')}</span></span>
                        <span className="block text-xs font-semibold text-slate-600">{fmtCr1(shareAmt(cb.income, h.share))}</span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{hl ? h.noteHl : h.noteEn}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Where the money goes */}
          {depts.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-ink">{t('Where the Money Goes', 'Paisa Jaata Kahan Hai')}</h2>
              <p className="mt-1 text-sm text-slate-500">{cb
                ? t('Out of every ₹100 the city spends (' + fmtCrSmart(cb.expenditure) + ' in total). The total is from the official budget; the department split is a simple model in the standard municipal heads, because the corporation does not publish one combined department-wise total.', 'Shehar ke kharch ke har ₹100 mein se (kul ' + fmtCrSmart(cb.expenditure) + '). Kul rakam official budget se hai; vibhagon ka vibhajan standard nagar heads mein banaya gaya ek saral model hai, kyunki Nagar Nigam department-wise kul kharch ek saath prakashit nahi karta.')
                : t('The Rs100 template: out of every ₹100 a city spends, this is the simple model split in the standard municipal heads. It applies to any city budget added to JanMoolya.', 'Rs100 template: koi bhi shehar kharch ke har ₹100 mein se, ye standard nagar heads mein banaya gaya saral model vibhajan hai. Ye JanMoolya mein jude har shehar ke budget par lagu hota hai.')}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {depts.map((d) => {
                  const idx = EXPENSE_DEPTS.findIndex((x) => x.key === d.key)
                  const list = d.dept ? (projByDept[d.dept] || []) : []
                  return (
                    <div key={d.key} className="card px-5 py-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display inline-flex items-center gap-2 text-lg font-bold text-ink">
                          <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: SEG_COLORS[idx % SEG_COLORS.length] }} />
                          {hl ? d.nameHl : d.nameEn}
                        </h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">₹{d.share} <span className="text-xs font-medium text-slate-500">{t('of ₹100', 'har ₹100 mein')}</span></div>
                          {cb && <div className="text-xs font-semibold text-slate-600">{fmtCr1(shareAmt(cb.expenditure, d.share))}</div>}
                        </div>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full" style={{ width: d.share + '%', background: SEG_COLORS[idx % SEG_COLORS.length] }} />
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{hl ? d.noteHl : d.noteEn}</p>
                      {list.length > 0 && (
                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('Projects of this department on JanMoolya', 'JanMoolya par is vibhag ke projects')}</div>
                          <div className="mt-2 space-y-2.5">
                            {list.slice(0, 3).map((p) => (
                              <div key={p.id} className="flex gap-3 rounded-xl bg-cream px-3 py-2.5">
                                {projectImage(p) && <img src={projectImage(p)} alt={p.name} className="h-14 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2 text-sm">
                                    <span className="font-semibold text-ink">{p.name}</span>
                                    <span className="shrink-0 text-xs text-slate-500">{p.city}</span>
                                  </div>
                                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-600">
                                    <span>{t('Paper', 'Kagaz')} {p.paperPct}%</span>
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-primary" style={{ width: (p.paperPct || 0) + '%' }} /></div>
                                    <span>{t('Ground', 'Zameen')} {p.groundPct}%</span>
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-secondary" style={{ width: (p.groundPct || 0) + '%' }} /></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button className="mt-3 text-sm font-semibold text-primary" onClick={() => navigate('projects')}>{t('See in Project Tracker', 'Project Tracker Mein Dekhein')} →</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Ward Budgets */}
          {wards.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-ink">{t('Ward Budgets', 'Ward Budgets')}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {wards.map((w) => {
                  const pct = w.allocated > 0 ? Math.round((w.spent / w.allocated) * 100) : 0
                  return (
                    <div key={w.id} className="card px-5 py-5">
                      <h3 className="font-display text-lg font-bold text-ink">{w.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {t('Allocated', 'Aavantit')} <strong>₹{w.allocated} Cr</strong> • {t('Spent', 'Kharch')} <strong>₹{w.spent} Cr</strong> ({pct}%)
                      </p>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-jgreen" style={{ width: pct + '%' }} />
                      </div>
                      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                        {w.breakdown.map(([head, amt]) => (
                          <div key={head} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{head}</span>
                            <span className="font-semibold text-ink">₹{amt} Cr</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}

    </div>
  )
}
