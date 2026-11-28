import React, { useState } from 'react'
import { useApp } from '../store'
import logoUrl from '../logo'

const DASH_GROUP = [
  ['dashboard', 'Dashboard', 'Dashboard'],
  ['budget', 'Budget Explorer', 'Budget Explorer'],
  ['projects', 'Project Tracker', 'Project Tracker']
]
const LINKS = [
  ['report', 'Report Issue', 'Report Karein'],
  ['feed', 'Community Feed', 'Community Feed'],
  ['work', 'Our Work', 'Hamara Kaam'],
  ['about', 'About Us', 'Humare Baare Mein']
]

export default function Navbar() {
  const { page, navigate, lang, setLang, t, user, setAuthOpen } = useApp()
  const [open, setOpen] = useState(false)
  const go = (p) => { setOpen(false); navigate(p) }
  const dashActive = DASH_GROUP.some(([p]) => p === page)
  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_16px_rgba(26,26,26,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-3 py-3 sm:gap-3 sm:px-6">
        <button onClick={() => go('home')} className="flex items-center gap-2.5 shrink-0" aria-label="JanMoolya Tracker, home">
          <img src={logoUrl} alt="JanMoolya Tracker" className="h-10 w-auto sm:h-14 xl:h-16" />
        </button>
        <nav className="ml-2 hidden items-center gap-2 lg:flex xl:gap-3 2xl:ml-4 2xl:gap-5">
          <button onClick={() => go('home')} className={'navlink whitespace-nowrap text-[13px] xl:text-sm 2xl:text-[15px] ' + (page === 'home' ? 'active' : '')}>{t('Home', 'Home')}</button>
          <div className="group relative">
            <button onClick={() => go('dashboard')} className={'navlink whitespace-nowrap text-[13px] xl:text-sm 2xl:text-[15px] ' + (dashActive ? 'active' : '')}>
              {t('Dashboard', 'Dashboard')} <span className="text-xs">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl bg-white py-2 shadow-xl ring-1 ring-slate-100">
                {DASH_GROUP.map(([p, en, hl]) => (
                  <button key={p} onClick={() => go(p)} className={'block w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-cream ' + (page === p ? 'text-primary' : 'text-ink')}>
                    {t(en, hl)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {LINKS.map(([p, en, hl]) => (
            <button key={p} onClick={() => go(p)} className={'navlink whitespace-nowrap text-[13px] xl:text-sm 2xl:text-[15px] ' + (page === p ? 'active' : '')}>{t(en, hl)}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => go('ai')} className={'hidden items-center gap-2 whitespace-nowrap rounded-full border-2 px-2.5 py-1.5 text-sm md:flex xl:px-3.5 ' + (page === 'ai' ? 'border-primary font-semibold text-primary' : 'border-slate-200 text-slate-600 hover:border-primary')} aria-label="AI Assistant">
            <span>🤖</span><span className="hidden xl:inline">{t('AI Assistant', 'AI Assistant')}</span>
          </button>
          <button onClick={() => go('ai')} className={'rounded-full border-2 px-2.5 py-1.5 max-[399px]:hidden md:hidden ' + (page === 'ai' ? 'border-primary' : 'border-slate-200')} aria-label="AI Assistant">🤖</button>
          <button onClick={() => setLang(lang === 'en' ? 'hl' : 'en')} className="rounded-full border-2 border-slate-200 px-2 py-1.5 text-[11px] font-semibold hover:border-primary sm:px-2.5 sm:text-sm xl:px-3.5">
            {lang === 'en' ? 'Hinglish' : 'English'}
          </button>
          {user ? (
            <button onClick={() => go('profile')} className="btn-primary !px-3 !py-2 text-sm sm:!px-4">👤 {user.name.split(' ')[0]}</button>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="btn-primary whitespace-nowrap !px-2.5 !py-2 text-sm sm:!px-4"><span className="2xl:hidden">{t('Login', 'Login')}</span><span className="hidden 2xl:inline">{t('Login / Sign Up', 'Login / Sign Up')}</span></button>
          )}
          <button className="rounded-lg p-1 text-xl leading-none lg:hidden sm:p-2 sm:text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '✕' : '☰'}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => go('ai')} className={'block w-full rounded-lg px-3 py-2.5 text-left font-medium ' + (page === 'ai' ? 'bg-cream text-primary' : '')}>🤖 {t('AI Assistant', 'AI Assistant')}</button>
          <button onClick={() => go('home')} className={'block w-full rounded-lg px-3 py-2.5 text-left font-medium ' + (page === 'home' ? 'bg-cream text-primary' : '')}>{t('Home', 'Home')}</button>
          <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{t('Dashboard', 'Dashboard')}</p>
          {DASH_GROUP.map(([p, en, hl]) => (
            <button key={p} onClick={() => go(p)} className={'block w-full rounded-lg py-2.5 pl-6 pr-3 text-left font-medium ' + (page === p ? 'bg-cream text-primary' : '')}>{t(en, hl)}</button>
          ))}
          {LINKS.map(([p, en, hl]) => (
            <button key={p} onClick={() => go(p)} className={'block w-full rounded-lg px-3 py-2.5 text-left font-medium ' + (page === p ? 'bg-cream text-primary' : '')}>{t(en, hl)}</button>
          ))}
          {user && <button onClick={() => go('profile')} className="block w-full rounded-lg px-3 py-2.5 text-left font-medium">👤 {t('My Profile', 'Meri Profile')}</button>}
        </nav>
      )}
    </header>
  )
}
