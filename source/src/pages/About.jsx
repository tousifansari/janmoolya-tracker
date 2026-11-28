import React from 'react'
import { useApp } from '../store'
import { SURVEY_STATS, SEG_COLORS } from '../data/seed'
const heroImg = '/assets/hero-city.jpg'

const PILLARS = [
  { icon: '💰', en: 'Public Money', hl: 'Public Paisa', descEn: 'The city budget, shown in simple language: how much money came in, and where it was spent.', descHl: 'Shehar ka budget, aasan bhasha mein: kitna paisa aaya, aur kahan kharch hua.' },
  { icon: '🏗️', en: 'Ground Reality', hl: 'Zameeni Sach', descEn: 'Every project shows two numbers side by side: Paper Progress (what files claim) and Ground Progress (what is really built).', descHl: 'Har project mein do number saath dikhte hain: Paper Progress (file mein kitna dikhaya) aur Ground Progress (zameen par asal mein kitna bana).' },
  { icon: '🗳️', en: 'Citizen Voice', hl: 'Nagrik Ki Awaaz', descEn: 'Citizens report problems with photos, follow their Tracking ID, and verify completed work with votes and feedback.', descHl: 'Nagrik photo ke saath report karte hain, apni Tracking ID se use follow karte hain, aur pura hue kaam par vote aur feedback dekar sach ki pushti karte hain.' }
]

const FLOW = [
  { n: 1, en: 'A citizen reports a problem', hl: 'Nagrik report karta hai', descEn: 'A broken streetlight, a pothole, a dry tap - reported with a photo and location. A Tracking ID is issued.', descHl: 'Band streetlight, gaddha, sookha nal - photo aur jagah ke saath report. Ek Tracking ID milti hai.' },
  { n: 2, en: 'The administration responds', hl: 'Prashasan jawab deta hai', descEn: 'The report reaches the Admin panel. Its status changes in public: Submitted, In Progress, Resolved.', descHl: 'Report Admin panel tak pahunchti hai. Uska status sabke saamne badalta hai: Submitted, In Progress, Resolved.' },
  { n: 3, en: 'Work becomes a tracked project', hl: 'Kaam project ban jata hai', descEn: 'Sanctioned work is added as a project with the body it was passed to, the contractor, the amount and the dates.', descHl: 'Pass hua kaam project bankar jud jata hai - kis nikay ko paisa gaya, thekedaar kaun, rakam kitni, tareekhein kya.' },
  { n: 4, en: 'Everyone watches the truth', hl: 'Sab sach dekhte hain', descEn: 'Paper vs Ground stays public. When the Admin marks work Completed, citizens vote on whether it really happened.', descHl: 'Paper vs Ground sabke saamne rehta hai. Admin ke Completed mark karte hi nagrik vote karte hain ki kaam asal mein hua ya nahi.' }
]

const TEAM = [
  { icon: '💻', name: 'Tosif Ansari', roleEn: 'Full-Stack Developer', roleHl: 'Full-Stack Developer', descEn: 'Builds websites for fun.', descHl: 'Fun ke liye websites banata hai.' },
  { icon: '🎨', name: 'Annie', roleEn: 'Graphic Designer', roleHl: 'Graphic Designer', descEn: 'Makes everything visually appealing.', descHl: 'Har cheez ko visually appealing banati hai.' },
  { icon: '🎬', name: 'Vishal', roleEn: 'Video Editor', roleHl: 'Video Editor', descEn: 'Does his magic so our story can reach a large audience.', descHl: 'Apna magic chalata hai taaki humari kahani zyada se zyada logon tak pahunche.' },
  { icon: '📊', name: 'Aman', roleEn: 'Data Science Expert', roleHl: 'Data Science Expert', descEn: 'Performs research and development like it is his hobby.', descHl: 'Research aur development uske liye hobby jaisa hai.' },
  { icon: '📣', name: 'Nehal Arora', roleEn: 'Digital Marketer', roleHl: 'Digital Marketer', descEn: 'Takes the story of JanMoolya to every citizen.', descHl: 'JanMoolya ki kahani har nagrik tak pahunchati hai.' }
]

export default function About() {
  const { t, navigate } = useApp()
  return (
    <div className="pb-4 pt-8">
      {/* Hero - full width banner */}
      <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-navy text-white">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{t('About JanMoolya Tracker', 'JanMoolya Tracker Ke Baare Mein')}</h1>
        <p className="mt-2 font-display text-lg font-semibold text-jcyan">{t('Your Tax. Your Ward. Full Account.', 'Apka Tax. Apka Ward. Poora Hisaab.')}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-200 sm:text-lg">
          {t('JanMoolya Tracker is a civic transparency platform built by students. It connects three things that never meet in India today: the public money a city receives, the real condition of work on the ground, and the voice of the citizens who paid for it.', 'JanMoolya Tracker students dwara banaya gaya ek civic transparency platform hai. Ye teen cheezon ko jodta hai jo aaj India mein kabhi milti nahi: shehar ko mila public paisa, zameen par kaam ki asli haalat, aur un nagrikon ki awaaz jinhone wo paisa diya.')}
        </p>
        </div>
      </section>

      {/* Why we built it */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('Why We Built This', 'Humne Ye Kyun Banaya')}</h2>
        <div className="card mt-5 space-y-4 px-5 py-6 sm:px-8">
          <p className="text-slate-700">
            {t('Every city has the same story: a bridge, a road or a drain whose work runs on paper for years while the ground reality does not change. Money is sanctioned, files move, but the citizen standing in the dark street has no way to see where the money went.', 'Har shehar ki ek hi kahani hai: ek pull, ek sadak ya ek naala, jiska kaam saalon kagaz par chalta rehta hai par zameen par kuch nahi badalta. Paisa pass hota hai, filein chalti hain, lekin andheri gali mein khada nagrik ye dekh hi nahi sakta ki paisa gaya kahan.')}
          </p>
          <p className="text-slate-700">
            {t('The information exists - inside budget PDFs, tender portals and office files. It is simply never shown to the public in one simple place. We take that information and put it in front of everyone. When everyone can see, problems cannot hide.', 'Jaankari maujood hai - budget PDF, tender portal aur daftar ki fileon ke andar. Bas wo aam janta ko ek aasan jagah par kabhi dikhayi nahi jati. Hum usi jaankari ko sabke saamne rakhte hain. Jab sab dekh sakte hain, to samasya chhup nahi sakti.')}
          </p>
          <p className="text-slate-700">
            {t('We did not assume this problem. We asked people first - and their answers became our design.', 'Humne ye samasya khud nahi sochi. Humne pehle logon se pucha - aur unke jawab hi humara design bane.')}
          </p>
          <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {SURVEY_STATS.map((s, i) => (
              <div key={i} className="rounded-2xl bg-cream px-4 py-4">
                <div className="font-display text-3xl font-bold" style={{ color: SEG_COLORS[i % SEG_COLORS.length] }}>{s.pct}%</div>
                <p className="mt-1 text-sm text-slate-600">{t('of citizens ' + s.shortEn, 'nagrik ' + s.shortHl)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">{t('Citizen survey, Nov 2026 - 17 respondents from 10+ cities.', 'Nagrik survey, Nov 2026 - 10+ shehron se 17 jawab.')}</p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('What The Platform Does', 'Platform Kya Karta Hai')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={i} className="card px-5 py-6">
              <div className="text-3xl">{p.icon}</div>
              <h3 className="font-display mt-3 text-lg font-bold text-ink">{t(p.en, p.hl)}</h3>
              <p className="mt-2 text-sm text-slate-600">{t(p.descEn, p.descHl)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How the system works */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('How The System Works', 'System Kaise Kaam Karta Hai')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((s) => (
            <div key={s.n} className="card px-5 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{s.n}</div>
              <h3 className="font-display mt-3 text-lg font-bold text-ink">{t(s.en, s.hl)}</h3>
              <p className="mt-2 text-sm text-slate-600">{t(s.descEn, s.descHl)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">{t('One template works for every city: when a city budget or project is added by the Admin, its citizens see it the same way. Indore, Bhopal and Ujjain are live examples today.', 'Ek hi template har shehar ke liye kaam karta hai: Admin jaise hi kisi shehar ka budget ya project jodta hai, uske nagrik use usi roop mein dekhte hain. Indore, Bhopal aur Ujjain aaj ke live example hain.')}</p>
      </section>

      {/* Team */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('Our Team', 'Humari Team')}</h2>
        <p className="mt-2 max-w-3xl text-slate-600">{t('We are a team of five students. This platform was designed, built and filmed by us for the Tutedude Buildathon - CityFix challenge.', 'Hum paanch students ki team hain. Ye platform humne Tutedude Buildathon - CityFix challenge ke liye design kiya, banaya aur filmaya hai.')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TEAM.map((m, i) => (
            <div key={i} className="card px-5 py-6 text-center">
              <div className="text-3xl">{m.icon}</div>
              <h3 className="font-display mt-3 text-base font-bold text-ink">{m.name}</h3>
              <p className="mt-0.5 text-sm font-semibold text-jcyan">{t(m.roleEn, m.roleHl)}</p>
              <p className="mt-2 text-sm text-slate-600">{t(m.descEn, m.descHl)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty + connect */}
      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="card border-l-4 border-jgreen px-5 py-6 sm:px-8">
          <h2 className="font-display text-xl font-bold text-ink">{t('Trust and Clarity Note', 'Bharosa Aur Saaf Baat')}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>{t('JanMoolya Tracker is an independent student buildathon initiative. It does not represent any government body and uses no government logo.', 'JanMoolya Tracker ek independent student buildathon initiative hai. Ye kisi sarkari sanstha ka pratinidhitva nahi karta aur koi sarkari logo istemal nahi karta.')}</li>
            <li>{t('City budget totals shown for Indore, Bhopal and Ujjain are from official budget documents. Project figures are sample data for demonstration, unless a source is given.', 'Indore, Bhopal aur Ujjain ke budget ke kul aanke official budget documents se hain. Project ke aanke pradarshan ke liye sample data hain, jab tak source na diya ho.')}</li>
            <li>{t('Before uploading a photo, please blur faces and vehicle number plates.', 'Photo upload karne se pehle chehre aur number plate blur karein.')}</li>
          </ul>
        </div>
        <div className="card flex flex-col justify-center px-5 py-6 sm:px-8">
          <h2 className="font-display text-xl font-bold text-ink">{t('Follow The Journey', 'Safar Ke Saath Judein')}</h2>
          <p className="mt-2 text-sm text-slate-600">{t('See the build, the survey and the story on our Instagram.', 'Humari Instagram par build, survey aur kahani dekhein.')}</p>
          <a href="https://www.instagram.com/janmoolyatracker" target="_blank" rel="noreferrer" className="btn-primary mt-4 self-start !px-5 !py-2.5 text-sm">📸 @janmoolyatracker</a>
          <p className="mt-4 text-sm font-semibold text-slate-500">#TutedudeBuildathon #BuildForMyCity</p>
          <button onClick={() => navigate('report')} className="mt-4 self-start text-sm font-semibold text-primary">{t('Report an issue in your city', 'Apne shehar ki samasya report karein')} →</button>
        </div>
      </section>
    </div>
  )
}
