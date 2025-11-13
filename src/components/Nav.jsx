import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.nav')
      if (nav) {
        if (window.scrollY > 0) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const scrollToAbout = () => {
    const aboutRef = document.querySelector('.about')
    if (aboutRef) aboutRef.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav ${location.pathname === "/" ? "home-nav" : ""}`}>
      <div className="brand">Findyourscheme</div>
      <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        {location.pathname === "/" && <button onClick={scrollToAbout} className="nav-about">About</button>}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        {location.pathname !== "/" && <Link to="/search">Search</Link>}
        {location.pathname !== "/" && <button onClick={logout} className="small-logout">Logout</button>}
      </div>
    </nav>
  )
}
