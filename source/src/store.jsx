import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PROJECTS, SEED_REPORTS, FEED_SEEDS, SEED_USERS, SEED_CITY_BUDGETS, SEED_FEEDBACKS, paperLabel, groundLabel } from './data/seed'
import { CLOUD, ensureAuth, watchAdmin, cloudAdminSignOut, subscribeProjects, subscribeReports, subscribeFeedbacks, subscribeBudgets, subscribeProjEdits, subscribeReportStatus, cloudAddProject, cloudUpdateProject, cloudAddBudget, cloudAddReport, cloudAddFeedback, cloudSaveProjEdit, cloudSetReportStatus } from './firebase'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export const LS_KEY = 'jmt_state_v1'
export const USER_KEY = 'jmt_user_v1'
export const PAGES = ['home', 'dashboard', 'budget', 'projects', 'work', 'report', 'feed', 'ai', 'profile', 'admin', 'about']

function loadLS() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {} } catch { return {} } }
function loadUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)) || null } catch { return null } }
function pageFromHash() {
  const h = (window.location.hash || '').replace('#', '').split('?')[0]
  if (PAGES.includes(h)) return h
  if (window.location.pathname.replace(/\/+$/, '').endsWith('/admin')) return 'admin'
  return 'home'
}
export function newTrackingId(existing) {
  let id
  do { id = 'JMT-2026-' + Math.floor(1000 + Math.random() * 9000) } while (existing.includes(id))
  return id
}
export function catKeyFromLabel(cat = '') {
  const c = cat.toLowerCase()
  if (c.includes('pothole') || c.includes('road') || c.includes('sadak')) return 'roads'
  if (c.includes('drain')) return 'drainage'
  if (c.includes('garbage') || c.includes('kachra')) return 'garbage'
  if (c.includes('water') || c.includes('paani')) return 'water'
  if (c.includes('light')) return 'lights'
  if (c.includes('toilet')) return 'toilets'
  if (c.includes('safety') || c.includes('pashu') || c.includes('traffic')) return 'safety'
  return 'roads'
}

export function AppProvider({ children }) {
  const [page, setPageState] = useState(pageFromHash)
  const [saved] = useState(loadLS)
  const [lang, setLang] = useState(saved.lang || 'en')
  const [user, setUser] = useState(loadUser)
  const [userReports, setUserReports] = useState(saved.userReports || [])
  const [votes, setVotes] = useState(saved.votes || {})
  const [feedVotes, setFeedVotes] = useState(saved.feedVotes || {})
  const [feedComments, setFeedComments] = useState(saved.feedComments || {})
  const [addedProjects, setAddedProjects] = useState(saved.addedProjects || [])
  const [statusOverrides, setStatusOverrides] = useState(saved.statusOverrides || {})
  const [registeredUsers, setRegisteredUsers] = useState(saved.registeredUsers || [])
  const [bannedMobiles, setBannedMobiles] = useState(saved.bannedMobiles || [])
  const [projEdits, setProjEdits] = useState(saved.projEdits || {})
  const [addedCityBudgets, setAddedCityBudgets] = useState(saved.cityBudgets || {})
  const [userFeedbacks, setUserFeedbacks] = useState(saved.userFeedbacks || {})
  const [loc, setLoc] = useState(saved.location || { state: 'Madhya Pradesh', city: 'Indore' })
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [adminOk, setAdminOk] = useState(() => (CLOUD ? false : sessionStorage.getItem('jmt_admin_ok') === '1'))
  const [cloudProjects, setCloudProjects] = useState([])
  const [cloudReports, setCloudReports] = useState([])
  const [cloudFeedbacks, setCloudFeedbacks] = useState([])
  const [cloudBudgets, setCloudBudgets] = useState({})
  const [cloudEdits, setCloudEdits] = useState({})
  const [cloudStatus, setCloudStatus] = useState({})
  const [cloudReady, setCloudReady] = useState(false)
  const useCloud = CLOUD && cloudReady

  useEffect(() => {
    if (!CLOUD) return
    let unsubs = []
    ensureAuth().then(() => {
      unsubs = [
        subscribeProjects((rows, fromCache) => { setCloudProjects(rows); if (!fromCache) setCloudReady(true) }),
        subscribeReports(setCloudReports),
        subscribeFeedbacks(setCloudFeedbacks),
        subscribeBudgets(setCloudBudgets),
        subscribeProjEdits(setCloudEdits),
        subscribeReportStatus(setCloudStatus),
        watchAdmin(setAdminOk)
      ]
    })
    return () => unsubs.forEach(u => { try { u() } catch { /* ignore */ } })
  }, [])
  const pendingRef = useRef(null)

  useEffect(() => {
    const onHash = () => { setPageState(pageFromHash()); setAuthOpen(false); setSearchOpen(false); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ lang, userReports, votes, feedVotes, feedComments, addedProjects, statusOverrides, registeredUsers, bannedMobiles, projEdits, cityBudgets: addedCityBudgets, userFeedbacks, location: loc, user }))
    } catch { /* storage full/blocked */ }
  }, [lang, userReports, votes, feedVotes, feedComments, addedProjects, statusOverrides, registeredUsers, bannedMobiles, projEdits, addedCityBudgets, userFeedbacks, loc, user])

  const navigate = (p) => { if (pageFromHash() === p) { setPageState(p); setAuthOpen(false); setSearchOpen(false); window.scrollTo(0, 0) } else window.location.hash = p }
  const t = (en, hl) => (lang === 'hl' && hl ? hl : en)

  const requireAuth = (fn) => {
    if (user) { fn && fn(); return true }
    pendingRef.current = fn || null
    setAuthOpen(true)
    return false
  }
  const completeAuth = (userData) => {
    setUser(userData)
    if (userData && userData.mobile) {
      const entry = { name: userData.name, age: userData.age, mobile: userData.mobile, email: userData.email || '', state: userData.state || '', city: userData.city || '', joined: new Date().toISOString().slice(0, 10) }
      setRegisteredUsers(prev => [entry, ...prev.filter(u => u.mobile !== entry.mobile)])
    }
    try { localStorage.setItem(USER_KEY, JSON.stringify(userData)) } catch { /* ignore */ }
    setAuthOpen(false)
    const fn = pendingRef.current; pendingRef.current = null
    if (fn) fn()
  }
  const signOut = () => {
    setUser(null)
    try { localStorage.removeItem(USER_KEY) } catch { /* ignore */ }
  }

  const reports = useMemo(() => {
    const cloudIds = new Set(cloudReports.map(r => r.id))
    const overrides = { ...statusOverrides, ...cloudStatus }
    const all = useCloud
      ? [...cloudReports, ...userReports.filter(r => !cloudIds.has(r.id))]
      : [...cloudReports, ...userReports.filter(r => !cloudIds.has(r.id)), ...SEED_REPORTS]
    return all.map(r => overrides[r.id] ? { ...r, status: overrides[r.id] } : r)
  }, [userReports, statusOverrides, cloudReports, cloudStatus, useCloud])

  const projects = useMemo(() => {
    const now = new Date()
    const cloudIds = new Set(cloudProjects.map(p => p.id))
    const mergedAdded = [...cloudProjects, ...addedProjects.filter(p => !cloudIds.has(p.id))]
    const edits = useCloud ? cloudEdits : { ...projEdits, ...cloudEdits }
    return [...mergedAdded, ...(useCloud ? [] : PROJECTS)].map(p => {
      let out = p
      const edit = edits[p.id]
      if (edit) {
        out = { ...p, ...edit }
        if (edit.paperPct !== undefined) out.paper = paperLabel(edit.paperPct)
        if (edit.groundPct !== undefined) out.ground = groundLabel(edit.groundPct)
      }
      let eff = out.status || 'In Progress'
      if (eff !== 'Completed' && eff !== 'Delayed' && out.end && new Date(out.end + 'T23:59:59') < now) eff = 'Delayed'
      return { ...out, effStatus: eff }
    })
  }, [addedProjects, projEdits, cloudProjects, cloudEdits, useCloud])

  const feedbacks = useMemo(() => {
    const out = {}
    const cloudByProj = {}
    cloudFeedbacks.forEach(f => { if (f && f.projectId) (cloudByProj[f.projectId] = cloudByProj[f.projectId] || []).push(f) })
    const keys = new Set([...Object.keys(SEED_FEEDBACKS), ...Object.keys(userFeedbacks), ...Object.keys(cloudByProj)])
    keys.forEach(k => {
      const local = userFeedbacks[k] || []
      const fids = new Set(local.map(e => e.fid).filter(Boolean))
      const cloudOnly = (cloudByProj[k] || []).filter(e => !e.fid || !fids.has(e.fid))
      out[k] = useCloud ? [...local, ...cloudOnly] : [...(SEED_FEEDBACKS[k] || []), ...local, ...cloudOnly]
    })
    return out
  }, [userFeedbacks, cloudFeedbacks, useCloud])
  const addFeedback = (projectId, entry) => {
    const full = { ...entry, fid: entry.fid || 'f' + Date.now() + Math.floor(Math.random() * 9999) }
    setUserFeedbacks(prev => ({ ...prev, [projectId]: [...(prev[projectId] || []), full] }))
    if (CLOUD) cloudAddFeedback(projectId, full)
  }

  const cityBudgets = useMemo(() => (useCloud ? { ...cloudBudgets } : { ...SEED_CITY_BUDGETS, ...addedCityBudgets, ...cloudBudgets }), [addedCityBudgets, cloudBudgets, useCloud])
  const currentBudget = cityBudgets[loc.city] || null
  const addCityBudget = (entry) => { setAddedCityBudgets(prev => ({ ...prev, [entry.city]: entry })); if (CLOUD) cloudAddBudget(entry) }

  const users = useMemo(() => {
    const seedMobiles = new Set(SEED_USERS.map(u => u.mobile))
    return [...registeredUsers.filter(u => !seedMobiles.has(u.mobile)), ...SEED_USERS]
  }, [registeredUsers])

  const feedPosts = useMemo(() => {
    const hl = lang === 'hl'
    const seedPosts = FEED_SEEDS.map(s => ({
      key: s.key, mine: false, name: s.name, verified: !!s.verified, catKey: s.catKey,
      title: hl ? s.titleHl : s.titleEn, desc: hl ? s.descHl : s.descEn,
      state: s.state, city: s.city, pincode: s.pincode, area: s.area, status: s.status,
      tid: s.tid, ts: Date.now() - (s.hoursAgo || 1) * 3600 * 1000,
      baseLikes: s.likes || 0, baseDislikes: s.dislikes || 0,
      seedComments: (s.comments || []).map(c => ({ name: c.name, text: hl ? c.textHl : c.textEn, ts: Date.now() - (c.hoursAgo || 1) * 3600 * 1000 }))
    }))
    const reportPosts = reports.map(r => ({
      key: 'rep-' + r.id, mine: !!r.mine, name: r.by || (r.mine ? (user ? user.name : 'You') : 'Citizen Reporter'),
      verified: r.status === 'Citizen Verified', catKey: r.catKey || catKeyFromLabel(r.cat),
      title: r.title || r.cat, desc: r.desc || '', state: r.state || '', city: r.city || '', pincode: r.pincode || '',
      area: r.area || r.loc || '', status: r.status, tid: r.id, ts: r.ts || Date.now() - 5 * 3600 * 1000,
      baseLikes: 0, baseDislikes: 0, seedComments: [], photo: r.photo || null
    }))
    const mine = reportPosts.filter(p => p.mine)
    const restReports = reportPosts.filter(p => !p.mine)
    return [...mine, ...seedPosts, ...restReports].sort((a, b) => b.ts - a.ts)
  }, [reports, lang, user])

  const addReport = (data) => {
    const id = newTrackingId(reports.map(r => r.id))
    const report = { ...data, id, mine: true, status: 'Submitted', by: user ? user.name : 'You', ts: Date.now() }
    setUserReports(prev => [report, ...prev])
    if (CLOUD) cloudAddReport(report)
    return report
  }
  const vote = (projId, val) => setVotes(prev => ({ ...prev, [projId]: prev[projId] === val ? undefined : val }))
  const feedVote = (key, dir) => setFeedVotes(prev => ({ ...prev, [key]: prev[key] === dir ? 0 : dir }))
  const addFeedComment = (key, text) => {
    if (!user) return
    setFeedComments(prev => ({ ...prev, [key]: [...(prev[key] || []), { name: user.name, text, ts: Date.now() }] }))
  }
  const addProject = (p) => {
    const full = { ...p, id: 'u' + Date.now() }
    setAddedProjects(prev => [full, ...prev])
    if (CLOUD) cloudAddProject(full)
  }
  const updateProject = (id, patch) => {
    if (CLOUD) {
      const existing = [...cloudProjects, ...addedProjects].find(p => p.id === id)
      if (existing) {
        const out = { ...existing, ...patch }
        if (patch.paperPct !== undefined) out.paper = paperLabel(patch.paperPct)
        if (patch.groundPct !== undefined) out.ground = groundLabel(patch.groundPct)
        cloudUpdateProject(out)
      } else {
        cloudSaveProjEdit(id, { ...(projEdits[id] || {}), ...(cloudEdits[id] || {}), ...patch })
      }
    }
    if (addedProjects.some(p => p.id === id)) {
      setAddedProjects(prev => prev.map(p => {
        if (p.id !== id) return p
        const out = { ...p, ...patch }
        if (patch.paperPct !== undefined) out.paper = paperLabel(patch.paperPct)
        if (patch.groundPct !== undefined) out.ground = groundLabel(patch.groundPct)
        return out
      }))
    } else {
      setProjEdits(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }))
    }
  }
  const banUser = (mobile) => {
    setBannedMobiles(prev => (prev.includes(mobile) ? prev : [...prev, mobile]))
    if (user && user.mobile === mobile) signOut()
  }
  const unbanUser = (mobile) => setBannedMobiles(prev => prev.filter(m => m !== mobile))
  const setReportStatus = (id, status) => { setStatusOverrides(prev => ({ ...prev, [id]: status })); if (CLOUD) cloudSetReportStatus(id, status) }
  const resetData = () => {
    setUserReports([]); setVotes({}); setFeedVotes({}); setFeedComments({}); setAddedProjects([]); setStatusOverrides({}); setRegisteredUsers([]); setBannedMobiles([]); setProjEdits({}); setAddedCityBudgets({}); setUserFeedbacks({})
    try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ }
  }
  const adminLogin = () => { sessionStorage.setItem('jmt_admin_ok', '1'); setAdminOk(true) }
  const adminLogout = () => { sessionStorage.removeItem('jmt_admin_ok'); setAdminOk(false); if (CLOUD) cloudAdminSignOut(); navigate('home') }

  const value = {
    page, navigate, lang, setLang, t, user, completeAuth, signOut,
    authOpen, setAuthOpen, requireAuth, searchOpen, setSearchOpen,
    reports, userReports, addReport, projects, addProject, votes, vote,
    feedPosts, feedVotes, feedVote, feedComments, addFeedComment,
    statusOverrides, setReportStatus, resetData, users, bannedMobiles, banUser, unbanUser, updateProject,
    cityBudgets, currentBudget, addCityBudget, feedbacks, addFeedback,
    loc, setLoc, adminOk, adminLogin, adminLogout
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
