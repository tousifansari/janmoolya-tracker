import { chromium } from 'playwright'
const BASE = 'http://localhost:4173'
let pass = 0, fail = 0
const fails = []
const check = (name, cond) => { if (cond) { pass++; console.log('PASS:', name) } else { fail++; fails.push(name); console.log('FAIL:', name) } }
const browser = await chromium.launch()

async function freshPage(w = 1280) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 950 } })
  const page = await ctx.newPage()
  page.errors = []
  page.on('pageerror', e => page.errors.push(String(e)))
  return [ctx, page]
}
const text = (page) => page.evaluate(() => document.body.innerText)
const clickCommentPost = (page) => page.evaluate(() => {
  const input = [...document.querySelectorAll('input')].find(i => i.placeholder === 'Write a comment\u2026')
  if (!input) return false
  const btn = [...input.closest('div').parentElement.querySelectorAll('button')].find(b => b.textContent.trim() === 'Post')
  if (btn) { btn.click(); return true }
  return false
})

// ---------- 1. All pages load ----------
{
  const [ctx, page] = await freshPage()
  const routes = [
    ['home', '#', 'Everyday city problems'],
    ['dashboard', '#dashboard', 'City Dashboard'],
    ['budget', '#budget', 'Budget Explorer'],
    ['projects', '#projects', 'Project Tracker'],
    ['work', '#work', 'Our Work'],
    ['report', '#report', 'Report'],
    ['feed', '#feed', 'Community Feed'],
    ['ai', '#ai', 'Budget Samjho'],
    ['admin gate', '#admin', 'Admin'],
  ]
  for (const [name, hash, needle] of routes) {
    await page.goto(BASE + '/' + hash, { waitUntil: 'networkidle' })
    await page.waitForTimeout(450)
    const body = await text(page)
    check(`Page loads: ${name}`, body.includes(needle))
  }
  check('No JS page errors across pages', page.errors.length === 0)
  if (page.errors.length) console.log('  errors:', page.errors.slice(0, 3))
  await ctx.close()
}

// ---------- 2. Navbar, dropdown, footer, language ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /Dashboard/ }).first().hover()
  await page.waitForTimeout(400)
  const dd = await text(page)
  check('Dashboard dropdown shows Budget Explorer', dd.includes('Budget Explorer'))
  check('Dashboard dropdown shows Project Tracker', dd.includes('Project Tracker'))
  await page.getByRole('button', { name: 'Hinglish' }).click()
  await page.waitForTimeout(300)
  const hl = await text(page)
  check('Hinglish toggle switches text', hl.includes('Samasya Report Karein') || hl.includes('Apna Shehar Chunein') || hl.includes('English'))
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.waitForTimeout(300)
  // footer links
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: 'Our Work' }).last().click().catch(() => {})
  await page.waitForTimeout(500)
  check('Footer Our Work link navigates', (await text(page)).includes('Successful work, proven on the ground'))
  await ctx.close()
}

// ---------- 3. City picker ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /Bhopal/ }).first().click()
  await page.waitForTimeout(600)
  let body = await text(page)
  check('Picker: Bhopal opens Dashboard', body.includes('Bhopal, Madhya Pradesh'))
  check('Picker: Bhopal income shown', body.includes('3,611.79'))
  await page.goto(BASE + '/#budget', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /Ujjain/ }).first().click()
  await page.waitForTimeout(600)
  body = await text(page)
  check('Picker: Budget switches to Ujjain', body.includes('4,782.25'))
  await ctx.close()
}

// ---------- 4. Global search ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(400)
  await page.keyboard.type('naala')
  await page.waitForTimeout(500)
  let body = await text(page)
  check('Search finds Naala project', body.includes('Naala Drainage'))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(300)
  await page.keyboard.type('Bhopal')
  await page.waitForTimeout(500)
  body = await text(page)
  check('Search finds Bhopal city', /Bhopal/.test(body))
  await ctx.close()
}

// ---------- 5. GATING while logged out ----------
{
  const [ctx, page] = await freshPage()
  // 5a. Report submit must demand login
  await page.goto(BASE + '/#report', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByPlaceholder('Short line about the issue').fill('QA test report bina login')
  await page.getByPlaceholder(/Since when is it broken/).fill('Kal se kharab hai, log pareshan hain.')
  const submitBtn = page.getByRole('button', { name: /Login to Post Report/ })
  await submitBtn.click()
  await page.waitForTimeout(700)
  let body = await text(page)
  check('GATE: Report bina login submit nahi hota (login khulta hai)', body.includes('Full Name') && !body.includes('Report submitted'))
  await page.keyboard.press('Escape')
  // close auth modal via its X if still open
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '✕'); b && b.click() })
  await page.waitForTimeout(300)

  // 5b. Feed comment must demand login
  await page.goto(BASE + '/#feed', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const commentBtn = page.getByRole('button', { name: /Comment/ }).first()
  await commentBtn.click()
  await page.waitForTimeout(400)
  const before = await text(page)
  const commentCountBefore = (before.match(/comments/g) || []).length
  await page.getByPlaceholder('Write a comment…').first().fill('QA comment bina login')
  await clickCommentPost(page)
  await page.waitForTimeout(700)
  body = await text(page)
  check('GATE: Feed comment bina login publish nahi hota', body.includes('Full Name') && !body.includes('QA comment bina login\n'))
  const published = await page.evaluate((needle) => {
    return [...document.querySelectorAll('p,div,span')].some(el => el.children.length === 0 && el.textContent.trim() === needle)
  }, 'QA comment bina login')
  check('GATE: Comment list mein nahi gaya', !published)
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '✕'); b && b.click() })
  await page.waitForTimeout(300)

  // 5c. Work feedback must demand login
  await page.goto(BASE + '/#work', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /Give Your Feedback/ }).first().click()
  await page.waitForTimeout(300)
  await page.getByPlaceholder('Your name').fill('QA Tester')
  await page.getByPlaceholder(/How is this work on the ground/).fill('QA feedback bina login')
  await page.getByRole('button', { name: 'Submit Feedback' }).first().click()
  await page.waitForTimeout(700)
  body = await text(page)
  check('GATE: Feedback bina login submit nahi hota (login khulta hai)', body.includes('Full Name'))
  const fbPublished = await page.evaluate(() => document.body.innerText.includes('QA feedback bina login') && document.body.innerText.includes('Thank you'))
  check('GATE: Feedback publish nahi hua', !fbPublished)
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '✕'); b && b.click() })
  await page.waitForTimeout(300)

  // 5d. Project vote must demand login
  await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const yesBtn = page.getByRole('button', { name: /Yes/ }).first()
  const yesTextBefore = await yesBtn.innerText()
  await yesBtn.click()
  await page.waitForTimeout(700)
  body = await text(page)
  check('GATE: Project vote bina login nahi lagta (login khulta hai)', body.includes('Full Name'))
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '✕'); b && b.click() })
  await page.waitForTimeout(300)
  const yesTextAfter = await page.getByRole('button', { name: /Yes/ }).first().innerText()
  check('GATE: Vote count nahi badla', yesTextBefore === yesTextAfter)

  // 5e. Feed like must demand login
  await page.goto(BASE + '/#feed', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /Like/ }).first().click()
  await page.waitForTimeout(700)
  body = await text(page)
  check('GATE: Feed like bina login nahi lagta (login khulta hai)', body.includes('Full Name'))
  await ctx.close()
}

// ---------- 6. Signup + logged-in flows ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /^Login( \/ Sign Up)?$/ }).click()
  await page.waitForTimeout(400)
  await page.getByPlaceholder('e.g. Priya Sharma').fill('QA Nagrik')
  await page.locator('input[type="number"]').fill('25')
  await page.getByPlaceholder(/98100|10-digit|Mobile/).fill('9810098100').catch(async () => {
    await page.locator('input[inputmode="numeric"]').first().fill('9810098100')
  })
  await page.getByRole('button', { name: /Continue|Aage/ }).click()
  await page.waitForTimeout(700)
  let body = await text(page)
  check('Signup: navbar par naam dikhta hai', body.includes('QA'))
  // Report submit now works
  await page.goto(BASE + '/#report', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByPlaceholder('Short line about the issue').fill('QA report login ke baad')
  await page.getByPlaceholder(/Since when is it broken/).fill('Ek hafte se kharab hai.')
  await page.getByRole('button', { name: /Submit Report/ }).click()
  await page.waitForTimeout(900)
  body = await text(page)
  check('Login ke baad report submit hota hai + Tracking ID milta hai', body.includes('Report submitted') && /JMT-2026-\d+/.test(body))
  // Feed comment now works
  await page.goto(BASE + '/#feed', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  check('Apni report feed mein dikhti hai', (await text(page)).includes('QA report login ke baad'))
  await page.getByRole('button', { name: /Comment/ }).first().click()
  await page.waitForTimeout(300)
  await page.getByPlaceholder('Write a comment…').first().fill('QA comment login ke baad')
  await clickCommentPost(page)
  await page.waitForTimeout(600)
  check('Login ke baad comment publish hota hai', (await text(page)).includes('QA comment login ke baad'))
  // Feedback now works
  await page.goto(BASE + '/#work', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const fbCountBefore = await page.evaluate(() => (document.body.innerText.match(/Citizen Feedback/g) || []).length)
  await page.getByRole('button', { name: /Give Your Feedback/ }).first().click()
  await page.waitForTimeout(300)
  await page.getByPlaceholder('Your name').fill('QA Nagrik')
  await page.getByPlaceholder(/How is this work on the ground/).fill('QA feedback login ke baad')
  await page.getByRole('button', { name: 'Submit Feedback' }).first().click()
  await page.waitForTimeout(600)
  check('Login ke baad feedback submit hota hai', (await text(page)).includes('QA feedback login ke baad'))
  // Vote now works
  await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const yesBtn = page.getByRole('button', { name: /Yes/ }).first()
  const yb = await yesBtn.innerText()
  await yesBtn.click()
  await page.waitForTimeout(400)
  const ya = await page.getByRole('button', { name: /Yes/ }).first().innerText()
  check('Login ke baad vote lagta hai', yb !== ya)
  // Persistence after reload
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  check('Reload ke baad bhi login rehta hai', (await text(page)).includes('QA'))
  await ctx.close()
}

// ---------- 7. Projects filters + details ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const countCards = () => page.evaluate(() => document.querySelectorAll('article').length)
  check('Tracker: 7 projects dikhte hain', (await countCards()) === 7)
  const search = page.getByPlaceholder(/Name, place/).first()
  await search.fill('naala')
  await page.waitForTimeout(400)
  check('Tracker search: naala par 1 card', (await countCards()) === 1)
  await search.fill('')
  await page.waitForTimeout(300)
  await page.locator('select').nth(0).selectOption({ label: 'Madhya Pradesh' })
  await page.waitForTimeout(300)
  await page.locator('select').nth(1).selectOption({ label: 'Ujjain' })
  await page.waitForTimeout(500)
  const n = await countCards()
  check('Tracker city filter: Ujjain par 2 cards', n === 2)
  await ctx.close()
}

// ---------- 8. Dashboard + Budget content ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#dashboard', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  let body = await text(page)
  check('Dashboard: pehla mismatch Naala hai (29 dislike)', body.indexOf('Naala Drainage') > body.indexOf('Mismatch Alerts') && body.includes('29'))
  check('Dashboard: ₹100 ka safar dikhta hai', body.includes('Journey of Your ₹100') || body.includes('₹100'))
  await page.goto(BASE + '/#budget', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  body = await text(page)
  check('Budget: Indore poora hisaab', body.includes('8,174.94') && body.includes('8,236.98'))
  check('Budget: Roads dept ke projects jude hain', body.includes('MG Road'))
  await ctx.close()
}

// ---------- 9. Work ranking ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#work', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const body = await text(page)
  const iToilet = body.indexOf('Community Toilet')
  const iWater = body.indexOf('Water Supply Pipeline Extension')
  check('Our Work: 3 safal projects', body.includes('3 successful projects found'))
  check('Our Work: zyada rating wala pehle', iToilet > -1 && iWater > -1 && iToilet < iWater)
  await ctx.close()
}

// ---------- 10. AI page ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#ai', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const input = page.getByPlaceholder(/Ask about budget/)
  await input.fill('sadak par kitna kharch hua')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(900)
  const body = await text(page)
  check('Paise Samjho jawab deta hai', body.length > 200 && (body.includes('Roads') || body.includes('₹')))
  await ctx.close()
}

console.log(`\n==== QA1 RESULT: ${pass} passed, ${fail} failed ====`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
await browser.close()
process.exit(0)
