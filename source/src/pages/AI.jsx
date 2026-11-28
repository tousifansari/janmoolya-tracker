import React, { useState, useRef, useEffect } from "react"
import { useApp } from "../store"
import { INCOME_HEADS, EXPENSE_DEPTS, CITY_WARDS, fmtCr, fmtCr1, fmtMoney, shareAmt } from "../data/seed"
import { projectStats } from "./Dashboard"

export default function AI() {
  const { t, lang, loc, currentBudget, projects, cityBudgets, votes } = useApp()
  const hl = lang === "hl"
  const B = currentBudget
  const budgetCities = Object.keys(cityBudgets || {})
  const budgetCityList = budgetCities.join(", ")

  // Jis shehar ka budget nahi juda, uske liye saaf "available nahi" sandesh
  const notAvail = () => hl
    ? loc.city + " ka budget abhi available nahi hai. Abhi in shehron ke asal budget available hain: " + budgetCityList + ". Jaise hi " + loc.city + " ka budget Admin dwara joda jayega, main yahan uska hisaab bhi dene lagunga."
    : loc.city + "'s budget is not available yet. Official budgets of these cities are available right now: " + budgetCityList + ". As soon as " + loc.city + "'s budget is added by the Admin, I will start answering for it here too."

  // Department ka hissa: asal kul kharch par ₹100 model se (Budget Explorer jaisa hi hisaab)
  const shareLine = (e) => {
    if (!e) return ""
    if (B) return (hl ? e.nameHl : e.nameEn) + ": har ₹100 kharch mein se ₹" + e.share + " (kul lagbhag " + fmtCr1(shareAmt(B.expenditure, e.share)) + ")"
    return (hl ? e.nameHl : e.nameEn) + ": har ₹100 kharch mein se ₹" + e.share + " (ye aam ₹100 model ka hissa hai)"
  }
  const deptAnswer = (key, extraHl, extraEn) => {
    const e = EXPENSE_DEPTS.find(x => x.key === key)
    if (B) {
      return hl
        ? loc.city + " ke asal budget (FY " + B.fy + ") mein " + shareLine(e) + " rakhe gaye hain. " + extraHl
        : "In " + loc.city + "'s official budget (FY " + B.fy + "), " + shareLine(e) + " is set aside. " + extraEn
    }
    return (hl ? notAvail() + " Aam taur par " : notAvail() + " Usually, ") + shareLine(e) + "."
  }

  // Kisi ek project ka haal, Project Tracker ke asal data se
  const projectAnswer = (p) => {
    const s = projectStats(p, votes)
    const status = p.effStatus || p.status
    const base = hl
      ? p.name + " (" + p.city + ", " + p.ward + "): sthiti " + status + " hai. Kagaz par kaam " + p.paperPct + "%, zameen par " + p.groundPct + "%. Pass hui rakam " + fmtMoney(p.approved) + ", ab tak kharch " + fmtMoney(p.spent) + ". Nagrikon ke vote: 👍 " + s.yes + " ne kaha kaam hua, 👎 " + s.no + " ne kaha nahi hua."
      : p.name + " (" + p.city + ", " + p.ward + "): status is " + status + ". Paper Progress " + p.paperPct + "%, Ground Progress " + p.groundPct + "%. Sanctioned " + fmtMoney(p.approved) + ", spent so far " + fmtMoney(p.spent) + ". Citizen votes: 👍 " + s.yes + " said done, 👎 " + s.no + " said not done."
    const note = s.mismatch
      ? (hl ? " ⚠️ Is project par MISMATCH alert hai - kagaz aur zameen ka hisaab mel nahi khata." : " ⚠️ This project has a MISMATCH alert - the paper record and the ground reality do not match.")
      : (hl ? " Poora detail Project Tracker mein dekhein." : " See full details in the Project Tracker.")
    return base + note
  }
  const findProject = (q) => {
    const alias = [
      [["naala", "nalla", "nala"], (p) => p.name.includes("Naala")],
      [["mg road"], (p) => p.name.includes("MG Road")],
      [["toilet", "shauchalay"], (p) => p.name.toLowerCase().includes("toilet")],
      [["vijay nagar", "cc road"], (p) => p.name.includes("Vijay Nagar")],
      [["arera"], (p) => p.name.includes("Arera")],
      [["nanakheda"], (p) => p.name.includes("Nanakheda")],
      [["mahakal", "led"], (p) => p.name.includes("LED")],
      [["saat rasta"], (p) => (p.name + " " + (p.area || "")).toLowerCase().includes("saat rasta")]
    ]
    for (const [words, test] of alias) {
      if (words.some(w => q.includes(w))) {
        const hit = (projects || []).find(test)
        if (hit) return hit
      }
    }
    // Ward/area ke khaas shabdon se khoj (Banganga, Sukhliya, Barkatullah...)
    for (const p of (projects || [])) {
      const tokens = ((p.ward || "") + " " + (p.area || "")).toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3 && !["ward", "nagar", "colony", "road", "area", "marg"].includes(w))
      if (tokens.some(w => q.includes(w))) return p
    }
    return null
  }

  const answerFor = (raw) => {
    const q = raw.toLowerCase().trim()

    // Salaam-dua
    if (/^(hi+|hello|hey|namaste|namaskar|hlo|hii+)\b/.test(q) || q === "namaste") {
      return hl
        ? "Namaste! Main Budget Samjho, aapka AI Budget Assistant hoon. Mujhse puchein: kul budget kitna hai, sadak/paani/naali par kitna kharcha hua, kisi project ka haal kya hai, ya report kaise karte hain."
        : "Hello! I am Budget Samjho, your AI Budget Assistant. Ask me: the total budget, how much was spent on roads/water/drains, the state of any project, or how to report an issue."
    }
    if (q.includes("thank") || q.includes("dhanyavad") || q.includes("shukriya")) {
      return hl
        ? "Koi baat nahi! Budget aur shehar ke kaam par aur kuch puchna ho to main yahin hoon."
        : "You are welcome! If you want to ask anything else about the budget or city work, I am right here."
    }
    // Kaun se shehron ka budget available hai
    if (q.includes("kaun se shehar") || q.includes("kaunse shehar") || q.includes("kis shehar") || q.includes("which cit") || q.includes("available") || q.includes("shehron ka budget")) {
      return hl
        ? "Abhi in shehron ke asal budget platform par available hain: " + budgetCityList + ". Inke alawa kisi shehar ka budget Admin City Budget wale hisse se jod sakta hai, bina koi code badle. Jis shehar ka budget nahi hai, uske sawal par main saaf bata deta hoon ki wo abhi available nahi hai."
        : "Official budgets of these cities are available on the platform right now: " + budgetCityList + ". Any other city's budget can be added by the Admin from the City Budget section, without changing any code. For a city whose budget is not added, I clearly say so instead of guessing."
    }
    // Kisi project ka haal
    const proj = findProject(q)
    if (proj) return projectAnswer(proj)
    if (q.includes("project") || q.includes("pariyojana")) {
      const list = (projects || []).map(p => p.name + " (" + p.city + ", " + (p.effStatus || p.status) + ")").join("; ")
      return hl
        ? "Abhi platform par ye projects track ho rahe hain: " + list + ". Kisi ek ka haal janne ke liye uska naam likhein, jaise 'Naala project ka haal kya hai?'"
        : "These projects are being tracked right now: " + list + ". To know about one, write its name, for example 'What is the state of the Naala project?'"
    }
    // Report kaise karein
    if ((q.includes("report") && (q.includes("kaise") || q.includes("how") || q.includes("kar"))) || q.includes("shikayat") || q.includes("complaint")) {
      return hl
        ? "Report karna aasan hai: (1) Upar 'Report Issue' par jayein. (2) Login karein (bina login report nahi jaati). (3) Problem ki photo, category, PIN aur area bharein. (4) Submit karte hi aapko JMT-2026-XXXX jaisi Tracking ID milegi, aur report Community Feed aur Admin ke paas chali jayegi. Dhyan dein: photo mein chehre aur number plate blur kar dein."
        : "Reporting is easy: (1) Go to 'Report Issue' above. (2) Log in (a report cannot be sent without login). (3) Add a photo of the problem, its category, PIN and area. (4) On submitting you get a Tracking ID like JMT-2026-XXXX, and the report reaches the Community Feed and the Admin. Please blur faces and number plates in the photo."
    }
    // Mismatch kya hota hai
    if (q.includes("mismatch")) {
      return hl
        ? "Mismatch matlab: kagaz par jo kaam dikhaya gaya hai, wo zameen par nahi mila. Jaise kagaz par kaam 100% complete, lekin zameen par sirf 10%, ya paisa 80% se zyada kharch ho gaya aur nagrik vote karke keh rahe hain ki kaam hua hi nahi. Aise projects Dashboard par laal Mismatch Alert ke saath sabse upar dikhte hain."
        : "A mismatch means: the work shown on paper is not found on the ground. For example, paper says 100% complete but the ground shows only 10%, or over 80% of the money is spent while citizens vote that the work never happened. Such projects appear at the top of the Dashboard with a red Mismatch Alert."
    }
    // Vote / verify kaise hota hai
    if (q.includes("vote") || q.includes("verify") || q.includes("pushti")) {
      return hl
        ? "Jab Admin kisi project ko Completed mark karta hai, to Project Tracker mein us par 'Haan, kaam hua' ya 'Nahi, kaam nahi hua' ke vote khul jate hain. Vote ke liye login zaroori hai. Agar zyada nagrik 'Nahi' kehte hain, to project par Mismatch Alert lag jata hai. Yahi janata ki pushti hai."
        : "When the Admin marks a project Completed, voting opens on it in the Project Tracker: 'Yes, the work is done' or 'No, it is not'. Login is needed to vote. If more citizens say 'No', the project gets a Mismatch Alert. This is the public's verification."
    }
    // Paisa aata kahan se hai (aamdani)
    if (q.includes("aata") || q.includes("source") || q.includes("income") || q.includes("kahan se") || q.includes("aamdani") || q.includes("aay")) {
      if (!B) return notAvail()
      const lines = INCOME_HEADS.map(s => (hl ? s.nameHl : s.nameEn) + " ₹" + s.share).join(", ")
      return hl
        ? loc.city + " ki aamdani har ₹100 is hisaab se aati hai: " + lines + ". Kul aamdani (FY " + B.fy + ") " + fmtCr(B.income) + " hai. Property tax shehar ki apni sabse badi aamdani hai, grants rajya aur kendra sarkar se aate hain."
        : loc.city + "'s income, out of every ₹100, comes like this: " + lines + ". Total income (FY " + B.fy + ") is " + fmtCr(B.income) + ". Property tax is the city's biggest own income, grants come from the State and Central Government."
    }
    // Ward scores ("score" akela cricket jaise sawalon se takrata hai, isliye ward/shehar shabd bhi chahiye)
    if (q.includes("ward") || (q.includes("score") && (q.includes("meri") || q.includes("mera") || q.includes("mere") || q.includes("shehar") || q.includes("city")))) {
      const wards = CITY_WARDS[loc.city] || []
      if (!wards.length) return hl
        ? loc.city + " ke ward abhi platform par nahi jude hain. Indore, Bhopal aur Ujjain ke asal ward Budget Explorer mein dekhe ja sakte hain."
        : "Wards of " + loc.city + " are not added on the platform yet. Real wards of Indore, Bhopal and Ujjain can be seen in the Budget Explorer."
      const lines = wards.map(w => w.name + ": " + w.score + "/100").join(", ")
      return hl
        ? loc.city + " ke asal ward aur unke score: " + lines + ". Sabse kam score wale ward mein paisa kagaz par zyada aur zameen par kam dikhta hai, wahi mismatch hai."
        : "Real wards of " + loc.city + " and their scores: " + lines + ". In the lowest scoring ward, money shows more on paper and less on the ground, that is the mismatch."
    }
    // Ghata / surplus
    if (q.includes("ghata") || q.includes("deficit") || q.includes("surplus") || q.includes("bachat")) {
      if (!B) return notAvail()
      const diff = Math.round(((B.income || 0) - (B.expenditure || 0)) * 100) / 100
      if (diff >= 0) return hl
        ? loc.city + " ke budget (FY " + B.fy + ") mein aamdani kharch se zyada hai: kul aamdani " + fmtCr(B.income) + ", kul kharch " + fmtCr(B.expenditure) + ", yani lagbhag " + fmtCr(diff) + " ki bachat (surplus)."
        : "In " + loc.city + "'s budget (FY " + B.fy + "), income is more than expenditure: total income " + fmtCr(B.income) + ", total expenditure " + fmtCr(B.expenditure) + ", a surplus of about " + fmtCr(diff) + "."
      const deficit = B.deficit != null ? B.deficit : Math.abs(diff)
      return hl
        ? loc.city + " ke budget (FY " + B.fy + ") mein kharch aamdani se zyada hai: kul aamdani " + fmtCr(B.income) + ", kul kharch " + fmtCr(B.expenditure) + ", ghata lagbhag " + fmtCr(deficit) + (B.reserve ? " (isme " + fmtCr(B.reserve) + " ka reserve pravadhan shamil hai)" : "") + "."
        : "In " + loc.city + "'s budget (FY " + B.fy + "), expenditure is more than income: total income " + fmtCr(B.income) + ", total expenditure " + fmtCr(B.expenditure) + ", a deficit of about " + fmtCr(deficit) + (B.reserve ? " (including a reserve provision of " + fmtCr(B.reserve) + ")" : "") + "."
    }
    // Departments (₹100 model, asal kul kharch par)
    if (q.includes("sadak") || q.includes("road") || q.includes("pul") || q.includes("bridge") || q.includes("footpath")) {
      return deptAnswer("roads",
        "Project Tracker mein har sadak project ka sanctioned paisa, kharch aur Paper banam Ground progress dekh sakte hain.",
        "In the Project Tracker you can see every road project's sanctioned amount, spend and Paper vs Ground progress.")
    }
    if (q.includes("paani") || q.includes("water") || q.includes("jal")) {
      return deptAnswer("water",
        "Leakage ya supply ki problem ho to Report page se paani category mein report karein.",
        "If there is a leakage or supply problem, report it under the water category on the Report page.")
    }
    if (q.includes("drainage") || q.includes("naali") || q.includes("drain") || q.includes("sewer") || q.includes("sewage")) {
      return deptAnswer("drainage",
        "Phir bhi naali jaam ki reports sabse zyada aati hain, yehi kagaz aur zameen ka farq hai.",
        "Even then, blocked drain reports are among the highest, that is the gap between paper and ground.")
    }
    if (q.includes("garbage") || q.includes("kachra") || q.includes("kachara") || q.includes("safai") || q.includes("sanitation")) {
      return deptAnswer("sanitation",
        "Agar aapke area mein kachra nahi uth raha hai, to photo ke saath report karein, wahi zameeni saboot banta hai.",
        "If garbage is not being picked up in your area, report it with a photo, that becomes the ground evidence.")
    }
    if (q.includes("light") || q.includes("bijli") || q.includes("streetlight")) {
      return deptAnswer("lights",
        "Band streetlight raat mein safety ka mudda hai, isliye is category ki reports ko jaldi action ke liye bheja jaata hai.",
        "A streetlight that is off at night is a safety issue, so reports in this category are sent for quick action.")
    }
    if (q.includes("park") || q.includes("bagh") || q.includes("garden")) {
      return deptAnswer("parks",
        "Park ki safai ya pedon ki samasya ho to Report page se report karein.",
        "For a park cleanliness or tree issue, report it from the Report page.")
    }
    if (q.includes("tankhwah") || q.includes("salary") || q.includes("salaries") || q.includes("karmchari") || q.includes("staff")) {
      return deptAnswer("establishment",
        "Isme nagar nigam ke karmachariyon ki tankhwah aur daftar chalane ka kharch aata hai.",
        "This covers municipal staff salaries and the running cost of offices.")
    }
    // Kul budget
    if (q.includes("budget") || q.includes("total") || q.includes("kharch") || q.includes("kharcha") || q.includes("kul")) {
      if (!B) return notAvail()
      const lines = EXPENSE_DEPTS.map(e => (hl ? e.nameHl : e.nameEn) + " " + fmtCr1(shareAmt(B.expenditure, e.share))).join(", ")
      return hl
        ? loc.city + " ka asal budget (FY " + B.fy + ", " + B.bodyName + "): kul aamdani " + fmtCr(B.income) + ", kul kharch " + fmtCr(B.expenditure) + ". Kharch ka vibhag-wise hisaab (₹100 model se): " + lines + ". Poora detail Budget Explorer page par hai."
        : loc.city + "'s official budget (FY " + B.fy + ", " + B.bodyName + "): total income " + fmtCr(B.income) + ", total expenditure " + fmtCr(B.expenditure) + ". Department-wise spend (from the ₹100 model): " + lines + ". Full detail is on the Budget Explorer page."
    }
    // Off-topic / samajh na aaya ho
    return hl
      ? "Maaf kijiye, ye sawal mere kaam se bahar hai. Main sirf shehar ke budget, kharch aur projects par madad kar sakta hun - jaise: sadkon par kitna kharcha hua, paani ka budget kitna hai, Naala project ka haal kya hai, report kaise karte hain. Neeche chips se bhi sawal chun sakte hain."
      : "Sorry, that question is outside my work. I can only help with the city's budget, spending and projects - for example: how much was spent on roads, the water budget, the state of the Naala project, or how to report an issue. You can also pick a question from the chips below."
  }

  const [msgs, setMsgs] = useState([
    { from: "ai", text: hl
      ? "Namaste, main Budget Samjho, aapka AI Budget Assistant hoon. Shehar ke budget, kharch aur projects ke baare mein simple bhasha mein sawal puchein, main platform ke asal data se jawab dunga. Abhi in shehron ke asal budget available hain: " + budgetCityList + "."
      : "Hello, I am Budget Samjho, your AI Budget Assistant. Ask me about the city budget, spending and projects in simple words, I will answer from the platform's real data. Official budgets of these cities are available right now: " + budgetCityList + "." }
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef(null)
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [msgs])

  const ask = (text) => {
    const q = (text || "").trim()
    if (!q) return
    const reply = answerFor(q)
    setMsgs(prev => [...prev, { from: "user", text: q }, { from: "ai", typing: true, text: "" }])
    setInput("")
    setTimeout(() => {
      setMsgs(prev => {
        const copy = [...prev]
        const idx = copy.map((m, i) => (m.typing ? i : -1)).filter(i => i >= 0).pop()
        if (idx != null) copy[idx] = { from: "ai", text: reply }
        return copy
      })
    }, 650)
  }

  const quickQs = [
    "Sadkon par kitna kharcha hua?",
    "Paani ka budget kitna hai?",
    "Kul budget kitna hai?",
    "Naala project ka haal kya hai?",
    "Kaun se shehron ka budget hai?",
    "Report kaise karte hain?"
  ]

  return (
    <div className="w-full py-8">
      <h1 className="font-display text-3xl sm:text-4xl">{t("AI Assistant", "AI Assistant")}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {t("Budget Samjho, the AI budget assistant, explains city money in simple words, answered from the same official budget data as the Budget Explorer.",
          "Budget Samjho, AI budget assistant, shehar ke paise ko simple shabdon mein samjhata hai, jawab Budget Explorer wale asal budget data se hi aate hain.")}
      </p>

      <div className="mt-6 max-w-3xl">
        {/* Budget Samjho - AI Budget Assistant */}
        <section className="card flex flex-col p-5">
          <h2 className="font-display text-2xl">💬 {t("Budget Samjho - AI Budget Assistant", "Budget Samjho - AI Budget Assistant")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("Budget and project questions, answered from the platform data in simple language.", "Budget aur project ke sawal, platform ke data se simple bhasha mein jawab.")}</p>
          <div ref={scrollRef} className="mt-4 max-h-96 flex-1 space-y-3 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={m.from === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm text-slate-800"}>
                  {m.typing
                    ? <span className="inline-flex gap-1 py-1"><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" /></span>
                    : m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickQs.map(q => (
              <button key={q} onClick={() => ask(q)} className="chip bg-cream text-slate-700 hover:bg-cyan-100">{q}</button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="input min-w-0 flex-1" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") ask(input) }}
              placeholder={t("Ask about budget, roads, water, projects…", "Budget, sadak, paani, project ke baare mein puchein…")} />
            <button onClick={() => ask(input)} className="btn-primary shrink-0 !px-5">{t("Send", "Bhejein")}</button>
          </div>
        </section>
      </div>
    </div>
  )
}
