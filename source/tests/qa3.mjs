import { chromium } from 'playwright'
const BASE = 'http://localhost:4173'
let pass = 0, fail = 0
const fails = []
const check = (name, cond) => { if (cond) { pass++; console.log('PASS:', name) } else { fail++; fails.push(name); console.log('FAIL:', name) } }
const browser = await chromium.launch()
async function freshPage(w = 1280) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 950 } })
  const page = await ctx.newPage()
  return [ctx, page]
}
const text = (page) => page.evaluate(() => document.body.innerText)

// 1. Paise Samjho naye aanke deta hai (Indore default)
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#ai', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.getByPlaceholder(/Ask about budget/).fill('sadak par kitna kharch hua')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(700)
  let body = await text(page)
  check('Paise Samjho: sadak jawab mein ₹100 model ka ₹18 hissa', body.includes('₹18'))
  check('Paise Samjho: asal kul se hisaab (1,482.x Cr)', /1,482/.test(body))
  check('Paise Samjho: purana 248 Cr wala jawab nahi', !body.includes('₹248 Cr'))
  await page.getByPlaceholder(/Ask about budget/).fill('kul budget kitna hai')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(700)
  body = await text(page)
  check('Paise Samjho: kul budget asal Indore aanke', body.includes('8,174.94') && body.includes('8,236.98'))
  await page.getByPlaceholder(/Ask about budget/).fill('meri ward ka score kya hai')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(700)
  body = await text(page)
  check('Paise Samjho: ward jawab mein asal ward (Geeta Bhawan)', body.includes('Ward 48, Geeta Bhawan'))
  await ctx.close()
}

// 2. Project cards par photo count nahi
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const body = await text(page)
  check('Tracker cards: citizen photos count nahi dikhta', !/📷 \d+/.test(body) && !body.includes('Citizen photos'))
  await ctx.close()
}

// 3. Budget wards per city asal hain
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#budget', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  let body = await text(page)
  check('Budget Indore wards: Geeta Bhawan 48', body.includes('Ward 48, Geeta Bhawan'))
  check('Budget Indore wards: Banganga 10', body.includes('Ward 10, Banganga'))
  check('Budget Indore wards: Sukhliya 33', body.includes('Ward 33, Sukhliya'))
  check('Budget: nakli ward (Civil Lines) nahi', !body.includes('Civil Lines') && !body.includes('Market Chowk'))
  await page.getByRole('button', { name: /Bhopal/ }).first().click()
  await page.waitForTimeout(600)
  body = await text(page)
  check('Budget Bhopal wards: Arera Colony 48', body.includes('Ward 48, Arera Colony'))
  check('Budget Bhopal wards: Barkatullah 54', body.includes('Ward 54, Barkatullah'))
  check('Budget Bhopal wards: Shahpura 51', body.includes('Ward 51, Shahpura'))
  await page.getByRole('button', { name: /Ujjain/ }).first().click()
  await page.waitForTimeout(600)
  body = await text(page)
  check('Budget Ujjain wards: Nanakheda', body.includes('Nanakheda Ward Kshetra'))
  check('Budget Ujjain wards: Mahakal Parisar', body.includes('Mahakal Parisar Ward Kshetra'))
  await ctx.close()
}

// 4. Dashboard ward strip asal wards
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#dashboard', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const body = await text(page)
  check('Dashboard Ward Comparison: asal Indore wards', body.includes('Ward 48, Geeta Bhawan') && body.includes('Ward 10, Banganga'))
  await ctx.close()
}

// 5. Ward search: tracker + global
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const search = page.getByPlaceholder(/Name, place/)
  await search.fill('Geeta Bhawan')
  await page.waitForTimeout(400)
  let n = await page.evaluate(() => document.querySelectorAll('article').length)
  check('Tracker search Geeta Bhawan: 1 card (MG Road)', n === 1)
  await search.fill('Banganga')
  await page.waitForTimeout(400)
  n = await page.evaluate(() => document.querySelectorAll('article').length)
  check('Tracker search Banganga: 1 card (Naala)', n === 1)
  await search.fill('')
  await page.waitForTimeout(300)
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(300)
  await page.keyboard.type('Sukhliya')
  await page.waitForTimeout(500)
  const body = await text(page)
  check('Global search Sukhliya: CC Road project milta hai', body.includes('CC Road'))
  await ctx.close()
}

// 6. Home stat: 9 wards tracked
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const body = await text(page)
  check('Home: Wards Tracked = 9', /9\s*\n?\s*Wards Tracked/.test(body) || body.includes('9'))
  await ctx.close()
}

console.log(`\n==== QA3 RESULT: ${pass} passed, ${fail} failed ====`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
await browser.close()
process.exit(0)
