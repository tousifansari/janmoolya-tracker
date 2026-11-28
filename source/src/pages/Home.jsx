import React, { useState, useEffect } from 'react'
import { useApp } from '../store'
import { CITY_WARDS, isSuccessful, ratingOf, projectImage, SURVEY_STATS, SEG_COLORS } from '../data/seed'
import { Stars } from './Work'
import CityPicker from '../components/CityPicker'
const heroImg = '/assets/hero-city.jpg'
const heroWork = '/assets/hero-work.jpg'
const heroReport = '/assets/hero-report.jpg'
const communityImg = '/assets/community.jpg'

export default function Home() {
  const { navigate, t, setSearchOpen, projects, reports, feedbacks } = useApp()
  const topWork = [...projects.filter(isSuccessful)]
    .map((p) => ({ p, r: ratingOf(feedbacks[p.id] || []) }))
    .sort((a, b) => (b.r.avg - a.r.avg) || (b.r.count - a.r.count))
    .slice(0, 2)

  const cards = [
    {
      page: 'budget', icon: '₹', titleEn: 'See the City and Ward Budget', titleHl: 'City aur Ward Budget Dekhein',
      descEn: 'Understand in simple language where the city money comes from and what work it is spent on.',
      descHl: 'Aasan bhasha mein samjho ki shehar ka paisa kahan se aata hai aur kis kaam mein lagta hai.'
    },
    {
      page: 'projects', icon: '🔍', titleEn: 'Check the Truth of the Work', titleHl: 'Kaam Ka Sach Jaanchen',
      descEn: 'See the gap between the progress written on paper and the real condition on the ground, and vote whether the work really happened or not.',
      descHl: 'Dekho kagaz pe jo progress likhi hai aur zameen ki asli haalat mein fark, aur apna vote do ki kaam waqai hua ya nahi.'
    },
    {
      page: 'feed', icon: '💬', titleEn: 'Talk on the Community Feed', titleHl: 'Community Feed Par Baat Karein',
      descEn: 'See what people across the city are reporting, and push the right reports forward with likes and comments.',
      descHl: 'Dekho shehar bhar ke log kya report kar rahe hain, like aur comment karke sahi reports ko aage badhao.'
    },
    {
      page: 'report', icon: '📸', titleEn: 'Report a Problem', titleHl: 'Samasya Report Karein',
      descEn: 'Report the problem of your lane, road or ward with a photo and get a Tracking ID.',
      descHl: 'Photo ke saath apni gali, sadak ya ward ki samasya report karo aur ek Tracking ID pao.'
    },
    {
      page: 'ai', icon: '🤖', titleEn: 'Understand in Simple Language with AI', titleHl: 'AI Se Aasan Bhasha Mein Samjho',
      descEn: 'Understand the budget in simple Hindi and English with Budget Samjho, answered from the official city budget.',
      descHl: 'Budget Samjho se budget aasan Hindi/English mein samjho, jawab asal city budget se aate hain.'
    }
  ]

  const steps = [
    { n: 1, titleEn: 'Report It', titleHl: 'Report Karein', descEn: 'Send the problem with a photo.', descHl: 'Photo ke saath samasya bhejein.' },
    { n: 2, titleEn: 'Get a Tracking ID', titleHl: 'Tracking ID Paayein', descEn: 'Every report gets an ID like JMT-2026-XXXX.', descHl: 'Har report par JMT-2026-XXXX jaisi ID milti hai.' },
    { n: 3, titleEn: 'Community Verifies', titleHl: 'Community Verify Kare', descEn: 'People confirm the truth with likes, comments and votes.', descHl: 'Log like, comment aur vote se sach ki pushti karte hain.' },
    { n: 4, titleEn: 'Follow the Status', titleHl: 'Status Follow Karein', descEn: 'Every step from Submitted to Resolved is visible.', descHl: 'Submitted se Resolved tak har kadam dikhta hai.' }
  ]

  const stats = [
    { n: projects.length, labelEn: 'Projects Tracked', labelHl: 'Projects Track Ho Rahe Hain' },
    { n: reports.length, labelEn: 'Citizen Reports', labelHl: 'Citizen Reports' },
    { n: Object.values(CITY_WARDS).reduce((s, arr) => s + arr.length, 0), labelEn: 'Wards Tracked', labelHl: 'Wards Track Ho Rahe Hain' }
  ]

  const slides = [
    {
      img: heroImg,
      titleEn: 'Everyday city problems will now be fixed on the ground, not just on paper',
      titleHl: 'Har roz ke shehar ke masle ab kagaz mein nahi, zameen par sudhrenge',
      subEn: 'JanMoolya Tracker shows the ward budget, the truth of ongoing work and reports of problems around you, all in one place. So that every citizen can watch their city get better.',
      subHl: 'JanMoolya Tracker dikhata hai ward ka budget, chal rahe kaam ka sach aur aas-paas ki samasyaon ki report, sab ek hi jagah. Taaki har nagrik dekh sake apne shehar ko behtar hota.'
    },
    {
      img: heroWork,
      titleEn: 'See the truth of every work, from paper to the ground',
      titleHl: 'Har kaam ka sach dekho, kagaz se lekar zameen tak',
      subEn: 'Project budgets, official progress and the real condition on the ground, all side by side. Vote yourself on whether the work really happened.',
      subHl: 'Project ka budget, official progress aur zameen ki asli haalat, sab ek saath. Khud vote do ki kaam waqai hua ya nahi.'
    },
    {
      img: heroReport,
      titleEn: "Your one report can turn into your city's change",
      titleHl: 'Tumhari ek report ban sakti hai tumhare shehar ka badlav',
      subEn: 'Report a problem with a photo, get a Tracking ID, and follow it with the community until it is resolved.',
      subHl: 'Photo ke saath samasya report karo, Tracking ID pao, aur community ke saath use resolved hone tak follow karo.'
    }
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % slides.length), 5500)
    return () => clearInterval(id)
  }, [active])

  return (
    <div className="py-8">
      {/* Hero carousel - full width */}
      <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-navy">
        <div className="relative h-[560px] sm:h-[600px]">
          {slides.map((s, i) => (
            <div key={i} className={'absolute inset-0 transition-opacity duration-1000 ' + (i === active ? 'opacity-100' : 'pointer-events-none opacity-0')}>
              <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/25" />
            </div>
          ))}
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-16">
            <span className="chip self-start bg-jcyan text-white">Apka Tax. Apka Ward. Poora Hisaab.</span>
            <h1 className="font-display mt-5 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
              {t(slides[active].titleEn, slides[active].titleHl)}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-100 sm:text-lg">
              {t(slides[active].subEn, slides[active].subHl)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => setSearchOpen(true)}>{t('Choose Your City', 'Apni City Chunein')}</button>
              <button className="btn-white" onClick={() => navigate('report')}>{t('Report Now', 'Report Karein')}</button>
            </div>
            <div className="mt-8 max-w-2xl rounded-xl bg-white/90 px-4 py-3 text-sm text-slate-700">
              <strong>{t('Demo Notice:', 'Demo Notice:')}</strong>{' '}
              {t('The numbers and examples shown on this page are only sample/demo data, not real government records.', 'Is page par dikhaye gaye numbers aur examples sirf sample/demo data hain, asli sarkari record nahi.')}
            </div>
          </div>
          <button onClick={() => setActive((active + slides.length - 1) % slides.length)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition hover:bg-white/30 sm:flex">‹</button>
          <button onClick={() => setActive((active + 1) % slides.length)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition hover:bg-white/30 sm:flex">›</button>
        </div>
      </section>

      {/* Stats */}
      <section className="card mt-8 grid grid-cols-3 divide-x divide-slate-100">
        {stats.map((s) => (
          <div key={s.labelEn} className="px-3 py-5 text-center">
            <div className="text-2xl font-bold text-primary sm:text-3xl">{s.n}</div>
            <div className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{t(s.labelEn, s.labelHl)}</div>
          </div>
        ))}
      </section>

      {/* Choose your city */}
      <section className="card mt-8 px-5 py-6 sm:px-8">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">🏙️ {t('Choose Your City', 'Apna Shehar Chunein')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('Pick a city and the Dashboard and Budget Explorer will show that city\u2019s full account. More cities are being added.', 'Shehar chunein, Dashboard aur Budget Explorer mein usi shehar ka poora hisaab dikhega. Aur shehar jode ja rahe hain.')}</p>
        <div className="mt-4">
          <CityPicker goToDashboard />
        </div>
      </section>

      {/* Why This Matters */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('Why This Matters', 'Ye Kyun Zaroori Hai')}</h2>
        <div className="card mt-5 overflow-hidden sm:grid sm:grid-cols-5">
          <div className="space-y-4 px-5 py-6 sm:col-span-3 sm:px-8">
            <p className="text-slate-700">
              {t('Every day the city sees problems with roads, cleaning, water, drainage, traffic and safety. But often they are neither heard nor is the right information available.', 'Shehar mein roz sadak, safai, paani, drainage, traffic aur safety se judi pareshaniyan aati hain. Par aksar unki sunwai ya sahi jaankari nahi milti.')}
            </p>
            <p className="text-slate-700">
              {t('Just filing a complaint is not enough. People should know where the city money is being spent, which work is shown complete only in files, and which problem the people nearby consider the most important.', 'Sirf complaint likhna kaafi nahi. Logon ko pata hona chahiye ke shehar ka paisa kahan lag raha hai, kaun sa kaam sirf file mein pura dikh raha hai, aur aas-paas ke log kis samasya ko sabse zaroori samajhte hain.')}
            </p>
          </div>
          <img src={communityImg} alt={t('Citizens taking part in a community drive', 'Community drive mein hissa lete hue nagrik')} className="h-52 w-full object-cover sm:col-span-2 sm:h-full" />
        </div>
      </section>

      {/* Survey: We Asked People */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">📊 {t('We Asked People', 'Humne Logon Se Pucha')}</h2>
        <p className="mt-2 max-w-3xl text-slate-600">{t('Before building this platform, we asked citizens a simple question: do you know where your city spends your tax money? Their answers are the reason JanMoolya Tracker exists.', 'Is platform ko banane se pehle humne nagrikon se ek seedha sawal pucha: kya aapko pata hai aapke shehar mein aapke tax ka paisa kahan kharch hota hai? Unhi ke jawab JanMoolya Tracker ke banne ki wajah hain.')}</p>
        <div className="card mt-5 space-y-6 px-5 py-6 sm:px-8">
          {SURVEY_STATS.map((s, i) => (
            <div key={i}>
              <p className="text-sm text-slate-700 sm:text-base"><strong className="font-display mr-1 text-2xl font-bold text-navy">{s.pct}%</strong> {t(s.en, s.hl)}</p>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full" style={{ width: s.pct + '%', background: SEG_COLORS[i % SEG_COLORS.length] }} />
              </div>
            </div>
          ))}
          <p className="border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500 sm:text-sm">{t('Survey of 17 citizens from 10+ cities, including Delhi, Indore, Prayagraj, Nashik, Bengaluru, Gurgaon and Ghaziabad (Nov 2026). Most respondents (52.9%) were 18-24 years old.', '17 nagrikon ka survey, Delhi, Indore, Prayagraj, Nashik, Bengaluru, Gurgaon aur Ghaziabad samet 10+ shehron se (Nov 2026). Zyadatar jawab dene wale (52.9%) 18-24 saal ke the.')}</p>
        </div>
      </section>

      {/* What You Can Do Here */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('What You Can Do Here', 'Yahan Aap Kya Kar Sakte Hain')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <button key={c.page} onClick={() => navigate(c.page)} className="card px-5 py-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="text-3xl">{c.icon}</div>
              <h3 className="font-display mt-3 text-lg font-bold text-ink">{t(c.titleEn, c.titleHl)}</h3>
              <p className="mt-2 text-sm text-slate-600">{t(c.descEn, c.descHl)}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-primary">{t('Open', 'Kholein')} →</span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      {topWork.length > 0 && (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('Our Work', 'Hamara Kaam')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t('The highest rated successful work, verified by citizens on the ground. Tap a card to see all successful work.', 'Sabse zyada rating wala safal kaam, zameen par nagrikon dwara verified. Saara safal kaam dekhne ke liye card par tap karein.')}</p>
            </div>
            <button onClick={() => navigate('work')} className="text-sm font-semibold text-primary">{t('See All Successful Work', 'Saara Safal Kaam Dekhein')} →</button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {topWork.map(({ p, r }) => (
              <button key={p.id} onClick={() => navigate('work')} className="card overflow-hidden px-5 py-5 text-left transition hover:shadow-lg">
                {projectImage(p) && <img src={projectImage(p)} alt={p.name} className="-mx-5 -mt-5 mb-4 h-44 w-[calc(100%+2.5rem)] max-w-none object-cover" loading="lazy" />}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold leading-snug text-ink">{p.name}</h3>
                  <span className="chip shrink-0 bg-green-100 text-green-700">✓ {t('COMPLETED', 'COMPLETED')}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">📍 {p.city}{p.state ? ', ' + p.state : ''}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Stars avg={r.avg} />
                  <span className="font-bold text-ink">{r.avg.toFixed(1)}</span>
                  <span className="text-xs text-slate-500">({r.count} {t('citizen feedbacks', 'citizen feedbacks')})</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">🏗️ {t('Ground Progress', 'Zameen Par Progress')}</span><span className="text-ink">{p.groundPct}%</span></div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-jgreen" style={{ width: Math.min(100, p.groundPct || 0) + '%' }} /></div>
                </div>
                <p className="mt-3 text-sm font-semibold text-primary">{t('See this work and give feedback', 'Ye kaam dekhein aur feedback dein')} →</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('How It Works For Citizens', 'Citizens Ke Liye Ye Kaise Kaam Karta Hai')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card px-5 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{s.n}</div>
              <h3 className="font-display mt-3 text-lg font-bold text-ink">{t(s.titleEn, s.titleHl)}</h3>
              <p className="mt-2 text-sm text-slate-600">{t(s.descEn, s.descHl)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust and Clarity Note */}
      <section className="mt-12">
        <div className="card border-l-4 border-jgreen px-5 py-6 sm:px-8">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t('Trust and Clarity Note', 'Bharosa Aur Saaf Baat')}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 sm:text-base">
            <li>{t('JanMoolya Tracker is an independent student buildathon initiative. It does not represent any government body and uses no government logo.', 'JanMoolya Tracker ek independent student buildathon initiative hai. Ye kisi sarkari sanstha ka pratinidhitva nahi karta aur koi sarkari logo istemal nahi karta.')}</li>
            <li>{t('The numbers shown here are sample data, unless a source link is given with them.', 'Yahan dikhaye gaye numbers sample data hain, jab tak unke saath source link na ho.')}</li>
            <li>{t('Before uploading a photo, please blur faces and vehicle number plates.', 'Photo upload karne se pehle chehre aur number plate blur karein.')}</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
