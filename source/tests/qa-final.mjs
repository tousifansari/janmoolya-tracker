import { chromium } from 'playwright'
const browser = await chromium.launch()
let fails = 0
const check = (name, ok) => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); if (!ok) fails++ }
const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push('pageerror: ' + e.message))
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 120)) })
const body = () => page.evaluate(() => document.body.innerText)
const goto = async (h) => { await page.goto('http://localhost:4173/#' + h, { waitUntil: 'networkidle' }); await page.waitForTimeout(1800) }

// 1. Home: survey + carousel (dots gone, arrows work)
await goto('home')
let t = await body()
check('Home: survey section hai', t.includes('We Asked People') && t.includes('88.2%'))
const dotCount = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => /^Slide \d+$/.test(b.getAttribute('aria-label') || '')).length)
check('Carousel dots HATE hue hain', dotCount === 0)
const heroTitle1 = await page.evaluate(() => document.querySelector('section h1, section h2')?.innerText || '')
await page.getByRole('button', { name: 'Next slide' }).click(); await page.waitForTimeout(700)
const heroTitle2 = await page.evaluate(() => document.querySelector('section h1, section h2')?.innerText || '')
check('Carousel arrow se slide badli', heroTitle1 !== heroTitle2 && heroTitle2.length > 3)

// 2. Language toggle EN -> HL -> EN
await page.getByRole('button', { name: 'Hinglish' }).first().click(); await page.waitForTimeout(600)
t = await body()
check('Hinglish: navbar Report Karein', t.includes('Report Karein'))
check('Hinglish: survey heading badla', t.includes('Humne Logon Se Pucha'))
await goto('about')
t = await body()
check('Hinglish: About heading', t.includes('JanMoolya Tracker Ke Baare Mein'))
check('Hinglish: team heading', t.includes('Humari Team'))
await page.getByRole('button', { name: 'English' }).first().click(); await page.waitForTimeout(600)
t = await body()
check('English wapas aaya', t.includes('About JanMoolya Tracker'))

// 3. About page links
await goto('about')
const insta = await page.evaluate(() => [...document.querySelectorAll('a')].find(a => (a.getAttribute('href') || '').includes('instagram'))?.getAttribute('href') || '')
check('About: Instagram link sahi hai', insta.includes('instagram.com/janmoolyatracker'))
await page.getByRole('button', { name: /Report an issue/ }).click(); await page.waitForTimeout(900)
check('About: Report button report page par le gaya', page.url().includes('#report'))

// 4. Ctrl+K search HATA diya gaya hai (TINA ka order): shortcut ab kuch nahi kholta
await goto('home')
await page.keyboard.press('Control+k'); await page.waitForTimeout(700)
const searchInputs = await page.locator('input[placeholder*="Search projects"]').count()
check('Ctrl+K: search modal nahi khulta', searchInputs === 0)

// 5. AI page: Paise Samjho answer
await goto('ai')
const input = page.locator('input.input').first()
await input.fill('sadak par kitna kharch hota hai'); await page.waitForTimeout(300)
await page.keyboard.press('Enter'); await page.waitForTimeout(1200)
t = await body()
check('AI: sadak ke jawab mein Cr ka aankda hai', /₹[\d,]+\.?\d*\s*Cr/.test(t) && t.includes('1,482'))

// 6. Feed share button (crash check)
await goto('feed')
const shareBtns = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.innerText.includes('Share')).length)
check('Feed: Share button har post par hai', shareBtns >= 3)
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Share'))?.click())
await page.waitForTimeout(700)
t = await body()
check('Feed: Share click ke baad page theek hai', t.includes('Community Feed'))

// 7. Dashboard: mismatch pehle Naala
await goto('dashboard')
t = await body()
const idxNaala = t.indexOf('Naala'); const idxMG = t.indexOf('MG Road')
check('Dashboard: mismatch alerts hain', t.includes('Mismatch') || t.includes('mismatch'))
check('Dashboard: Naala alert MG Road se pehle (sabse zyada dislike)', idxNaala > 0 && (idxMG < 0 || idxNaala < idxMG))

// 8. Budget: Bhopal switch + wards
await goto('budget')
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.trim().startsWith('Bhopal'))?.click())
await page.waitForTimeout(900)
t = await body()
check('Budget: Bhopal kul 3,611.79 dikha', t.includes('3,611.79'))
check('Budget: Bhopal ward Arera Colony dikha', t.includes('Arera Colony'))

// 9. Console errors (Firestore unreachable wale sandbox errors ignore)
const realErrors = errors.filter(e => !/firestore|firebase|ERR_|Failed to load resource|net::/i.test(e))
check('Koi JS page error nahi aaya (' + realErrors.length + ')', realErrors.length === 0)
if (realErrors.length) console.log('  errors:', realErrors.slice(0, 5))

// 10. Mobile drawer: About link
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } })
const m = await ctx2.newPage()
await m.goto('http://localhost:4173/#home', { waitUntil: 'networkidle' }); await m.waitForTimeout(1800)
await m.getByRole('button', { name: 'Menu' }).click(); await m.waitForTimeout(600)
let mt = await m.evaluate(() => document.body.innerText)
check('Mobile drawer: About Us link hai', mt.includes('About Us'))
await m.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'About Us')?.click())
await m.waitForTimeout(900)
mt = await m.evaluate(() => document.body.innerText)
check('Mobile drawer: About page khula', mt.includes('About JanMoolya Tracker'))

console.log('\n==== QA-FINAL RESULT: ' + (fails === 0 ? 'ALL PASS' : fails + ' FAILED') + ' ====')
await browser.close()
process.exit(fails ? 1 : 0)
