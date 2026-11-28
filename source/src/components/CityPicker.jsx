import { useApp } from '../store'

// City selector chips: every city whose budget is on the platform, plus the
// currently selected city even when its budget has not been added yet.
export default function CityPicker({ goToDashboard = false }) {
  const { t, loc, setLoc, cityBudgets, navigate } = useApp()
  const cities = Object.values(cityBudgets).sort((a, b) => a.city.localeCompare(b.city))
  const currentHasBudget = !!cityBudgets[loc.city]
  const pick = (c) => {
    setLoc({ state: c.state, city: c.city })
    if (goToDashboard) navigate('dashboard')
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {cities.map((c) => {
        const active = c.city === loc.city
        return (
          <button
            key={c.city}
            onClick={() => pick(c)}
            aria-pressed={active}
            className={'rounded-full border px-4 py-2 text-sm font-semibold transition ' + (active ? 'border-primary bg-primary text-white shadow-sm' : 'border-slate-300 bg-white text-ink hover:border-jcyan hover:text-primary')}
          >
            {c.city}
            <span className={'ml-2 text-xs font-medium ' + (active ? 'text-white/75' : 'text-jcyan')}>✓ {t('Budget available', 'Budget uplabdh')}</span>
          </button>
        )
      })}
      {!currentHasBudget && (
        <span className="rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white">
          {loc.city}
          <span className="ml-2 text-xs font-medium text-white/75">{t('Budget not added yet', 'Budget abhi nahi juda')}</span>
        </span>
      )}
    </div>
  )
}
