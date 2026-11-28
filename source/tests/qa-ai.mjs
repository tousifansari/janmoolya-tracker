import { chromium } from 'playwright'
const browser = await chromium.launch()
let fails = 0
const check = (name, ok) => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); if (!ok) fails++ }

async function ask(page, q) {
  const input = page.locator('section input.input')
  await input.fill(q)
  await input.press('Enter')
  await page.waitForTimeout(1400)
  const bubbles = await page.evaluate(() => [...document.querySelectorAll('section .rounded-2xl')].map(d => d.innerText))
  return bubbles[bubbles.length - 1] || ''
}

// --- Context 1: Indore, default (Hinglish) ---
const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 950 } })
await ctx1.addInitScript(() => { localStorage.setItem('jmt_state_v1', JSON.stringify({ lang: 'hl' })) })
const p1 = await ctx1.newPage()
const errs = []
p1.on('pageerror', e => errs.push(e.message))
await p1.goto('http://localhost:4173/#ai', { waitUntil: 'networkidle' })
await p1.waitForTimeout(1800)
let a = await ask(p1, 'Sadkon par kitna kharcha hua?')
check('Roads jawab me 1,482 Cr hisaab', a.includes('1,482'))
a = await ask(p1, 'Naala project ka haal kya hai?')
check('Naala project: MISMATCH + 10%', a.includes('MISMATCH') && a.includes('10%'))
a = await ask(p1, 'Kaun se shehron ka budget hai?')
check('Budget cities: Indore Bhopal Ujjain', a.includes('Indore') && a.includes('Bhopal') && a.includes('Ujjain'))
a = await ask(p1, 'Cricket match ka score kya hai?')
check('Off-topic par vinamr mana', a.includes('mere kaam se bahar'))
a = await ask(p1, 'Report kaise karte hain?')
check('Report help: Tracking ID', a.includes('Tracking ID'))
a = await ask(p1, 'Ghata kitna hai?')
check('Indore ghata 164 Cr', a.includes('164'))
a = await ask(p1, 'Paani ka budget kitna hai?')
check('Paani: 2,306 Cr hisaab', a.includes('2,306'))
a = await ask(p1, 'Tankhwah par kitna kharcha hota hai?')
check('Tankhwah: 1,153 Cr hisaab', a.includes('1,153'))
a = await ask(p1, 'Park ka budget kitna hai?')
check('Park: 247 Cr hisaab', a.includes('247'))
a = await ask(p1, 'Vote kaise karte hain?')
check('Vote help: Completed par khulta hai', a.includes('Completed'))
a = await ask(p1, 'Toilet project kaisa hua?')
check('Toilet project: Completed + 95%', a.includes('Completed') && a.includes('95%'))
check('Koi JS error nahi', errs.length === 0)
await ctx1.close()

// --- Context 2: Mumbai (budget nahi hai) ---
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 950 } })
await ctx2.addInitScript(() => { localStorage.setItem('jmt_state_v1', JSON.stringify({ lang: 'hl', location: { state: 'Maharashtra', city: 'Mumbai' } })) })
const p2 = await ctx2.newPage()
await p2.goto('http://localhost:4173/#ai', { waitUntil: 'networkidle' })
await p2.waitForTimeout(1800)
a = await ask(p2, 'Kul budget kitna hai?')
check('Mumbai: budget available nahi message', a.includes('available nahi hai') && a.includes('Indore'))
a = await ask(p2, 'Sadkon par kitna kharcha hua?')
check('Mumbai roads: pehle availability message', a.includes('available nahi hai'))
await ctx2.close()

// --- Context 3: English mode ---
const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 950 } })
await ctx3.addInitScript(() => { localStorage.setItem('jmt_state_v1', JSON.stringify({ lang: 'en' })) })
const p3 = await ctx3.newPage()
await p3.goto('http://localhost:4173/#ai', { waitUntil: 'networkidle' })
await p3.waitForTimeout(1800)
a = await ask(p3, 'What is the total budget?')
check('EN total budget: 8,236.98', a.includes('8,236.98'))
a = await ask(p3, 'Who won the cricket match?')
check('EN off-topic deflection', a.includes('outside my work'))
a = await ask(p3, 'What is the state of the Naala project?')
check('EN Naala: MISMATCH', a.includes('MISMATCH'))
await ctx3.close()

await browser.close()
console.log(fails === 0 ? 'ALL PASS' : fails + ' FAILURES')
process.exit(fails ? 1 : 0)
