import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'
import Scripture from './pages/Scripture'
import Fellowship from './pages/Fellowship'

import GoldCross from './components/GoldCross'
import Prayer from './pages/Prayer'

function ComingSoon({ title, emoji, setScreen }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'Georgia, serif',
      color: 'white', textAlign: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '8%', left: '-10%', width: '300px', height: '80px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: '200px', height: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', top: '15%', right: '-5%', width: '250px', height: '70px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <button onClick={() => setScreen('home')} style={{
          background: 'transparent', border: 'none', color: '#ffffff',
          fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
          marginBottom: '32px', padding: 0, display: 'block'
        }}>← Back to Cross</button>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{emoji}</div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{title}</h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Coming soon...</p>
      </div>
    </div>
  )
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState(() => {
    return localStorage.getItem('lastScreen') || 'login'
  })

  const navigateTo = (newScreen) => {
    setScreen(newScreen)
    localStorage.setItem('lastScreen', newScreen)
  }

  useEffect(() => {
    let mounted = true

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return
        if (session) {
          setUser(session.user)
          const saved = localStorage.getItem('lastScreen')
          if (!saved || saved === 'login') navigateTo('home')
        } else {
          setUser(null)
          navigateTo('login')
        }
      })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session) {
        setUser(session.user)
        const saved = localStorage.getItem('lastScreen')
        if (!saved || saved === 'login') navigateTo('home')
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setMessage(error.message) }
    else { setMessage('Account created! You can now sign in.') }
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage(error.message) }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('lastScreen')
  }

  const bgStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 70%, #e0f4ff 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', fontFamily: 'Georgia, serif',
    color: 'white', textAlign: 'center', padding: '24px',
    position: 'relative', overflow: 'hidden'
  }

  const clouds = (
    <>
      <div style={{ position: 'absolute', top: '8%', left: '-10%', width: '300px', height: '80px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: '200px', height: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', top: '15%', right: '-5%', width: '250px', height: '70px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
    </>
  )

  // Route to Prayer
  if (screen === 'prayer') {
    return <Prayer setScreen={navigateTo} user={user} />
  }

  // Route to Coming Soon pages
  if (screen === 'scripture') {
    return <Scripture setScreen={navigateTo} user={user} />
  }
  if (screen === 'fellowship') {
    return <Fellowship setScreen={navigateTo} user={user} />
  }
  if (screen === 'evangelism') {
    return <ComingSoon title="Evangelism Tracker" emoji="🌍" setScreen={navigateTo} />
  }
  if (screen === 'vice') {
    return <ComingSoon title="Vice Manager" emoji="⚔️" setScreen={navigateTo} />
  }

  // Home screen
  if (screen === 'home') {
    return (
      <div style={bgStyle}>
        {clouds}
        <div style={{
          position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px', color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            HisJoyMyStrength
          </h1>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', letterSpacing: '0.5px', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            Welcome, {user?.email}
          </p>
          <GoldCross onNavigate={navigateTo} />
          <button onClick={handleSignOut} style={{
            marginTop: '28px', background: '#1a1916', border: 'none', color: '#ffffff',
            padding: '12px 32px', borderRadius: '100px', fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '1px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>Sign Out</button>
        </div>
      </div>
    )
  }

  // Login screen
  return (
    <div style={bgStyle}>
      {clouds}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '360px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px', color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          HisJoyMyStrength
        </h1>
        <p style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', letterSpacing: '1px', marginBottom: '36px', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
          "The joy of the Lord is my strength" — Nehemiah 8:10
        </p>
        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', maxWidth: '280px', padding: '12px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '15px', marginBottom: '12px', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', maxWidth: '280px', padding: '12px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '15px', marginBottom: '20px', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
            <button onClick={handleSignIn} disabled={loading}
              style={{ width: '100%', maxWidth: '280px', padding: '14px', borderRadius: '100px', border: 'none', background: 'rgba(255,255,255,0.9)', color: '#1a6bbd', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px', fontFamily: 'Georgia, serif' }}>
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
            <button onClick={handleSignUp} disabled={loading}
              style={{ width: '100%', maxWidth: '280px', padding: '14px', borderRadius: '100px', border: 'none', background: '#1a1916', color: '#ffffff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              {loading ? 'Please wait...' : 'Create Account'}
            </button>
            {message && (
              <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '600', color: '#ffffff', textAlign: 'center' }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
