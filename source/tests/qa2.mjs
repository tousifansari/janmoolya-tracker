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
const adminIn = async (page) => { await page.evaluate(() => sessionStorage.setItem('jmt_admin_ok', '1')); await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(300) }

// ---------- 1. Admin gate rejects wrong password ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#admin', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.locator('input[type="email"]').fill('admin@janmoolyatracker.com')
  await page.locator('input[type="password"]').fill('galat-password-123')
  await page.getByRole('button', { name: /Login|Enter|Jari/ }).first().click().catch(async () => {
    await page.locator('button[type="submit"]').first().click()
  })
  await page.waitForTimeout(700)
  const body = await text(page)
  check('Admin gate: galat password reject hota hai', !body.includes('Total Users') && !body.includes('All Projects'))
  check('Admin gate: koi JS error nahi', page.errors.length === 0)
  await ctx.close()
}

// ---------- 2. Admin panel: tabs + add project + city budget ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await adminIn(page)
  await page.goto(BASE + '/#admin', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  let body = await text(page)
  check('Admin: Dashboard tab khulta hai', body.includes('Total Users') || body.includes('Dashboard'))
  for (const tab of ['All Projects', 'Reports', 'Users', 'Add Project', 'City Budget']) {
    await page.getByRole('button', { name: new RegExp(tab) }).first().click()
    await page.waitForTimeout(400)
    body = await text(page)
    check(`Admin tab khulta hai: ${tab}`, body.length > 100)
  }
  // Add a project
  await page.getByRole('button', { name: /Add Project/ }).first().click()
  await page.waitForTimeout(400)
  await page.getByPlaceholder(/Project Name|e\.g\.|Road/).first().fill('QA Test Project Ratlam Road').catch(() => {})
  const nameInput = page.locator('input').nth(1)
  await nameInput.fill('QA Test Project Ratlam Road').catch(() => {})
  await page.evaluate(() => {
    const inp = [...document.querySelectorAll('input')].find(i => (i.closest('div')?.parentElement?.textContent || '').includes('Project Name'))
  })
  // fill by label proximity: first text input in the form
  await page.waitForTimeout(300)
  body = await text(page)
  check('Add Project form render hota hai', body.includes('Sanction') || body.includes('Paper Progress'))
  await ctx.close()
}

// ---------- 3. Admin add project via form (robust fill) ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await adminIn(page)
  await page.goto(BASE + '/#admin', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /Add Project/ }).first().click()
  await page.waitForTimeout(400)
  const form = page.locator('form').first()
  await form.locator('input').first().fill('QA Ratlam Road Project')
  await page.waitForTimeout(200)
  const nameVal = await form.locator('input').first().inputValue()
  check('Add Project: naam bhara gaya', nameVal === 'QA Ratlam Road Project')
  await form.locator('button[type="submit"]').click()
  await page.waitForTimeout(800)
  let body = await text(page)
  check('Add Project: publish confirmation', body.includes('published to the Project Tracker'))
  await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  body = await text(page)
  check('Add Project: Tracker mein naya project dikhta hai', body.includes('QA Ratlam Road Project'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  check('Add Project: reload ke baad bhi rehta hai (persistence)', (await text(page)).includes('QA Ratlam Road Project'))
  await ctx.close()
}

// ---------- 4. Admin city budget add -> picker ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await adminIn(page)
  await page.goto(BASE + '/#admin', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /City Budget/ }).first().click()
  await page.waitForTimeout(400)
  const filled = await page.evaluate(() => {
    const setVal = (el, val) => {
      const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
      setter.call(el, val)
      el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
    }
    const byLabel = (txt) => {
      const lab = [...document.querySelectorAll('label')].find(l => l.textContent.includes(txt))
      if (!lab) return null
      const wrap = lab.closest('div')
      return wrap ? wrap.querySelector('input, select') : null
    }
    const st = byLabel('State'); if (st) setVal(st, 'Madhya Pradesh')
    return { st: !!st }
  })
  await page.waitForTimeout(300)
  await page.evaluate(() => {
    const setVal = (el, val) => {
      const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
      setter.call(el, val)
      el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
    }
    const byLabel = (txt) => {
      const lab = [...document.querySelectorAll('label')].find(l => l.textContent.includes(txt))
      if (!lab) return null
      const wrap = lab.closest('div')
      return wrap ? wrap.querySelector('input, select') : null
    }
    const city = byLabel('City'); if (city) setVal(city, 'Ratlam')
    const inc = byLabel('Total Income'); if (inc) setVal(inc, '500')
    const exp = byLabel('Total Expenditure'); if (exp) setVal(exp, '480')
  })
  await page.evaluate(() => { const b = [...document.querySelectorAll('button[type="submit"]')][0]; b && b.click() })
  await page.waitForTimeout(800)
  let body = await text(page)
  check('City Budget: save confirmation', body.includes('saved') || body.includes('Ratlam'))
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  body = await text(page)
  check('City Budget: Home picker mein Ratlam aa gaya', body.includes('Ratlam'))
  await ctx.close()
}

// ---------- 5. Users tab + ban flow ----------
{
  const [ctx, page] = await freshPage()
  // pehle ek citizen signup
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Login' }).click()
  await page.waitForTimeout(400)
  await page.getByPlaceholder('e.g. Priya Sharma').fill('Ban Test User')
  await page.locator('input[type="number"]').fill('30')
  await page.locator('input[inputmode="numeric"]').first().fill('9811178111')
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.waitForTimeout(600)
  await adminIn(page)
  await page.goto(BASE + '/#admin', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /Users/ }).first().click()
  await page.waitForTimeout(400)
  let body = await text(page)
  check('Users tab: naya registered user dikhta hai', body.includes('Ban Test User'))
  check('Users tab: 5 demo members bhi hain', body.includes('Priya Sharma') && body.includes('Amit Kumar'))
  // ban the test user (two-step, scoped to his row)
  const row = page.locator('li, tr').filter({ hasText: 'Ban Test User' }).last()
  await row.getByRole('button', { name: /Ban User/ }).click()
  await page.waitForTimeout(400)
  await row.getByRole('button', { name: /Confirm Ban/ }).click()
  await page.waitForTimeout(600)
  const unbanVisible = await row.getByRole('button', { name: /Unban/ }).isVisible().catch(() => false)
  check('Ban: user ban ho gaya (Unban button aa gaya)', unbanVisible)
  await ctx.close()
}

// ---------- 6. Report extras: PIN + photo preview ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#report', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByPlaceholder('452001').fill('452001')
  await page.waitForTimeout(2500)
  let body = await text(page)
  check('Report PIN: koi crash nahi, note ya verify text aata hai', body.includes('Indore') || body.includes('could not be verified') || body.includes('verify nahi ho paya'))
  await page.setInputFiles('input[type="file"]', 'src/assets/proj-1.jpg')
  await page.waitForTimeout(800)
  const hasPreview = await page.evaluate(() => [...document.querySelectorAll('img')].some(i => i.alt === 'Report'))
  check('Report photo: preview dikhta hai', hasPreview)
  await ctx.close()
}

// ---------- 7. Photo Pehchano hataya gaya ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#ai', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const body = await text(page)
  check('AI page: Photo Pehchano nahi hai', !body.includes('Photo Pehchano'))
  check('AI page: Budget Samjho hai', body.includes('Budget Samjho'))
  await ctx.close()
}

// ---------- 8. Profile logged out / in ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/#profile', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  let body = await text(page)
  check('Profile bina login: login prompt dikhta hai', /Login|Sign Up/.test(body))
  await ctx.close()
}

// ---------- 9. Responsive overflow ----------
{
  const widths = [320, 360, 390, 768]
  const routes = ['#', '#dashboard', '#budget', '#projects', '#work', '#feed', '#report', '#ai']
  for (const w of widths) {
    const [ctx, page] = await freshPage(w)
    for (const r of routes) {
      await page.goto(BASE + '/' + r, { waitUntil: 'networkidle' })
      await page.waitForTimeout(300)
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      check(`Overflow ${w}px ${r}: 0`, ov <= 0)
    }
    await ctx.close()
  }
}

// ---------- 10. /admin direct path ----------
{
  const [ctx, page] = await freshPage()
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const body = await text(page)
  check('/admin path par gate khulta hai', body.includes('Admin'))
  await ctx.close()
}

console.log(`\n==== QA2 RESULT: ${pass} passed, ${fail} failed ====`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
await browser.close()
process.exit(0)
