// JanMoolya Tracker - cloud backend (Firebase)
// Config neeche TINA ke Firebase project se aayega. Jab tak apiKey khaali hai,
// CLOUD = false rahega aur site bilkul pehle ki tarah sirf local mode mein chalegi.
// firebaseConfig koi secret nahi hota - asal security Firestore rules + Auth se aati hai.
import { initializeApp } from "firebase/app"
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut } from "firebase/auth"
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAcYzQGFYoRZ4w7ZLlmNxeM-4PdIath3vc",
  authDomain: "janmoolya-2e18f.firebaseapp.com",
  projectId: "janmoolya-2e18f",
  storageBucket: "janmoolya-2e18f.firebasestorage.app",
  messagingSenderId: "380536125231",
  appId: "1:380536125231:web:f841ee7929b045483b93da"
}

export const ADMIN_EMAIL = "admin@janmoolyatracker.com"
export const CLOUD = !!firebaseConfig.apiKey

let auth = null
let db = null
if (CLOUD) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (e) {
    console.warn("Firebase init failed, local mode chalega:", e)
  }
}

// Har visitor ko ek anonymous server identity milti hai, taaki database rules
// "sirf signed-in users likh sakte hain" wala niyam laga sakein.
export function ensureAuth() {
  if (!CLOUD || !auth) return Promise.resolve(null)
  return new Promise((resolve) => {
    let done = false
    const un = onAuthStateChanged(auth, (u) => {
      if (u) { if (!done) { done = true; un(); resolve(u) } }
      else signInAnonymously(auth).catch(() => { if (!done) { done = true; un(); resolve(null) } })
    })
  })
}

// Admin login ab server (Firebase Auth) par check hota hai.
export async function cloudAdminSignIn(email, password) {
  if (!CLOUD || !auth) throw new Error("cloud-off")
  const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
  if (!cred.user || cred.user.email !== ADMIN_EMAIL) {
    await fbSignOut(auth).catch(() => {})
    throw new Error("not-admin")
  }
  return cred.user
}

export async function cloudAdminSignOut() {
  if (!CLOUD || !auth) return
  try { await fbSignOut(auth) } catch { /* ignore */ }
  ensureAuth() // wapas anonymous identity, taaki citizen writes chalte rahein
}

// cb(true) jab current user asal admin ho (email verified by server session)
export function watchAdmin(cb) {
  if (!CLOUD || !auth) return () => {}
  return onAuthStateChanged(auth, (u) => cb(!!u && !u.isAnonymous && u.email === ADMIN_EMAIL))
}

function sub(colName, cb) {
  if (!CLOUD || !db) return () => {}
  try {
    return onSnapshot(collection(db, colName),
      (snap) => { const out = []; snap.forEach(d => out.push(d.data())); cb(out, snap.metadata.fromCache) },
      (err) => console.warn("Cloud read failed (" + colName + "):", err))
  } catch (e) { console.warn("Cloud subscribe failed:", e); return () => {} }
}

export const subscribeProjects = (cb) => sub("projects", (rows, fromCache) => cb(rows.slice().sort((a, b) => String(b.id).localeCompare(String(a.id))), fromCache))
export const subscribeReports = (cb) => sub("reports", (rows) => cb(rows.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0))))
export const subscribeFeedbacks = (cb) => sub("feedbacks", cb)
export function subscribeBudgets(cb) {
  return sub("cityBudgets", (rows) => { const map = {}; rows.forEach(r => { if (r && r.city) map[r.city] = r }); cb(map) })
}
export function subscribeProjEdits(cb) {
  return sub("projEdits", (rows) => { const map = {}; rows.forEach(r => { if (r && r._pid) { const { _pid, ...patch } = r; map[_pid] = patch } }); cb(map) })
}
export function subscribeReportStatus(cb) {
  return sub("reportStatus", (rows) => { const map = {}; rows.forEach(r => { if (r && r._rid) map[r._rid] = r.status }); cb(map) })
}

function put(colName, id, data) {
  if (!CLOUD || !db) return
  setDoc(doc(db, colName, String(id)), data).catch((e) => console.warn("Cloud write failed (" + colName + "):", e))
}

export const cloudAddProject = (p) => put("projects", p.id, p)
export const cloudUpdateProject = (p) => put("projects", p.id, p)
export const cloudAddBudget = (entry) => put("cityBudgets", entry.city, entry)
export const cloudAddReport = (r) => put("reports", r.id, r)
export const cloudAddFeedback = (projectId, entry) => put("feedbacks", entry.fid, { ...entry, projectId })
export const cloudSaveProjEdit = (projectId, patch) => put("projEdits", projectId, { ...patch, _pid: String(projectId) })
export const cloudSetReportStatus = (reportId, status) => put("reportStatus", reportId, { _rid: String(reportId), status })
