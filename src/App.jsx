import { useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your email to confirm your account!')
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Welcome back!')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 70%, #e0f4ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      color: 'white',
      textAlign: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Clouds */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '300px', height: '80px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', top: '8%', left: '5%', width: '200px', height: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-5%', width: '250px', height: '70px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '360px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '400',
          letterSpacing: '2px',
          marginBottom: '8px',
          color: '#ffffff',
          textShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}>
          HisJoyMyStrength
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '1px',
          marginBottom: '36px',
          textShadow: '0 1px 6px rgba(0,0,0,0.2)'
        }}>
          "The joy of the Lord is my strength" — Nehemiah 8:10
        </p>

        {/* Login Form */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '14px',
              marginBottom: '12px',
              outline: 'none',
              fontFamily: 'Georgia, serif'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '14px',
              marginBottom: '20px',
              outline: 'none',
              fontFamily: 'Georgia, serif'
            }}
          />

          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '100px',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              color: '#1a6bbd',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '10px',
              fontFamily: 'Georgia, serif'
            }}>
            {loading ? 'Please wait...' : 'Sign In'}
          </button>

          <button
            onClick={handleSignUp}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '100px',
              border: '2px solid rgba(255,255,255,0.6)',
              background: 'transparent',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif'
            }}>
            {loading ? 'Please wait...' : 'Create Account'}
          </button>

          {message && (
            <p style={{
              marginTop: '16px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App