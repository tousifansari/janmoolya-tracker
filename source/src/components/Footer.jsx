import React from 'react'
import { useApp } from '../store'
import logoUrl from '../logo'

export default function Footer() {
  const { navigate, t } = useApp()
  const platform = [
    ['dashboard', 'Dashboard', 'Dashboard'],
    ['budget', 'Budget Explorer', 'Budget Explorer'],
    ['projects', 'Project Tracker', 'Project Tracker'],
    ['work', 'Our Work', 'Hamara Kaam'],
    ['feed', 'Community Feed', 'Community Feed'],
    ['about', 'About Us', 'Humare Baare Mein']
  ]
  const help = [
    ['report', 'Report Issue', 'Report Karein'],
    ['ai', 'AI Assistant', 'AI Assistant'],
    ['profile', 'My Profile', 'Meri Profile'],
    ['home', 'Home', 'Home']
  ]
  return (
    <footer className="mt-16 bg-ink text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-2xl bg-white p-2.5">
            <img src={logoUrl} alt="JanMoolya Tracker" className="h-12 w-auto" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {t('JanMoolya Tracker connects public money, ground reality and citizen participation in one place, so every citizen can see where their tax money goes.',
              'JanMoolya Tracker public money, zameeni sach aur citizen participation ko ek hi jagah jodta hai, taaki har nagrik dekh sake ki uske tax ka paisa kahan jaata hai.')}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href="https://www.instagram.com/janmoolyatracker" target="_blank" rel="noreferrer" aria-label="JanMoolya Tracker on Instagram" className="flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-secondary hover:text-secondary">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              @janmoolyatracker
            </a>
            <a href="https://x.com/janmoolyatrackr" target="_blank" rel="noreferrer" aria-label="JanMoolya Tracker on X" className="flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-secondary hover:text-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              @janmoolyatrackr
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">{t('Platform', 'Platform')}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {platform.map(([p, en, hl]) => (
              <li key={p}><button className="transition hover:text-secondary" onClick={() => navigate(p)}>{t(en, hl)}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">{t('Get Involved', 'Hissa Banein')}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {help.map(([p, en, hl]) => (
              <li key={p}><button className="transition hover:text-secondary" onClick={() => navigate(p)}>{t(en, hl)}</button></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        {t('An independent student buildathon initiative. Not affiliated with any government body. Figures shown are sample data unless a source is linked.',
          'Ek independent student buildathon initiative. Kisi sarkari sanstha se sambandhit nahi. Dikhaye gaye figures sample data hain, jab tak source link na diya ho.')}
        <div className="mt-1">#TutedudeBuildathon #BuildForMyCity</div>
      </div>
    </footer>
  )
}
