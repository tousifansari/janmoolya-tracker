import React from 'react'
import { AppProvider, useApp } from './store'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Projects from './pages/Projects'
import Work from './pages/Work'
import Report from './pages/Report'
import Feed from './pages/Feed'
import AI from './pages/AI'
import Profile from './pages/Profile'
import About from './pages/About'
import Admin from './pages/Admin'

function Shell() {
  const { page } = useApp()
  if (page === 'admin') {
    return (
      <>
        <Admin />
        <AuthModal />
      </>
    )
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
        {page === 'home' && <Home />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'budget' && <Budget />}
        {page === 'projects' && <Projects />}
        {page === 'work' && <Work />}
        {page === 'report' && <Report />}
        {page === 'feed' && <Feed />}
        {page === 'ai' && <AI />}
        {page === 'profile' && <Profile />}
        {page === 'about' && <About />}
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
