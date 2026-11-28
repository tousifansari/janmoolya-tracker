// Seed data ported 1:1 from the current JanMoolya Tracker build (26 Nov 2026).
const projImg1 = '/assets/proj-1.jpg'
const projImg2 = '/assets/proj-2.jpg'
const projImg3 = '/assets/proj-3.jpg'
const projImg4 = '/assets/proj-4.jpg'
const projImg5 = '/assets/proj-5.jpg'
const projImg6 = '/assets/proj-6.jpg'
const projImg7 = '/assets/proj-7.jpg'

// Place photo for each seed project, keyed by project id (illustrative images of the work site).
export const PROJECT_IMAGES = { 1: projImg1, 2: projImg2, 3: projImg3, 4: projImg4, 5: projImg5, 6: projImg6, 7: projImg7 }
export function projectImage(p) { return PROJECT_IMAGES[p.id] || null }

export const PROJECTS = [
 {id:1, name:"Smart Road Construction, MG Road", state:"Madhya Pradesh", city:"Indore", pin:"452001", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Nagar Palik Nigam, Indore", sanctionNo:"IMC/WS/2026/118", sanctionDate:"2026-03-18", area:"Geeta Bhawan, Ward 48", loc:"Ward 48, MG Road • Regal Square se Geeta Bhawan tak", cat:"roads", ward:"Ward 48, Geeta Bhawan", approved:480, spent:300, paperPct:70, groundPct:45, paper:"In Progress", ground:"Partially Fixed", status:"In Progress", dept:"Roads Department", contractor:"Sharma Constructions", engineer:"Er. Rakesh Verma", workers:85, start:"2026-04-01", end:"2027-03-31", dates:"Apr 2026 – Mar 2027", votesYes:21, votesNo:18, photos:14},
 {id:2, name:"Naala Drainage Line Replacement", state:"Madhya Pradesh", city:"Indore", pin:"452015", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Nagar Palik Nigam, Indore", sanctionNo:"IMC/DR/2025/342", sanctionDate:"2025-12-22", area:"Banganga Industrial Area, Ward 10", loc:"Ward 10, Banganga • Industrial Belt, Sector C Naala", cat:"drainage", ward:"Ward 10, Banganga", approved:260, spent:235, paperPct:100, groundPct:10, paper:"Complete", ground:"Not Fixed", status:"Delayed", dept:"Drainage Department", contractor:"Gupta Infra Projects", engineer:"Er. Sunita Patil", workers:40, start:"2026-01-15", end:"2026-08-31", dates:"Jan 2026 – Aug 2026", votesYes:4, votesNo:29, photos:19},
 {id:3, name:"Water Pipeline Replacement, Arera Colony", state:"Madhya Pradesh", city:"Bhopal", pin:"462016", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Bhopal Nagar Palik Nigam", sanctionNo:"BMC/WW/2026/097", sanctionDate:"2026-06-11", area:"Arera Colony, Ward 48", loc:"Ward 48, Arera Colony • E-5 Sector", cat:"water", ward:"Ward 48, Arera Colony", approved:350, spent:200, paperPct:60, groundPct:55, paper:"In Progress", ground:"Partially Fixed", status:"In Progress", dept:"Water Board", contractor:"Malwa Water Works", engineer:"Er. Imran Sheikh", workers:60, start:"2026-07-01", end:"2027-01-15", dates:"Jul 2026 – Jan 2027", votesYes:16, votesNo:7, photos:9},
 {id:4, name:"Community Toilet Complex, Bus Stand", state:"Madhya Pradesh", city:"Bhopal", pin:"462001", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Bhopal Nagar Palik Nigam", sanctionNo:"BMC/SN/2026/051", sanctionDate:"2026-01-19", area:"ISBT Bus Stand, Ward 54", loc:"Ward 54, Barkatullah • Kushabhau Thakre ISBT ke paas", cat:"garbage", ward:"Ward 54, Barkatullah", approved:95, spent:92, paperPct:100, groundPct:95, paper:"Complete", ground:"Fixed ✓ Verified", status:"Completed", dept:"Sanitation Department", contractor:"CleanCity Services", engineer:"Er. Neha Gupta", workers:25, start:"2026-02-01", end:"2026-09-30", dates:"Feb 2026 – Sep 2026", votesYes:34, votesNo:3, photos:17},
 {id:5, name:"LED Streetlight Installation, Mahakal Marg", state:"Madhya Pradesh", city:"Ujjain", pin:"456001", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Ujjain Nagar Palik Nigam", sanctionNo:"UMC/EL/2026/203", sanctionDate:"2026-11-28", area:"Mahakal Marg, Mahakal Parisar", loc:"Mahakal Parisar • Mahakal Marg, Mandir Parisar Road", cat:"lights", ward:"Mahakal Parisar, Ujjain", approved:140, spent:0, paperPct:0, groundPct:0, paper:"Not Started", ground:"Not Fixed", status:"Not Started", dept:"Electrical (Streetlights)", contractor:"Not assigned yet", engineer:"Er. Vikram Singh", workers:0, start:"2026-12-15", end:"2027-05-31", dates:"Dec 2026 – May 2027", votesYes:0, votesNo:0, photos:0},
 {id:6, name:"CC Road and Footpath Construction, Vijay Nagar", state:"Madhya Pradesh", city:"Indore", pin:"452010", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Nagar Palik Nigam, Indore", sanctionNo:"IMC/RD/2026/064", sanctionDate:"2026-02-14", area:"Vijay Nagar, Ward 33", loc:"Ward 33, Vijay Nagar-Sukhliya • Scheme 54", cat:"roads", ward:"Ward 33, Sukhliya", approved:260, spent:248, paperPct:100, groundPct:92, paper:"Complete", ground:"Fixed", status:"Completed", dept:"Roads Department", contractor:"Agrawal Infrastructure", engineer:"Er. Sunita Patil", workers:64, start:"2026-04-05", end:"2026-10-20", dates:"Apr 2026 – Oct 2026", votesYes:41, votesNo:4, photos:12},
 {id:7, name:"Water Supply Pipeline Extension, Nanakheda", state:"Madhya Pradesh", city:"Ujjain", pin:"456010", bodyType:"Nagar Nigam (Municipal Corporation)", bodyName:"Ujjain Nagar Palik Nigam", sanctionNo:"UMC/WW/2025/141", sanctionDate:"2025-10-03", area:"Nanakheda", loc:"Nanakheda • Bus Stand Road", cat:"water", ward:"Nanakheda, Ujjain", approved:185, spent:176, paperPct:100, groundPct:88, paper:"Complete", ground:"Fixed", status:"Completed", dept:"Water Board", contractor:"Sharma Water Works", engineer:"Er. Mohd. Salim", workers:38, start:"2025-11-10", end:"2026-06-15", dates:"Nov 2025 – Jun 2026", votesYes:27, votesNo:5, photos:9}
];

// Real wards of each city (names and numbers from the official municipal ward lists).
// Indore and Bhopal have 85 wards each; Ujjain has 54 wards, known by number - its
// ward cards below use the real locality (kshetra) names without invented numbers.
// The money figures per ward are a model split (no corporation publishes ward totals).
export const CITY_WARDS = {
  Indore: [
    {id:'i48',name:'Ward 48, Geeta Bhawan',allocated:21.5,spent:13.8,risk:'Medium',riskScore:57,score:63,issues:['Roads & Bridges','Garbage','Streetlights'],issuesHl:['Sadak aur Pul','Garbage / Kachra','Band Streetlight'],breakdown:[['Roads & Footpaths',4.6],['Water Supply',2.8],['Drainage',2.6],['Garbage & Sanitation',2.4],['Streetlights & Parks',1.4]],note:'MG Road corridor ward. The Smart Road work is in progress here, paper ahead of ground.',noteHl:'MG Road corridor wala ward. Yahan Smart Road ka kaam chal raha hai, kagaz zameen se aage hai.'},
    {id:'i10',name:'Ward 10, Banganga',allocated:24.8,spent:9.5,risk:'High',riskScore:86,score:38,issues:['Drainage','Roads & Bridges','Garbage'],issuesHl:['Naali Jaam','Sadak aur Pul','Garbage / Kachra'],breakdown:[['Roads & Footpaths',2.9],['Water Supply',2.2],['Drainage',2.6],['Garbage & Sanitation',1.3],['Streetlights & Parks',0.5]],note:'Industrial belt ward. The naala project here is paper-complete but almost nothing on the ground, the biggest mismatch on the platform.',noteHl:'Industrial belt wala ward. Yahan ka naala project kagaz par poora hai lekin zameen par lagbhag kuch nahi, platform ki sabse badi gadbad.'},
    {id:'i33',name:'Ward 33, Sukhliya',allocated:16.9,spent:14.6,risk:'Low',riskScore:24,score:84,issues:['Garbage','Public Toilets','Streetlights'],issuesHl:['Garbage / Kachra','Public Toilet','Band Streetlight'],breakdown:[['Roads & Footpaths',5.4],['Water Supply',3.0],['Drainage',2.2],['Garbage & Sanitation',2.5],['Streetlights & Parks',1.5]],note:'Strong ward. The CC Road and footpath work near Vijay Nagar-Sukhliya finished on time and citizens verified it.',noteHl:'Mazboot ward. Vijay Nagar-Sukhliya ke paas CC Road aur footpath ka kaam samay par poora hua aur nagrikon ne verify kiya.'}
  ],
  Bhopal: [
    {id:'b48',name:'Ward 48, Arera Colony',allocated:19.6,spent:12.4,risk:'Medium',riskScore:52,score:66,issues:['Water Supply','Garbage','Roads & Bridges'],issuesHl:['Paani Supply','Garbage / Kachra','Sadak aur Pul'],breakdown:[['Roads & Footpaths',3.4],['Water Supply',4.1],['Drainage',2.0],['Garbage & Sanitation',2.1],['Streetlights & Parks',0.8]],note:'The water pipeline replacement is in progress here and mostly matching on the ground.',noteHl:'Yahan paani ki pipeline badalne ka kaam chal raha hai aur zyadaatar zameen se mel khata hai.'},
    {id:'b54',name:'Ward 54, Barkatullah',allocated:15.8,spent:14.9,risk:'Low',riskScore:20,score:85,issues:['Public Toilets','Garbage','Streetlights'],issuesHl:['Public Toilet','Garbage / Kachra','Band Streetlight'],breakdown:[['Roads & Footpaths',3.2],['Water Supply',2.6],['Drainage',2.1],['Garbage & Sanitation',4.4],['Streetlights & Parks',2.6]],note:'Best ward of Bhopal on the platform. The ISBT toilet complex finished here and citizens rated it 4.7 stars.',noteHl:'Platform par Bhopal ka sabse achha ward. Yahan ISBT toilet complex poora hua aur nagrikon ne use 4.7 star diye.'},
    {id:'b51',name:'Ward 51, Shahpura',allocated:17.2,spent:10.8,risk:'Medium',riskScore:55,score:61,issues:['Drainage','Water Supply','Garbage'],issuesHl:['Naali Jaam','Paani Supply','Garbage / Kachra'],breakdown:[['Roads & Footpaths',3.0],['Water Supply',2.9],['Drainage',2.4],['Garbage & Sanitation',1.7],['Streetlights & Parks',0.8]],note:'Lake-side ward. Drainage around Shahpura lake needs follow-up before the monsoon.',noteHl:'Jheel kinare wala ward. Monsoon se pehle Shahpura jheel ke aas-paas ki drainage par follow-up chahiye.'}
  ],
  Ujjain: [
    {id:'u-mahakal',name:'Mahakal Parisar Ward Kshetra',allocated:18.9,spent:6.2,risk:'High',riskScore:74,score:47,issues:['Streetlights','Roads & Bridges','Drainage'],issuesHl:['Band Streetlight','Sadak aur Pul','Naali Jaam'],breakdown:[['Roads & Footpaths',2.4],['Water Supply',1.6],['Drainage',1.2],['Garbage & Sanitation',0.7],['Streetlights & Parks',0.3]],note:'Temple corridor area. The Mahakal Marg LED streetlight work is sanctioned but has not started yet.',noteHl:'Mandir corridor kshetra. Mahakal Marg ki LED streetlight ka kaam sanction hai lekin abhi shuru nahi hua.'},
    {id:'u-nana',name:'Nanakheda Ward Kshetra',allocated:14.6,spent:13.1,risk:'Low',riskScore:22,score:83,issues:['Water Supply','Garbage','Public Toilets'],issuesHl:['Paani Supply','Garbage / Kachra','Public Toilet'],breakdown:[['Roads & Footpaths',3.1],['Water Supply',5.2],['Drainage',1.8],['Garbage & Sanitation',2.0],['Streetlights & Parks',1.0]],note:'The water pipeline extension finished here and citizens verified it, daily supply improved.',noteHl:'Yahan paani ki pipeline ka kaam poora hua aur nagrikon ne verify kiya, roz ki supply behtar hui.'},
    {id:'u-freeganj',name:'Freeganj Ward Kshetra',allocated:16.4,spent:10.5,risk:'Medium',riskScore:50,score:64,issues:['Garbage','Roads & Bridges','Streetlights'],issuesHl:['Garbage / Kachra','Sadak aur Pul','Band Streetlight'],breakdown:[['Roads & Footpaths',3.3],['Water Supply',2.4],['Drainage',1.9],['Garbage & Sanitation',2.0],['Streetlights & Parks',0.9]],note:'Main market and station side ward. Garbage collection points draw the most reports here.',noteHl:'Main bazaar aur station side wala ward. Yahan garbage collection points par sabse zyada reports aati hain.'}
  ]
};

export const CITY_WARD_ACTIVITY = {
 i48:[['10 Nov 2026','MG Road Smart Road work: citizen photos show ground work behind the paper progress.','MG Road Smart Road kaam: nagrikon ki photos dikhati hain ki zameeni kaam kagaz se peeche hai.'],['28 Oct 2026','Geeta Bhawan chowk par streetlight repair batch complete.','Geeta Bhawan chowk par streetlight repair batch poora.']],
 i10:[['13 Nov 2026','Banganga naala project: paper 100%, ground 10%, 29 citizens voted work not done.','Banganga naala project: kagaz 100%, zameen 10%, 29 nagrikon ne vote diya ki kaam nahi hua.'],['05 Nov 2026','Industrial belt mein drainage jaam ki sabse zyada reports aayi.','Industrial belt mein drainage jaam ki sabse zyada reports aayi.']],
 i33:[['09 Nov 2026','CC Road aur footpath ka kaam citizen-verified complete, 41 Haan vote.','CC Road aur footpath ka kaam citizen-verified complete, 41 Haan vote.'],['22 Oct 2026','Sukhliya mein naya garbage collection point shuru.','Sukhliya mein naya garbage collection point shuru.']],
 b48:[['08 Nov 2026','Arera Colony pipeline work aadhe se zyada poora, ground kagaz ke saath chal raha hai.','Arera Colony pipeline ka kaam aadhe se zyada poora, zameen kagaz ke saath chal rahi hai.'],['26 Oct 2026','E-5 sector mein paani leakage ki report par kaam shuru.','E-5 sector mein paani leakage ki report par kaam shuru.']],
 b54:[['11 Nov 2026','ISBT toilet complex ko nagrikon ne 4.7 star rating di.','ISBT toilet complex ko nagrikon ne 4.7 star rating di.'],['30 Oct 2026','Barkatullah kshetra mein safai drive poora.','Barkatullah kshetra mein safai drive poora.']],
 b51:[['06 Nov 2026','Shahpura jheel ke paas drainage safai ka follow-up pending hai.','Shahpura jheel ke paas drainage safai ka follow-up pending hai.'],['19 Oct 2026','Paani supply ki 3 reports is hafte aayi.','Paani supply ki 3 reports is hafte aayi.']],
 'u-mahakal':[['12 Nov 2026','Mahakal Marg LED kaam sanction ke baad bhi shuru nahi hua, nagrik intezaar kar rahe hain.','Mahakal Marg LED kaam sanction ke baad bhi shuru nahi hua, nagrik intezaar kar rahe hain.'],['29 Oct 2026','Mandir parisar ke aas-paas safai par zyada dhyaan diya gaya.','Mandir parisar ke aas-paas safai par zyada dhyaan diya gaya.']],
 'u-nana':[['09 Nov 2026','Nanakheda pipeline kaam citizen-verified, 27 Haan vote.','Nanakheda pipeline kaam citizen-verified, 27 Haan vote.'],['21 Oct 2026','Bus stand road par naye garbage bins lage.','Bus stand road par naye garbage bins lage.']],
 'u-freeganj':[['07 Nov 2026','Freeganj bazaar kshetra mein garbage reports zyada aayi.','Freeganj bazaar kshetra mein garbage reports zyada aayi.'],['24 Oct 2026','Station road par streetlight repair batch sanction.','Station road par streetlight repair batch sanction.']]
};

export const BUDGET_DEPTS = [
 {name:'Roads Department',head:'Roads & Footpaths',spent:248},
 {name:'Water Board',head:'Water Supply',spent:186},
 {name:'Sanitation Department',head:'Garbage & Sanitation',spent:164},
 {name:'Drainage Department',head:'Drainage',spent:128},
 {name:'Electrical (Streetlights)',head:'Streetlights & Parks',spent:74},
 {name:'Horticulture / Parks',head:'Streetlights & Parks',spent:62}
];

// Real city budget: Nagar Palik Nigam Indore, approved budget (Parishad Prastav 02, 03 Apr 2025).
// Totals below are the official figures from page 1 of that budget document (Rs lakh converted to Rs Cr).
export const CITY_BUDGET = {
  city: 'Indore', bodyEn: 'Indore Municipal Corporation', bodyHl: 'Nagar Palik Nigam, Indore',
  fy: '2025-26', prevFy: '2024-25',
  income: 8174.94, expenditure: 8236.98, deficit: 164.27, reserve: 102.23,
  prevIncome: 8302.47, prevExpenditure: 8232.27,
  sourceEn: 'Source: Nagar Palik Nigam Indore, Approved Budget FY 2025-26 (Parishad Prastav 02, 03 April 2025)',
  sourceHl: 'Source: Nagar Palik Nigam Indore, Approved Budget FY 2025-26 (Parishad Prastav 02, 03 April 2025)'
};

// Where the money comes from: shares of every Rs 100 of city income.
// The total income above is official; this split is a simple model in the standard
// municipal heads (National Municipal Accounts Manual) so citizens can follow it.
export const INCOME_HEADS = [
  { key: 'grants', nameEn: 'Government Grants', nameHl: 'Sarkari Anudaan (Grant)', share: 38, noteEn: 'Money from the State and Central Government for schemes and city development.', noteHl: 'Rajya aur Kendra Sarkar se yojanaon aur shehar ke vikas ke liye mila paisa.' },
  { key: 'property', nameEn: 'Property Tax', nameHl: 'Sampatti Kar (Property Tax)', share: 22, noteEn: 'The yearly tax on homes, shops and plots. The biggest income the city earns itself.', noteHl: 'Ghar, dukaan aur plot par lagne wala saalana kar. Shehar ki sabse badi apni aamdani.' },
  { key: 'otherfees', nameEn: 'Other Taxes and Fees', nameHl: 'Anya Kar aur Fees', share: 16, noteEn: 'Building permission, licences, advertisement and other municipal fees.', noteHl: 'Bhawan anumati, licence, vigyapan aur anya nagar shulk.' },
  { key: 'watercharges', nameEn: 'Water Charges', nameHl: 'Paani ke Charges', share: 14, noteEn: 'What citizens pay for water connections and supply.', noteHl: 'Paani ke connection aur supply ke liye nagrikon se liya gaya shulk.' },
  { key: 'otherincome', nameEn: 'Other Income', nameHl: 'Anya Aay', share: 10, noteEn: 'Rent from municipal property, interest and other receipts.', noteHl: 'Nagar sampatti ka kiraya, byaj aur anya praptiyan.' }
];

// Where the money goes: shares of every Rs 100 of city expenditure.
// The total expenditure above is official; this split is a simple model in the standard
// municipal heads so citizens can follow it. dept matches project departments where they exist.
export const EXPENSE_DEPTS = [
  { key: 'water', dept: 'Water Board', nameEn: 'Water Supply (Jal Praday)', nameHl: 'Paani (Jal Praday)', share: 28, noteEn: 'Bringing Narmada water to every home, pipelines and treatment.', noteHl: 'Narmada ka paani har ghar tak pahunchana, pipeline aur shodhan.' },
  { key: 'roads', dept: 'Roads Department', nameEn: 'Roads and Bridges', nameHl: 'Sadak aur Pul', share: 18, noteEn: 'New roads, bridges and repair of existing roads.', noteHl: 'Nayi sadkein, pul aur purani sadkon ki marammat.' },
  { key: 'sanitation', dept: 'Sanitation Department', nameEn: 'Cleanliness and Garbage', nameHl: 'Safai aur Kachra', share: 14, noteEn: 'Daily garbage collection, cleaning and waste processing.', noteHl: 'Roz ka kachra sangrahan, safai aur kachra prasanskaran.' },
  { key: 'establishment', dept: null, nameEn: 'Salaries and Offices', nameHl: 'Tankhwah aur Karyalaya', share: 14, noteEn: 'Salaries of municipal staff and the running of offices.', noteHl: 'Nagar karmachariyon ki tankhwah aur karyalayon ka kharcha.' },
  { key: 'drainage', dept: 'Drainage Department', nameEn: 'Drainage and Sewer', nameHl: 'Naali aur Sewer', share: 10, noteEn: 'Drains, sewer lines and keeping rainwater flowing out.', noteHl: 'Naaliyan, sewer line aur barish ke paani ki nikaasi.' },
  { key: 'other', dept: null, nameEn: 'Other Departments', nameHl: 'Anya Vibhag', share: 8, noteEn: 'Education, health, social welfare and other smaller departments.', noteHl: 'Shiksha, swasthya, samaj kalyan aur anya chhote vibhag.' },
  { key: 'lights', dept: 'Electrical (Streetlights)', nameEn: 'Streetlights and Electricity', nameHl: 'Streetlight aur Bijli', share: 5, noteEn: 'Streetlights on the roads, their electricity and repair.', noteHl: 'Sadkon par streetlight, unki bijli aur marammat.' },
  { key: 'parks', dept: 'Horticulture / Parks', nameEn: 'Parks and Gardens', nameHl: 'Park aur Bagh', share: 3, noteEn: 'Parks, gardens, trees and the green spaces of the city.', noteHl: 'Shehar ke park, bagh, ped aur hariyali.' }
];

export const SEG_COLORS = ['#0F3357', '#2EB3C9', '#1B6A85', '#5B84A8', '#7FC7D6', '#94A3B8', '#3A5A78', '#C7D2DE'];
export const SURVEY_STATS = [
  { pct: 88.2, en: "do not know where to check their city's budget", hl: "logon ko pata hi nahi ki unke shehar ka budget kahan dekhein", shortEn: "don't know where the budget is", shortHl: "ko nahi pata budget kahan dekhein" },
  { pct: 94.1, en: "have never found any information about a project's spending", hl: "logon ko kabhi kisi project ke kharch ki jaankari mili hi nahi", shortEn: "never found project spending info", shortHl: "ko project ke kharch ki jaankari kabhi mili nahi" },
  { pct: 100, en: "say public money and ground work must be connected", hl: "log kehte hain ki public paisa aur zameen ka kaam judna hi chahiye", shortEn: "want money linked to ground work", shortHl: "chahte hain paisa aur kaam judein" },
  { pct: 94.1, en: "would definitely or probably use such a platform", hl: "log aisi website zaroor ya shayad use karenge", shortEn: "would use such a platform", shortHl: "aisi website use karenge" }
];

// Citizen feedback (star ratings + comments) on completed work, keyed by project id.
// Citizens add their own from the Our Work page; ratings are the average of all feedback.
export const SEED_FEEDBACKS = {
  4: [
    { name: 'Ramesh Gupta', stars: 5, text: 'Bus stand par saaf toilet, bahut badhiya kaam. Paani bhi hai.', ts: 1762300000000 },
    { name: 'Sunita Devi', stars: 5, text: 'Pehle se bahut behtar hai. Mahilaon ke liye alag vyavastha achhi lagi.', ts: 1762900000000 },
    { name: 'Imran Khan', stars: 4, text: 'Shaam ko bheed zyada hoti hai, ek aur block bane to aur acha hoga.', ts: 1763500000000 }
  ],
  6: [
    { name: 'Kavita Sharma', stars: 5, text: 'Sadak aur footpath dono ban gaye, bachche surakshit chalte hain.', ts: 1761800000000 },
    { name: 'Arjun Malhotra', stars: 5, text: 'Samay par poora hua kaam. Is area mein pehli baar aisa dekha.', ts: 1762400000000 },
    { name: 'Farhan Ali', stars: 4, text: 'Kaam acha hai, bas ek jagah footpath abhi thoda ooncha-neecha hai.', ts: 1763100000000 }
  ],
  7: [
    { name: 'Meena Bai', stars: 5, text: 'Ab nal se roz paani aata hai, tanki par nirbhar nahi rehna padta.', ts: 1761500000000 },
    { name: 'Suresh Chandra', stars: 4, text: 'Pipeline ka kaam acha hua, pressure kabhi kabhi kam hota hai.', ts: 1762100000000 },
    { name: 'Anita Verma', stars: 4, text: 'Mohalle mein paani ki samasya bahut had tak khatam ho gayi.', ts: 1762700000000 }
  ]
};

// A project counts as successful work when it is Completed, the ground progress
// is high, and more citizens voted Yes than No. The system decides this itself.
export function isSuccessful(p) {
  return (p.effStatus || p.status) === 'Completed' && (p.groundPct || 0) >= 80 && (p.votesYes || 0) > (p.votesNo || 0)
}

// Average star rating from a feedback list: { avg (1 decimal), count }
export function ratingOf(list) {
  if (!list || list.length === 0) return { avg: 0, count: 0 }
  const sum = list.reduce((s, f) => s + (f.stars || 0), 0)
  return { avg: Math.round((sum / list.length) * 10) / 10, count: list.length }
}

// Local bodies a project or a city budget can belong to (the body the money is passed to).
export const BODY_TYPES = ['Nagar Nigam (Municipal Corporation)', 'Nagar Palika (Municipal Council)', 'Nagar Panchayat', 'Cantonment Board', 'Gram Panchayat', 'Zila Panchayat', 'Other Government Body'];

// City budgets known to the platform. Indore is seeded from its official budget document;
// more cities are added by the Admin (City Budget tab) and stored on the device.
export const SEED_CITY_BUDGETS = {
  'Indore': {
    state: 'Madhya Pradesh', city: 'Indore', bodyType: 'Nagar Nigam (Municipal Corporation)', bodyName: 'Nagar Palik Nigam, Indore',
    fy: '2025-26', prevFy: '2024-25', income: 8174.94, expenditure: 8236.98, deficit: 164.27, reserve: 102.23,
    prevIncome: 8302.47, prevExpenditure: 8232.27,
    sourceEn: 'Source: Nagar Palik Nigam Indore, Approved Budget FY 2025-26 (Parishad Prastav 02, 03 April 2025)',
    sourceHl: 'Source: Nagar Palik Nigam Indore, Approved Budget FY 2025-26 (Parishad Prastav 02, 03 April 2025)'
  },
  'Bhopal': {
    state: 'Madhya Pradesh', city: 'Bhopal', bodyType: 'Nagar Nigam (Municipal Corporation)', bodyName: 'Bhopal Nagar Palik Nigam',
    fy: '2025-26', income: 3611.79, expenditure: 3611.79, deficit: 110.07, reserve: 110.07,
    sourceEn: 'Source: Bhopal Nagar Palik Nigam, Budget FY 2025-26 (presented in the Parishad, 03 April 2025)',
    sourceHl: 'Source: Bhopal Nagar Palik Nigam, Budget FY 2025-26 (Parishad mein prastut, 03 April 2025)'
  },
  'Ujjain': {
    state: 'Madhya Pradesh', city: 'Ujjain', bodyType: 'Nagar Nigam (Municipal Corporation)', bodyName: 'Ujjain Nagar Palik Nigam',
    fy: '2025-26', income: 4782.25, expenditure: 4761.25,
    sourceEn: 'Source: Ujjain Nagar Palik Nigam, Budget FY 2025-26 (passed by the Parishad, with a surplus of ₹21 Cr)',
    sourceHl: 'Source: Ujjain Nagar Palik Nigam, Budget FY 2025-26 (Parishad dwara parit, ₹21 Cr ke labh ke saath)'
  }
};

export function fmtCr(v) { const n = Number(v) || 0; return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Cr' }
export function fmtCr1(v) { const n = Number(v) || 0; return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' Cr' }
export function shareAmt(total, share) { return Math.round(((total * share) / 100) * 10) / 10 }

export const ISSUE_CATS = [
 {key:'roads',en:'Roads / Potholes',hl:'Sadak / Gaddhe',rep:'Sadak / Gaddha (Pothole)',proj:'roads'},
 {key:'garbage',en:'Garbage',hl:'Garbage / Kachra',rep:'Garbage / Kachra',proj:'garbage'},
 {key:'drainage',en:'Drainage',hl:'Drainage / Naali',rep:'Drainage / Naali Jaam',proj:'drainage'},
 {key:'water',en:'Water Supply',hl:'Paani Supply',rep:'Paani Supply / Leakage',proj:'water'},
 {key:'lights',en:'Streetlights',hl:'Streetlight',rep:'Streetlight Band',proj:'lights'},
 {key:'toilets',en:'Public Toilets',hl:'Public Toilets (Shauchalay)',rep:'Public Toilet',proj:null},
 {key:'safety',en:'Safety / Traffic (incl. stray animals)',hl:'Safety / Traffic (Awara Pashu shamil)',rep:'Awara Pashu (Stray Animals on Road)',proj:null}
];

export const REPORT_STATUSES = ['Submitted','In Progress','Resolved','Citizen Verified'];

export const SEED_REPORTS = [
 {id:'JMT-2026-1042',cat:'Potholes / Roads',ward:'Ward 48, Geeta Bhawan',loc:'Station Road',status:'In Progress',priority:'High',mine:false,state:'Madhya Pradesh',city:'Indore',pincode:'452002',area:'Station Road'},
 {id:'JMT-2026-1037',cat:'Drainage',ward:'Ward 10, Banganga',loc:'Industrial Belt',status:'Submitted',priority:'High',mine:false,state:'Madhya Pradesh',city:'Indore',pincode:'452015',area:'Industrial Belt'},
 {id:'JMT-2026-1029',cat:'Garbage',ward:'Ward 57, Devi Ahilyabai',loc:'Market Chowk',status:'In Progress',priority:'Medium',mine:false,state:'Madhya Pradesh',city:'Indore',pincode:'452002',area:'Market Chowk'},
 {id:'JMT-2026-1018',cat:'Streetlights',ward:'Ward 81, Annapurna',loc:'Riverfront',status:'Resolved',priority:'Medium',mine:false,state:'Madhya Pradesh',city:'Indore',pincode:'452001',area:'Riverfront'},
 {id:'JMT-2026-1009',cat:'Public Toilets',ward:'Ward 33, Sukhliya',loc:'Green Park',status:'Citizen Verified',priority:'Low',mine:false,state:'Madhya Pradesh',city:'Indore',pincode:'452001',area:'Green Park'}
];

export const FEED_SEEDS = [
 {key:'seed1',name:'Priya Sharma',verified:true,catKey:'roads',state:'Madhya Pradesh',city:'Indore',pincode:'452001',area:'Vijay Nagar',status:'In Progress',hoursAgo:2,tid:'JMT-2026-0987',likes:42,dislikes:3,
  titleEn:'Huge pothole at Vijay Nagar square, two-wheelers slipping daily',titleHl:'Vijay Nagar chowk par bada gaddha, roz two-wheeler fisal rahe hain',
  descEn:'The pothole near the main crossing has been growing for a month. It fills with water after every rain and at night there is no light on it. Please fix before someone gets seriously hurt.',descHl:'Main crossing ke paas wala gaddha ek mahine se badh raha hai. Har barish ke baad paani bhar jaata hai aur raat mein us par light bhi nahi padti. Koi buri tarah ghayal ho, usse pehle please fix karo.',
  comments:[{name:'Rohit Gupta',textEn:'Same spot, my scooter skidded here last week. Fully support this.',textHl:'Yehi jagah, pichhle hafte mera scooter yahin fisla tha. Full support.',hoursAgo:1},{name:'Anjali Verma',textEn:'Status shows In Progress, hope the work actually starts this time.',textHl:'Status In Progress dikh raha hai, ummeed hai is baar kaam sach mein shuru hoga.',hoursAgo:1}]},
 {key:'seed2',name:'Rahul Verma',verified:false,catKey:'garbage',state:'Delhi',city:'New Delhi',pincode:'110001',area:'Connaught Place',status:'Resolved',hoursAgo:26,tid:'JMT-2026-0954',likes:28,dislikes:1,
  titleEn:'Garbage heap behind the market finally cleared',titleHl:'Market ke peeche wala kachre ka dher aakhir saaf ho gaya',
  descEn:'The dump behind the market block was not picked up for 9 days. After this report it was cleared in two days, sharing the update so neighbours can verify.',descHl:'Market block ke peeche wala kachra 9 din se utha hi nahi tha. Is report ke baad do din mein saaf ho gaya, update share kar raha hoon taaki padosi verify kar saken.',
  comments:[{name:'Meena Joshi',textEn:'Verified from my side too, the lane is clean now.',textHl:'Meri taraf se bhi verified, gali ab saaf hai.',hoursAgo:20}]},
 {key:'seed3',name:'Anonymous Citizen',verified:false,catKey:'lights',state:'Maharashtra',city:'Pune',pincode:'411001',area:'Koregaon Park',status:'Submitted',hoursAgo:5,tid:'JMT-2026-1011',likes:15,dislikes:0,
  titleEn:'All streetlights off in Lane 5 for four nights',titleHl:'Lane 5 ki saari streetlights chaar raaton se band',
  descEn:'The whole lane goes dark after 7 pm. Senior citizens here are scared to step out. Posting anonymously, but the location and photos are exact.',descHl:'Poori gali shaam 7 baje ke baad andheri ho jaati hai. Yahan ke buzurg bahar nikalne se darte hain. Naam chhupa kar post kar raha hoon, lekin location aur photos bilkul sahi hain.',
  comments:[]},
 {key:'seed4',name:'Sneha Patil',verified:true,catKey:'drainage',state:'Karnataka',city:'Bengaluru',pincode:'560001',area:'MG Road',status:'Citizen Verified',hoursAgo:50,tid:'JMT-2026-0918',likes:57,dislikes:2,
  titleEn:'Blocked drain unclogged and covered, verified on the ground',titleHl:'Jaam naali khul gayi aur dhak bhi di, ground par verify kiya',
  descEn:'The drain that flooded our street every monsoon has been cleaned and fitted with a proper cover. I checked it myself after the last rain, no waterlogging. This is how every report should end.',descHl:'Jo naali har monsoon mein hamari gali mein paani bhar deti thi, wo saaf ho gayi hai aur us par sahi cover bhi lag gaya hai. Pichhli barish ke baad maine khud check kiya, paani nahi bhara. Har report ka ant aisa hi hona chahiye.',
  comments:[{name:'Arjun Nair',textEn:'Walked past yesterday, can confirm, fully fixed.',textHl:'Kal wahan se guzra, confirm karta hoon, poora fix ho gaya.',hoursAgo:30},{name:'Kavita Rao',textEn:'Great example. Wish our ward drains got the same treatment.',textHl:'Bahut badhiya example. Kaash hamare ward ki naaliyon ke saath bhi aisa hi ho.',hoursAgo:28}]},
 {key:'seed5',name:'Amit Kumar',verified:false,catKey:'cattle',state:'Uttar Pradesh',city:'Lucknow',pincode:'226001',area:'Hazratganj',status:'Submitted',hoursAgo:9,tid:'JMT-2026-1002',likes:19,dislikes:4,
  titleEn:'Stray cattle sitting in the middle of the crossing every evening',titleHl:'Har shaam crossing ke beech mein baith jaate hain awara pashu',
  descEn:'Around 6–8 cattle settle right at the crossing near the metro gate every evening. Traffic has to squeeze around them and two near-miss accidents happened this week.',descHl:'Har shaam metro gate ke paas wale crossing par 6–8 pashu baith jaate hain. Traffic ko unke aas-paas se ghumkar nikalna padta hai aur is hafte do baar accident hote-hote bacha.',
  comments:[{name:'Farhan Ali',textEn:'Saw the same near Aminabad. This needs a permanent shelter solution, not just chasing them away.',textHl:'Aminabad ke paas bhi yehi haal hai. Iska permanent shelter solution chahiye, sirf bhagana nahi.',hoursAgo:7}]}
];

export const FEED_CAT_LABEL = {roads:{en:'Road / Pothole',hl:'Sadak / Gaddha'},garbage:{en:'Garbage',hl:'Garbage / Kachra'},drainage:{en:'Drainage / Blocked Drain',hl:'Drainage / Naali Jaam'},water:{en:'Water Supply / Leakage',hl:'Paani Supply / Leakage'},lights:{en:'Streetlight Not Working',hl:'Streetlight Band'},toilets:{en:'Public Toilet',hl:'Public Toilet'},cattle:{en:'Stray Animals on Road',hl:'Awara Pashu (Sadak Par Janwar)'},other:{en:'Civic Issue',hl:'Civic Issue'}};

export const FEED_CAT_EMOJI = {roads:'🕳️',garbage:'🗑️',drainage:'🌊',water:'💧',lights:'💡',toilets:'🚻',cattle:'🐄',other:'📍'};

export const INDIA_GEO = {
 'Andhra Pradesh':['Visakhapatnam','Vijayawada','Guntur','Nellore','Tirupati','Kurnool','Rajahmundry','Kakinada','Anantapur','Kadapa','Eluru','Ongole','Chittoor','Machilipatnam'],
 'Arunachal Pradesh':['Itanagar','Naharlagun','Pasighat','Tawang','Ziro','Bomdila'],
 'Assam':['Guwahati','Dibrugarh','Silchar','Jorhat','Nagaon','Tinsukia','Tezpur','Bongaigaon','Dhubri','Goalpara'],
 'Bihar':['Patna','Gaya','Bhagalpur','Muzaffarpur','Darbhanga','Purnia','Arrah','Begusarai','Katihar','Munger','Chapra','Bihar Sharif','Hajipur','Siwan','Motihari'],
 'Chhattisgarh':['Raipur','Bhilai','Bilaspur','Durg','Korba','Rajnandgaon','Raigarh','Jagdalpur','Ambikapur','Dhamtari'],
 'Goa':['Panaji','Margao','Vasco da Gama','Mapusa','Ponda','Bicholim','Curchorem','Sanquelim'],
 'Gujarat':['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh','Anand','Nadiad','Morbi','Mehsana','Bharuch','Porbandar','Valsad','Navsari'],
 'Haryana':['Gurugram','Faridabad','Panipat','Ambala','Karnal','Hisar','Rohtak','Panchkula','Yamunanagar','Sonipat','Sirsa','Bahadurgarh','Jind','Kaithal','Rewari','Palwal'],
 'Himachal Pradesh':['Shimla','Dharamshala','Mandi','Solan','Kangra','Hamirpur','Una','Kullu','Chamba','Bilaspur','Nahan'],
 'Jharkhand':['Ranchi','Jamshedpur','Dhanbad','Bokaro','Hazaribagh','Giridih','Deoghar','Daltonganj','Phusro','Chaibasa'],
 'Karnataka':['Bengaluru','Mysuru','Hubballi','Mangaluru','Belagavi','Kalaburagi','Davanagere','Ballari','Shivamogga','Tumakuru','Udupi','Hassan','Raichur','Bidar','Hospet','Gadag','Chitradurga','Mandya'],
 'Kerala':['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha','Kottayam','Palakkad','Malappuram','Kasaragod','Pathanamthitta'],
 'Madhya Pradesh':['Indore','Bhopal','Jabalpur','Gwalior','Ujjain','Sagar','Dewas','Ratlam','Rewa','Satna','Khandwa','Burhanpur','Singrauli','Bhind','Chhindwara','Guna','Shivpuri','Vidisha','Chhatarpur','Damoh','Mandsaur','Khargone','Neemuch','Hoshangabad','Itarsi','Sehore','Betul','Morena','Datia','Nagda'],
 'Maharashtra':['Mumbai','Pune','Nagpur','Nashik','Thane','Aurangabad','Solapur','Kolhapur','Amravati','Nanded','Akola','Latur','Jalgaon','Ahmednagar','Dhule','Ichalkaranji','Chandrapur','Parbhani','Jalna','Bhusawal','Panvel','Satara','Beed','Yavatmal','Wardha','Sangli','Ulhasnagar','Malegaon','Kalyan-Dombivli','Vasai-Virar','Mira-Bhayandar','Bhiwandi'],
 'Manipur':['Imphal','Thoubal','Kakching','Bishnupur','Churachandpur'],
 'Meghalaya':['Shillong','Tura','Nongstoin','Jowai','Williamnagar'],
 'Mizoram':['Aizawl','Lunglei','Champhai','Serchhip','Kolasib'],
 'Nagaland':['Kohima','Dimapur','Mokokchung','Tuensang','Wokha','Zunheboto'],
 'Odisha':['Bhubaneswar','Cuttack','Rourkela','Sambalpur','Puri','Berhampur','Balasore','Baripada','Bhadrak','Jharsuguda','Jeypore','Barbil','Paradip'],
 'Punjab':['Ludhiana','Amritsar','Jalandhar','Patiala','Mohali','Bathinda','Hoshiarpur','Pathankot','Moga','Abohar','Khanna','Phagwara','Firozpur','Kapurthala','Rajpura','Sangrur'],
 'Rajasthan':['Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner','Bhilwara','Alwar','Bharatpur','Pali','Sikar','Tonk','Kishangarh','Beawar','Hanumangarh','Ganganagar','Jhunjhunu','Chittorgarh','Dhaulpur','Baran','Sawai Madhopur'],
 'Sikkim':['Gangtok','Namchi','Geyzing','Mangan','Rangpo','Singtam'],
 'Tamil Nadu':['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Thoothukudi','Vellore','Erode','Tiruppur','Dindigul','Thanjavur','Ranipet','Sivakasi','Kanchipuram','Kumbakonam','Nagercoil','Karur','Hosur','Cuddalore','Pudukkottai','Vaniyambadi'],
 'Telangana':['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Nalgonda','Mahbubnagar','Ramagundam','Miryalaguda','Adilabad','Medak','Jagtial','Mancherial','Siddipet'],
 'Tripura':['Agartala','Dharmanagar','Udaipur','Kailasahar','Belonia','Khowai'],
 'Uttar Pradesh':['Lucknow','Kanpur','Prayagraj','Varanasi','Agra','Ghaziabad','Meerut','Gorakhpur','Gonda','Aligarh','Bareilly','Moradabad','Saharanpur','Jhansi','Mathura','Firozabad','Ayodhya','Shahjahanpur','Rampur','Modinagar','Hapur','Etawah','Mirzapur','Bulandshahr','Sambhal','Amroha','Hardoi','Fatehpur','Raebareli','Orai','Sitapur','Bahraich','Unnao','Lakhimpur','Banda','Jaunpur','Azamgarh','Sultanpur','Basti','Deoria','Ballia','Mainpuri','Bijnor','Muzaffarnagar'],
 'Uttarakhand':['Dehradun','Haridwar','Roorkee','Haldwani','Kashipur','Rudrapur','Rishikesh','Kotdwar','Pithoragarh','Almora','Tehri','Srinagar'],
 'West Bengal':['Kolkata','Howrah','Durgapur','Siliguri','Asansol','Bardhaman','Malda','Berhampore','Habra','Kharagpur','Shantipur','Darjeeling','Alipurduar','Purulia','Raiganj','Krishnanagar','Nabadwip','Midnapore','Balurghat','Basirhat','Bankura','Chakdaha','Jalpaiguri','Cooch Behar','Barrackpore','Ranaghat'],
 'Andaman and Nicobar Islands':['Port Blair','Diglipur','Mayabunder','Rangat','Car Nicobar'],
 'Chandigarh':['Chandigarh'],
 'Dadra and Nagar Haveli and Daman and Diu':['Silvassa','Daman','Diu','Amli'],
 'Delhi':['New Delhi','Delhi','Dwarka','Rohini','Karol Bagh','Lajpat Nagar','Saket','Pitampura'],
 'Jammu and Kashmir':['Srinagar','Jammu','Anantnag','Baramulla','Udhampur','Kathua','Sopore','Handwara','Bandipora','Pulwama','Kulgam','Rajouri','Poonch','Doda'],
 'Ladakh':['Leh','Kargil','Diskit','Padum'],
 'Lakshadweep':['Kavaratti','Agatti','Amini','Andrott','Minicoy'],
 'Puducherry':['Puducherry','Karaikal','Mahe','Yanam','Ozhukarai']
};

export const ADMIN_ACCESS_DIGEST = "a36aef5a11c4073fbe60314fc9df530a9d5f986533594d1f5190742ff9e0e408";
export const ADMIN_EMAIL = "admin@janmoolyatracker.com";



export const FUNDING_SOURCES = [
  { icon: '₹', name: 'Property Tax', share: '~32% of city income', desc: 'The yearly tax citizens pay on homes and shops. It is the city\'s own income and funds roads, lights, water and cleaning in your ward.' },
  { icon: 'G', name: 'Government Grants', share: '~48% of city income', desc: 'Money sent by the State and Central Government for schemes like roads, drainage, housing and Swachh Bharat. It must be spent on the purpose it was given for.' },
  { icon: '≡', name: 'Municipal Expenditure', share: 'Tracked ward-by-ward', desc: 'What the municipality actually spends: salaries, contractors, materials and maintenance. JanMoolya compares this spend with work visible on the ground.' }
];

export const PROJECT_STATUSES = ["Not Started", "In Progress", "Delayed", "Completed"];

export const SEED_USERS = [
 {name:"Priya Sharma", age:24, mobile:"9810011223", email:"priya.sharma@example.com", state:"Madhya Pradesh", city:"Indore", joined:"2026-11-20", demo:true},
 {name:"Rohit Gupta", age:29, mobile:"9810011445", email:"rohit.gupta@example.com", state:"Madhya Pradesh", city:"Indore", joined:"2026-11-21", demo:true},
 {name:"Anjali Verma", age:31, mobile:"9822011334", email:"anjali.verma@example.com", state:"Madhya Pradesh", city:"Bhopal", joined:"2026-11-22", demo:true},
 {name:"Sneha Patil", age:27, mobile:"9822011667", email:"sneha.patil@example.com", state:"Karnataka", city:"Bengaluru", joined:"2026-11-23", demo:true},
 {name:"Amit Kumar", age:35, mobile:"9839011223", email:"amit.kumar@example.com", state:"Uttar Pradesh", city:"Lucknow", joined:"2026-11-24", demo:true}
];

export function paperLabel(pct) { const n = Number(pct) || 0; return n >= 100 ? "Complete" : n > 0 ? "In Progress" : "Not Started" }
export function groundLabel(pct) { const n = Number(pct) || 0; return n >= 90 ? "Fixed ✓ Verified" : n >= 40 ? "Partially Fixed" : n > 0 ? "Work Chal Raha Hai" : "Not Fixed" }
export function fmtMoney(v) { const lakh = Number(v) || 0; const rupees = lakh * 100000; if (rupees >= 10000000) return "₹" + (rupees / 10000000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Cr"; if (rupees >= 100000) return "₹" + lakh.toLocaleString('en-IN', { maximumFractionDigits: 2 }) + " Lakh"; return "₹" + Math.round(rupees).toLocaleString('en-IN') }
export function fmtCrSmart(v) { const cr = Number(v) || 0; if (cr >= 1 || cr === 0) return fmtCr(cr); const rupees = cr * 10000000; if (rupees >= 100000) return "₹" + (rupees / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + " Lakh"; return "₹" + Math.round(rupees).toLocaleString('en-IN') }
export function fmtDateRange(start, end) {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const f = (d) => { if (!d) return ""; const dt = new Date(d + "T00:00:00"); return isNaN(dt) ? d : M[dt.getMonth()] + " " + dt.getFullYear() }
  const a = f(start), b = f(end)
  return a && b ? a + " – " + b : a || b || ""
}
