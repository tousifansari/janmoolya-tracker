import React, { useMemo, useState } from "react"
import { useApp } from "../store"
import { ISSUE_CATS, FEED_CAT_LABEL, FEED_CAT_EMOJI, INDIA_GEO } from "../data/seed"

const STATUS_STYLE = {
  Submitted: "bg-cyan-100 text-cyan-900",
  "In Progress": "bg-sky-100 text-sky-900",
  Resolved: "bg-green-100 text-green-900",
  "Citizen Verified": "bg-green-100 text-green-900"
}

function initials(name) {
  const parts = (name || "?").trim().split(/\s+/)
  return ((parts[0] || "?")[0] + ((parts[1] || "")[0] || "")).toUpperCase()
}

export default function Feed() {
  const { user, navigate, requireAuth, t, lang, loc, reports, feedPosts, feedVotes, feedVote, feedComments, addFeedComment } = useApp()
  const [query, setQuery] = useState("")
  const [catF, setCatF] = useState("all")
  const [quick, setQuick] = useState("all")
  const [fState, setFState] = useState("")
  const [fCity, setFCity] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [openMenu, setOpenMenu] = useState(null)
  const [openComments, setOpenComments] = useState({})
  const [expanded, setExpanded] = useState({})
  const [drafts, setDrafts] = useState({})
  const [copied, setCopied] = useState(null)
  const [shared, setShared] = useState(null)
  const [loginHint, setLoginHint] = useState(null)

  const states = Object.keys(INDIA_GEO)
  const filterCities = fState ? (INDIA_GEO[fState] || []) : []

  const timeAgo = (ts) => {
    const mins = Math.floor((Date.now() - ts) / 60000)
    if (mins < 1) return t("Just now", "Abhi abhi")
    if (mins < 60) return mins + t(" min ago", " min pehle")
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return hrs + t(" hr ago", " ghante pehle")
    return Math.floor(hrs / 24) + t(" day ago", " din pehle")
  }

  const likesOf = (p) => p.baseLikes + (feedVotes[p.key] === 1 ? 1 : 0)
  const dislikesOf = (p) => p.baseDislikes + (feedVotes[p.key] === -1 ? 1 : 0)
  const commentsOf = (p) => p.seedComments.length + ((feedComments[p.key] || []).length)

  const catLabel = (key) => {
    const l = FEED_CAT_LABEL[key]
    if (l) return t(l.en, l.hl)
    const c = ISSUE_CATS.find(x => x.key === key)
    return c ? t(c.en, c.hl) : key
  }

  const filtered = useMemo(() => {
    let list = feedPosts.slice()
    if (catF !== "all") list = list.filter(p => p.catKey === catF)
    if (quick === "mycity") list = list.filter(p => p.city === loc.city)
    if (quick === "unresolved") list = list.filter(p => p.status === "Submitted" || p.status === "In Progress")
    if (quick === "verified") list = list.filter(p => p.status === "Citizen Verified" || p.verified)
    if (fState) list = list.filter(p => p.state === fState)
    if (fCity) list = list.filter(p => p.city === fCity)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter(p => (p.title + " " + p.desc + " " + p.name + " " + p.city + " " + p.area).toLowerCase().includes(q))
    const lk = (p) => p.baseLikes + (feedVotes[p.key] === 1 ? 1 : 0)
    const cm = (p) => p.seedComments.length + ((feedComments[p.key] || []).length)
    if (quick === "trending") list.sort((a, b) => lk(b) - lk(a))
    else if (sortBy === "oldest") list.sort((a, b) => a.ts - b.ts)
    else if (sortBy === "liked") list.sort((a, b) => lk(b) - lk(a))
    else if (sortBy === "commented") list.sort((a, b) => cm(b) - cm(a))
    else list.sort((a, b) => b.ts - a.ts)
    return list
  }, [feedPosts, catF, quick, fState, fCity, query, sortBy, feedVotes, feedComments, loc.city])

  const clearFilters = () => { setQuery(""); setCatF("all"); setQuick("all"); setFState(""); setFCity(""); setSortBy("newest") }

  const copyTid = async (post) => {
    try { await navigator.clipboard.writeText(post.tid) } catch { /* clipboard not available */ }
    setCopied(post.key)
    setOpenMenu(null)
    setTimeout(() => setCopied(null), 1600)
  }

  const sharePost = async (post) => {
    const url = "https://jmt-mu.vercel.app/#feed"
    const text = post.title + (post.tid ? " (Tracking ID: " + post.tid + ")" : "") + " - JanMoolya Tracker"
    if (navigator.share) {
      try { await navigator.share({ title: "JanMoolya Tracker", text, url }) } catch { /* user cancelled */ }
      return
    }
    try { await navigator.clipboard.writeText(text + " " + url) } catch { /* clipboard not available */ }
    setShared(post.key)
    setTimeout(() => setShared(null), 1600)
  }

  const postComment = (post) => {
    const text = (drafts[post.key] || "").trim()
    if (!text) return
    if (!user) { setLoginHint(post.key); requireAuth(); return }
    addFeedComment(post.key, text)
    setDrafts(prev => ({ ...prev, [post.key]: "" }))
    setLoginHint(null)
  }

  const impact = useMemo(() => {
    const citizens = new Set(feedPosts.map(p => p.name)).size
    const resolvedCount = feedPosts.filter(p => p.status === "Resolved" || p.status === "Citizen Verified").length
    const resolvedPct = feedPosts.length ? Math.round((resolvedCount / feedPosts.length) * 100) : 0
    const cityCount = feedPosts.filter(p => p.city === loc.city).length
    return { total: reports.length, citizens, resolvedPct, cityCount }
  }, [feedPosts, reports, loc.city])

  const popular = useMemo(() => {
    const counts = {}
    feedPosts.forEach(p => { counts[p.catKey] = (counts[p.catKey] || 0) + 1 })
    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return { rows, max: rows.length ? rows[0][1] : 1 }
  }, [feedPosts])

  const quickPills = [
    ["all", t("All", "Sab")],
    ["trending", t("Trending", "Trending")],
    ["mycity", t("My City", "Mera Shehar")],
    ["unresolved", t("Unresolved", "Pending")],
    ["verified", t("Verified", "Verified")]
  ]

  return (
    <div className="w-full py-8">
      <h1 className="font-display text-3xl sm:text-4xl">{t("Community Feed", "Community Feed")}</h1>
      <p className="mt-2 text-slate-600">{t("Citizen reports from the ground. Like, comment and verify what is really happening in your city.", "Zameen se citizen reports. Like, comment karein aur verify karein ki aapke shehar mein asal mein kya ho raha hai.")}</p>

      <div className="mt-6 flex items-start gap-6">
        <div className="mx-auto w-full max-w-[680px] min-w-0">
          {/* Composer */}
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                {user ? initials(user.name) : "👤"}
              </div>
              <button onClick={() => navigate("report")} className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-left text-sm text-slate-500 hover:bg-slate-200">
                {t("Report an Issue / Share a Photo…", "Issue Report Karein / Photo Share Karein…")}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => navigate("report")} className="chip bg-red-50 text-primary-dark">📷 {t("Photo Report", "Photo Report")}</button>
              <button onClick={() => navigate("report")} className="chip bg-cyan-50 text-cyan-800">✏️ {t("Write a Report", "Report Likhein")}</button>
              <button onClick={() => { setQuick("mycity"); setCatF("all") }} className="chip bg-green-50 text-jgreen">📍 {t("Issues in My City", "Mere Shehar ke Issues")}</button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="card mt-4 p-4">
            <input className="input" value={query} onChange={e => setQuery(e.target.value)}
              placeholder={t("Search posts, people, cities…", "Posts, log, shehar search karein…")} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setCatF("all")} className={"chip " + (catF === "all" ? "bg-ink text-white" : "bg-slate-100 text-slate-700")}>{t("All", "Sab")}</button>
              {ISSUE_CATS.map(c => (
                <button key={c.key} onClick={() => setCatF(c.key)} className={"chip " + (catF === c.key ? "bg-ink text-white" : "bg-slate-100 text-slate-700")}>
                  {FEED_CAT_EMOJI[c.key] || "📍"} {lang === "hl" ? c.hl : c.en}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {quickPills.map(([k, label]) => (
                <button key={k} onClick={() => setQuick(k)} className={"chip " + (quick === k ? "bg-primary text-white" : "bg-slate-100 text-slate-700")}>{label}</button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <select className="input !py-2 text-sm" value={fState} onChange={e => { setFState(e.target.value); setFCity("") }}>
                <option value="">{t("All States", "Sab States")}</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="input !py-2 text-sm" value={fCity} onChange={e => setFCity(e.target.value)} disabled={!fState}>
                <option value="">{t("All Cities", "Sab Cities")}</option>
                {filterCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="input !py-2 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">{t("Newest first", "Sabse naye pehle")}</option>
                <option value="oldest">{t("Oldest first", "Sabse purane pehle")}</option>
                <option value="liked">{t("Most Liked", "Sabse zyada Liked")}</option>
                <option value="commented">{t("Most Commented", "Sabse zyada Commented")}</option>
              </select>
            </div>
            <button onClick={clearFilters} className="mt-3 text-sm font-semibold text-primary">{t("Clear all filters", "Saare filters saaf karein")}</button>
          </div>

          {/* Posts */}
          {filtered.length === 0 ? (
            <div className="card mt-4 p-8 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-2 font-semibold">{t("No posts match these filters.", "In filters se koi post match nahi hui.")}</p>
              <p className="mt-1 text-sm text-slate-500">{t("Try a different search or clear the filters.", "Doosri search try karein ya filters saaf karein.")}</p>
              <button onClick={clearFilters} className="btn-primary mt-4">{t("Clear Filters", "Filters Saaf Karein")}</button>
            </div>
          ) : filtered.map(post => {
            const commentsOpen = !!openComments[post.key]
            const allComments = [...post.seedComments, ...(feedComments[post.key] || [])]
            return (
              <article key={post.key} className="card mt-4 overflow-hidden">
                <div className="p-4 pb-0">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white">
                      {initials(post.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-1.5 font-semibold">
                        {post.name}
                        {post.verified && <span className="chip bg-sky-100 text-sky-800">✓ {t("Verified", "Verified")}</span>}
                        {post.mine && <span className="chip bg-red-50 text-primary-dark">{t("Your report", "Aapki report")}</span>}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {timeAgo(post.ts)} • {post.city}{post.state ? ", " + post.state : ""}{post.pincode ? " • PIN " + post.pincode : ""}{post.area ? " • " + post.area : ""}
                      </p>
                    </div>
                    <div className="relative shrink-0">
                      <button onClick={() => setOpenMenu(openMenu === post.key ? null : post.key)} className="rounded-full px-2 py-1 text-lg leading-none text-slate-500 hover:bg-slate-100" aria-label="Post menu">•••</button>
                      {openMenu === post.key && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 z-20 w-52 rounded-xl border border-slate-100 bg-white py-1 shadow-xl">
                            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                              onClick={() => { setExpanded(prev => ({ ...prev, [post.key]: !prev[post.key] })); setOpenMenu(null) }}>
                              {t("View Details", "Details Dekhein")}
                            </button>
                            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50" onClick={() => copyTid(post)}>
                              {copied === post.key ? t("Copied", "Copy ho gaya") : t("Copy Tracking ID", "Tracking ID Copy Karein")}
                            </button>
                            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                              onClick={() => { setOpenComments(prev => ({ ...prev, [post.key]: true })); setOpenMenu(null) }}>
                              {t("View Comments", "Comments Dekhein")}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="chip bg-cream text-slate-700">{FEED_CAT_EMOJI[post.catKey] || "📍"} {catLabel(post.catKey)}</span>
                    <span className={"chip " + (STATUS_STYLE[post.status] || "bg-slate-100 text-slate-700")}>{post.status}</span>
                    {copied === post.key && <span className="chip bg-green-100 text-green-900">{t("Tracking ID copied", "Tracking ID copy ho gaya")}</span>}
                  </div>

                  <h3 className="mt-2 font-semibold leading-snug">{post.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{post.desc}</p>

                  {expanded[post.key] && (
                    <div className="mt-3 rounded-xl bg-cream p-3 text-sm text-slate-700">
                      <p>{t("Tracking ID", "Tracking ID")}: <strong className="font-mono">{post.tid}</strong></p>
                      <p className="mt-1">{t("Status", "Status")}: {post.status} • {t("Category", "Category")}: {catLabel(post.catKey)}</p>
                      <p className="mt-1">{t("Location", "Location")}: {post.area ? post.area + ", " : ""}{post.city}{post.state ? ", " + post.state : ""}{post.pincode ? " (" + post.pincode + ")" : ""}</p>
                    </div>
                  )}
                </div>

                {post.photo && <img src={post.photo} alt={post.title} className="mt-3 max-h-80 w-full object-cover" />}

                <div className="px-4">
                  <div className="flex items-center justify-between border-b border-slate-100 py-2 text-xs text-slate-500">
                    <span>👍 {likesOf(post)} • 👎 {dislikesOf(post)}</span>
                    <span>💬 {commentsOf(post)} {t("comments", "comments")}</span>
                  </div>
                  <div className="flex py-1">
                    <button onClick={() => requireAuth(() => feedVote(post.key, 1))}
                      className={"flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 py-2 text-[13px] hover:bg-slate-50 sm:text-sm " + (feedVotes[post.key] === 1 ? "font-bold text-primary" : "font-medium text-slate-600")}>
                      👍 {t("Like", "Like")}
                    </button>
                    <button onClick={() => requireAuth(() => feedVote(post.key, -1))}
                      className={"flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 py-2 text-[13px] hover:bg-slate-50 sm:text-sm " + (feedVotes[post.key] === -1 ? "font-bold text-ink" : "font-medium text-slate-600")}>
                      👎 {t("Dislike", "Dislike")}
                    </button>
                    <button onClick={() => setOpenComments(prev => ({ ...prev, [post.key]: !prev[post.key] }))}
                      className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 sm:text-sm">
                      💬 {t("Comment", "Comment")}
                    </button>
                    <button onClick={() => sharePost(post)}
                      className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 sm:text-sm">
                      {shared === post.key ? "✓ " + t("Copied", "Copied") : "🔗 " + t("Share", "Share")}
                    </button>
                  </div>
                </div>

                {commentsOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                    {allComments.length === 0 ? (
                      <p className="text-sm text-slate-500">{t("No comments yet. Be the first to respond.", "Abhi koi comment nahi. Sabse pehle aap jawab dein.")}</p>
                    ) : allComments.map((c, i) => (
                      <div key={i} className="mb-2 flex items-start gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jcyan text-xs font-bold text-white">{initials(c.name)}</div>
                        <div className="min-w-0 rounded-2xl bg-slate-100 px-3 py-2">
                          <p className="text-xs font-bold">{c.name} <span className="font-normal text-slate-400">• {timeAgo(c.ts)}</span></p>
                          <p className="text-sm text-slate-700">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {user ? initials(user.name) : "👤"}
                      </div>
                      <input className="min-w-0 flex-1 rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary"
                        value={drafts[post.key] || ""}
                        onChange={e => setDrafts(prev => ({ ...prev, [post.key]: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter") postComment(post) }}
                        placeholder={t("Write a comment…", "Comment likhein…")} />
                      <button onClick={() => postComment(post)} className="btn-primary shrink-0 !px-4 !py-2 text-sm">{t("Post", "Post")}</button>
                    </div>
                    {loginHint === post.key && !user && (
                      <p className="mt-2 text-xs font-medium text-cyan-800">
                        {t("Your comment is saved in the box above. Login, then tap Post once more to publish it.", "Aapka comment upar wale box mein saved hai. Login karein, phir Post ek baar aur dabayein, comment publish ho jayega.")}
                      </p>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Right rail */}
        <aside className="sticky top-24 hidden w-80 shrink-0 self-start xl:block">
          <div className="card p-5">
            <h3 className="font-display text-lg">{t("Community Impact", "Community Impact")}</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">{t("Total Reports", "Kul Reports")}</span><strong>{impact.total}</strong></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">{t("Citizens Reporting", "Report Karne Wale Citizens")}</span><strong>{impact.citizens}</strong></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">{t("Resolved", "Resolved")} %</span><strong className="text-jgreen">{impact.resolvedPct}%</strong></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">{t("Posts from", "Posts")} {loc.city}</span><strong>{impact.cityCount}</strong></div>
            </div>
            <button onClick={() => navigate("report")} className="btn-primary mt-4 w-full justify-center !py-2.5 text-sm">{t("Report an Issue", "Issue Report Karein")}</button>
          </div>
          <div className="card mt-4 p-5">
            <h3 className="font-display text-lg">{t("Popular Categories", "Popular Categories")}</h3>
            <div className="mt-3 space-y-3">
              {popular.rows.map(([key, count]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{FEED_CAT_EMOJI[key] || "📍"} {catLabel(key)}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-primary" style={{ width: Math.round((count / popular.max) * 100) + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
