import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

// ============ ANIMATIONS ============

function PrayerCircleAnimation() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#glow1)">
        <animate attributeName="r" values="70;85;70" dur="3s" repeatCount="indefinite" />
      </circle>
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i * 72 - 90) * Math.PI / 180
        const x = 100 + 55 * Math.cos(angle)
        const y = 100 + 55 * Math.sin(angle)
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <circle cx="0" cy="-14" r="7" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="0" cy="0" rx="6" ry="10" fill="rgba(255,255,255,0.5)" />
            <line x1="-8" y1="-2" x2="-18" y2="4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="-2" x2="18" y2="4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
            <rect x="-5" y="8" width="10" height="7" rx="1" fill="rgba(255,215,0,0.7)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </rect>
          </g>
        )
      })}
      {[0, 1, 2, 3, 4].map(i => {
        const a1 = (i * 72 - 90) * Math.PI / 180
        const a2 = ((i + 1) * 72 - 90) * Math.PI / 180
        const x1 = 100 + 55 * Math.cos(a1)
        const y1 = 100 + 55 * Math.sin(a1)
        const x2 = 100 + 55 * Math.cos(a2)
        const y2 = 100 + 55 * Math.sin(a2)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd700" strokeWidth="1" strokeOpacity="0.4">
            <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </line>
        )
      })}
      {[0, 1, 2].map(i => (
        <circle key={i} cx="100" cy="100" r="3" fill="#ffd700" opacity="0">
          <animate attributeName="cy" values="100;40" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="3;1" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="100" y="185" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="Georgia, serif">Prayer Circle</text>
    </svg>
  )
}

function AccountabilityAnimation() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
      <g transform="translate(45, 80)">
        <circle cx="0" cy="-14" r="9" fill="rgba(255,255,255,0.6)" />
        <ellipse cx="0" cy="4" rx="8" ry="12" fill="rgba(255,255,255,0.5)" />
        <rect x="8" y="-8" width="8" height="12" rx="2" fill="rgba(100,200,255,0.7)" />
        <rect x="-12" y="10" width="10" height="8" rx="1" fill="rgba(255,215,0,0.7)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
        </rect>
      </g>
      <g transform="translate(155, 80)">
        <circle cx="0" cy="-14" r="9" fill="rgba(255,255,255,0.6)" />
        <ellipse cx="0" cy="4" rx="8" ry="12" fill="rgba(255,255,255,0.5)" />
        <rect x="-16" y="-8" width="8" height="12" rx="2" fill="rgba(100,200,255,0.7)" />
        <rect x="2" y="10" width="10" height="8" rx="1" fill="rgba(255,215,0,0.7)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
        </rect>
      </g>
      <line x1="65" y1="80" x2="135" y2="80" stroke="rgba(100,200,255,0.4)" strokeWidth="2" strokeDasharray="4,3">
        <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="1.5s" repeatCount="indefinite" />
      </line>
      {['❤️', '😊', '🙏', '✝️'].map((emoji, i) => (
        <text key={i} x={80 + i * 12} y="50" fontSize="10" textAnchor="middle" opacity="0">
          {emoji}
          <animate attributeName="y" values="70;30" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </text>
      ))}
      <text x="100" y="185" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="Georgia, serif">Accountability</text>
    </svg>
  )
}

function GatheringAnimation() {
  const [scene, setScene] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => { setScene(s => (s + 1) % 3) }, 3000)
    return () => clearInterval(interval)
  }, [])
  const scenes = ['Walking In', 'Bible Study', 'Fellowship']
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
      <rect x="60" y="80" width="80" height="70" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <polygon points="55,80 100,45 145,80" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="100" y1="35" x2="100" y2="55" stroke="#ffd700" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="93" y1="42" x2="107" y2="42" stroke="#ffd700" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </line>
      <rect x="88" y="118" width="24" height="32" rx="2" fill="rgba(255,215,0,0.2)" stroke="rgba(255,215,0,0.5)" strokeWidth="1" />
      {[0, 1, 2, 3, 4].map(i => {
        const x = scene === 0 ? 20 + i * 15 : 75 + i * 12
        const y = scene === 0 ? 140 : 110
        return (
          <g key={i}>
            <circle cx={x} cy={y - 10} r="6" fill="rgba(255,255,255,0.6)">
              <animate attributeName="cx" values={`${20 + i * 15};${75 + i * 12}`} dur="1s" begin={scene === 0 ? '0s' : '1s'} fill="freeze" />
            </circle>
            <ellipse cx={x} cy={y + 3} rx="5" ry="8" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cx" values={`${20 + i * 15};${75 + i * 12}`} dur="1s" begin={scene === 0 ? '0s' : '1s'} fill="freeze" />
            </ellipse>
            {scene !== 0 && (
              <rect x={x - 4} y={y + 8} width="8" height="6" rx="1" fill="rgba(255,215,0,0.8)" />
            )}
          </g>
        )
      })}
      <text x="100" y="170" textAnchor="middle" fill="rgba(255,215,0,0.9)" fontSize="9" fontFamily="Georgia, serif">{scenes[scene]}</text>
      <text x="100" y="185" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="Georgia, serif">Local Gathering</text>
    </svg>
  )
}

function GlobalAnimation() {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    x: 30 + (i * 37 % 140),
    y: 40 + (i * 23 % 110),
    delay: i * 0.3
  }))
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="100" cy="100" rx="75" ry="75" fill="rgba(30,100,200,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <ellipse cx="80" cy="85" rx="25" ry="20" fill="rgba(100,180,100,0.3)" />
      <ellipse cx="130" cy="90" rx="18" ry="22" fill="rgba(100,180,100,0.3)" />
      <ellipse cx="95" cy="120" rx="15" ry="12" fill="rgba(100,180,100,0.3)" />
      <ellipse cx="60" cy="110" rx="10" ry="8" fill="rgba(100,180,100,0.3)" />
      {dots.slice(0, 12).map((d, i) => (
        <g key={i} transform={`translate(${d.x}, ${d.y})`}>
          <rect x="-3" y="-2" width="6" height="5" fill="rgba(255,255,255,0.4)" />
          <polygon points="-4,-2 0,-6 4,-2" fill="rgba(255,255,255,0.4)" />
          <line x1="0" y1="-8" x2="0" y2="-5" stroke="#ffd700" strokeWidth="1">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${d.delay}s`} repeatCount="indefinite" />
          </line>
          <line x1="-1.5" y1="-7" x2="1.5" y2="-7" stroke="#ffd700" strokeWidth="1">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${d.delay}s`} repeatCount="indefinite" />
          </line>
        </g>
      ))}
      {dots.slice(0, 10).map((d, i) => {
        const next = dots[(i + 3) % 12]
        return (
          <line key={i} x1={d.x} y1={d.y} x2={next.x} y2={next.y} stroke="#ffd700" strokeWidth="0.5" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin={`${d.delay}s`} repeatCount="indefinite" />
          </line>
        )
      })}
      {dots.slice(0, 5).map((d, i) => {
        const next = dots[(i + 3) % 12]
        return (
          <circle key={i} r="2" fill="#ffd700" opacity="0">
            <animate attributeName="cx" values={`${d.x};${next.x}`} dur="2s" begin={`${d.delay}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${d.y};${next.y}`} dur="2s" begin={`${d.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${d.delay}s`} repeatCount="indefinite" />
          </circle>
        )
      })}
      <text x="100" y="190" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="Georgia, serif">Global Church</text>
    </svg>
  )
}

// ============ MAIN COMPONENT ============

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
]
const MEETING_TYPES = ['Video Call', 'In Person', 'Either']

export default function Fellowship({ setScreen, user }) {
  const [view, setView] = useState('home')
  const [availability, setAvailability] = useState([])
  const [matches, setMatches] = useState([])
  const [circles, setCircles] = useState([])
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [circleName, setCircleName] = useState('')
  const [creatingCircle, setCreatingCircle] = useState(false)

  useEffect(() => {
    if (user) { loadAvailability(); loadCircles() }
  }, [user])

  const loadAvailability = async () => {
    const { data } = await supabase.from('fellowship_availability').select('*').eq('user_id', user.id)
    if (data) setAvailability(data)
  }

  const loadCircles = async () => {
    const { data } = await supabase.from('fellowship_members').select('circle_id').eq('user_id', user.id)
    if (data && data.length > 0) {
      const circleIds = data.map(d => d.circle_id)
      const { data: circleData } = await supabase.from('fellowship_circles').select('*').in('id', circleIds)
      if (circleData) setCircles(circleData)
    }
  }

  const saveAvailability = async () => {
    if (!selectedDay || !selectedTime || !selectedType) { setStatus('Please select a day, time, and meeting type.'); return }
    setSaving(true)
    const { error } = await supabase.from('fellowship_availability').insert([{
      user_id: user.id, day_of_week: selectedDay, time_slot: selectedTime,
      meeting_type: selectedType, created_at: new Date().toISOString()
    }])
    if (error) { setStatus('Error: ' + error.message) }
    else { setStatus('Availability saved!'); setSelectedDay(''); setSelectedTime(''); setSelectedType(''); loadAvailability(); findMatches() }
    setSaving(false)
  }

  const deleteAvailability = async (id) => {
    await supabase.from('fellowship_availability').delete().eq('id', id)
    loadAvailability()
  }

  const findMatches = async () => {
    const { data: myAvail } = await supabase.from('fellowship_availability').select('*').eq('user_id', user.id)
    if (!myAvail || myAvail.length === 0) return
    const { data: allAvail } = await supabase.from('fellowship_availability').select('*').neq('user_id', user.id)
    if (!allAvail) return
    const matchedUsers = []
    allAvail.forEach(a => {
      const hasMatch = myAvail.some(m =>
        m.day_of_week === a.day_of_week && m.time_slot === a.time_slot &&
        (m.meeting_type === a.meeting_type || m.meeting_type === 'Either' || a.meeting_type === 'Either')
      )
      if (hasMatch && !matchedUsers.find(u => u.user_id === a.user_id)) matchedUsers.push(a)
    })
    setMatches(matchedUsers)
  }

  const createCircle = async () => {
    if (!circleName.trim()) { setStatus('Please enter a circle name.'); return }
    setCreatingCircle(true)
    const { data, error } = await supabase.from('fellowship_circles').insert([{
      name: circleName.trim(), created_by: user.id, meeting_type: selectedType || 'Either',
      day_of_week: selectedDay || '', time_slot: selectedTime || '', created_at: new Date().toISOString()
    }]).select().single()
    if (error) { setStatus('Error: ' + error.message) }
    else {
      await supabase.from('fellowship_members').insert([{ circle_id: data.id, user_id: user.id, joined_at: new Date().toISOString() }])
      setStatus('Prayer circle created!'); setCircleName(''); loadCircles(); setView('circles')
    }
    setCreatingCircle(false)
  }

  useEffect(() => { if (availability.length > 0) findMatches() }, [availability])

  const cloudStyle = (top, left, width, opacity) => ({
    position: 'absolute', top, left, width, height: '60px',
    background: `rgba(255,255,255,${opacity})`, borderRadius: '50px', filter: 'blur(8px)'
  })

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 100%)',
      color: 'white', fontFamily: 'Georgia, serif', overflow: 'hidden', position: 'relative'
    }}>
      <div style={cloudStyle('6%', '-10%', '300px', 0.7)} />
      <div style={cloudStyle('4%', '5%', '200px', 0.6)} />
      <div style={cloudStyle('12%', 'auto', '250px', 0.7)} />

      {/* Header */}
      <div style={{ padding: '20px 20px 12px', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <button onClick={() => setScreen('home')} style={{
          background: 'transparent', border: 'none', color: '#ffffff',
          fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: 0,
          marginBottom: '12px', display: 'block', fontFamily: 'Georgia, serif'
        }}>← Back to Cross</button>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)', margin: '0 0 16px 0' }}>
          ✝️ Christian Fellowship
        </h2>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'home', label: '🏠 Home' },
            { key: 'availability', label: '📅 My Times' },
            { key: 'matches', label: `🤝 Matches ${matches.length > 0 ? `(${matches.length})` : ''}` },
            { key: 'circles', label: `⭕ Circles ${circles.length > 0 ? `(${circles.length})` : ''}` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              background: view === tab.key ? '#ffd700' : 'rgba(0,0,0,0.2)',
              color: view === tab.key ? '#0d2a4a' : '#ffffff',
              border: view === tab.key ? 'none' : '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'Georgia, serif'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px', position: 'relative', zIndex: 10 }}>

        {status && (
          <p style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', padding: '10px', borderRadius: '10px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{status}</p>
        )}

        {/* HOME VIEW */}
        {view === 'home' && (
          <div>
            <p style={{ fontSize: '24px', fontWeight: '700', fontStyle: 'italic', color: '#ffffff', marginBottom: '20px', lineHeight: '1.6', fontFamily: 'Garamond, Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)', WebkitTextStroke: '0.5px white' }}>
              "For where two or three gather in my name, there am I with them." — Matthew 18:20
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { component: <PrayerCircleAnimation />, view: 'circles' },
                { component: <AccountabilityAnimation />, view: 'matches' },
                { component: <GatheringAnimation />, view: 'availability' },
                { component: <GlobalAnimation />, view: 'global' },
              ].map((item, i) => (
                <div key={i} onClick={() => setView(item.view)} style={{
                  background: 'rgba(0,0,0,0.2)', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  aspectRatio: '1', overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)', cursor: 'pointer'
                }}>
                  {item.component}
                </div>
              ))}
            </div>

            <button onClick={() => setView('availability')} style={{
              width: '100%', padding: '15px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ffd700, #ffb300)',
              color: '#0d2a4a', fontWeight: '700', cursor: 'pointer',
              border: 'none', fontFamily: 'Georgia, serif', fontSize: '16px',
              boxShadow: '0 4px 16px rgba(255,215,0,0.4)'
            }}>🤝 Find Fellowship Partners</button>
          </div>
        )}

        {/* AVAILABILITY VIEW */}
        {view === 'availability' && (
          <div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6' }}>
              Set your available times for prayer, Bible study, or fellowship.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ marginBottom: '12px' }}>
                <button onClick={() => setView('home')} style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
                  borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'Georgia, serif', marginBottom: '8px', display: 'block'
                }}>← Back</button>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', margin: 0, textAlign: 'center' }}>Add Availability</p>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Day of week:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {DAYS.map(d => (
                  <button key={d} onClick={() => setSelectedDay(d)} style={{
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    background: selectedDay === d ? 'rgba(255,215,0,0.3)' : 'rgba(0,0,0,0.2)',
                    color: selectedDay === d ? '#ffd700' : '#ffffff',
                    border: selectedDay === d ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                    fontFamily: 'Georgia, serif'
                  }}>{d}</button>
                ))}
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Time slot:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                {TIME_SLOTS.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{
                    padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left',
                    background: selectedTime === t ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.15)',
                    color: selectedTime === t ? '#ffd700' : '#ffffff',
                    border: selectedTime === t ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
                    fontFamily: 'Georgia, serif'
                  }}>{t}</button>
                ))}
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Meeting type:</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {MEETING_TYPES.map(t => (
                  <button key={t} onClick={() => setSelectedType(t)} style={{
                    flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    background: selectedType === t ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.15)',
                    color: selectedType === t ? '#ffd700' : '#ffffff',
                    border: selectedType === t ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
                    fontFamily: 'Georgia, serif'
                  }}>{t}</button>
                ))}
              </div>

              <button onClick={saveAvailability} disabled={saving} style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#1a1916', color: '#ffffff', fontWeight: 'bold',
                cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}>{saving ? 'Saving...' : '+ Add This Time'}</button>
            </div>

            {availability.length > 0 && (
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '10px' }}>My Available Times:</p>
                {availability.map(a => (
                  <div key={a.id} style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '8px',
                    border: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: '0 0 4px' }}>{a.day_of_week} — {a.time_slot}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{a.meeting_type}</p>
                    </div>
                    <button onClick={() => deleteAvailability(a.id)} style={{
                      background: 'rgba(200,50,50,0.2)', border: '1px solid rgba(255,100,100,0.4)',
                      color: '#ff9999', borderRadius: '20px', padding: '5px 12px',
                      fontSize: '12px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MATCHES VIEW */}
        {view === 'matches' && (
          <div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6' }}>
              These believers share your availability for fellowship.
            </p>

            {matches.length === 0 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>🙏</p>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>No matches yet.</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Add your availability and the system will find believers with matching times.</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                  <button onClick={() => setView('home')} style={{
                    padding: '10px 24px', borderRadius: '20px', background: 'transparent', color: '#ffffff',
                    fontWeight: '700', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.4)', fontFamily: 'Georgia, serif', fontSize: '14px'
                  }}>← Back</button>
                  <button onClick={() => setView('availability')} style={{
                    padding: '10px 24px', borderRadius: '20px', background: '#ffd700', color: '#0d2a4a',
                    fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px'
                  }}>Set My Availability</button>
                </div>
              </div>
            )}

            {matches.map((m, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,215,0,0.2)', border: '2px solid rgba(255,215,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>✝️</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px' }}>Fellow Believer</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>📅 {m.day_of_week} — {m.time_slot}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>🤝 {m.meeting_type}</p>
                  </div>
                </div>
              </div>
            ))}

            {matches.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginTop: '16px', border: '1px solid rgba(255,215,0,0.3)' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '10px' }}>Create a Prayer Circle with your matches</p>
                <input value={circleName} onChange={e => setCircleName(e.target.value)}
                  placeholder="Name your circle (e.g. Monday Morning Prayer)"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '14px', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <button onClick={createCircle} disabled={creatingCircle} style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ffd700, #ffb300)', color: '#0d2a4a',
                  fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px',
                  boxShadow: '0 4px 16px rgba(255,215,0,0.3)'
                }}>{creatingCircle ? 'Creating...' : '⭕ Create Prayer Circle'}</button>
              </div>
            )}
          </div>
        )}

        {/* CIRCLES VIEW */}
        {view === 'circles' && (
          <div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6' }}>
              Your prayer circles — groups of believers gathered in His name.
            </p>

            {circles.length === 0 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>⭕</p>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>No prayer circles yet.</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Find matches and create your first prayer circle.</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                  <button onClick={() => setView('home')} style={{
                    padding: '10px 24px', borderRadius: '20px', background: 'transparent', color: '#ffffff',
                    fontWeight: '700', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.4)', fontFamily: 'Georgia, serif', fontSize: '14px'
                  }}>← Back</button>
                  <button onClick={() => setView('matches')} style={{
                    padding: '10px 24px', borderRadius: '20px', background: '#ffd700', color: '#0d2a4a',
                    fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px'
                  }}>Find Matches</button>
                </div>
              </div>
            )}

            {circles.map(c => (
              <div key={c.id} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,215,0,0.2)', border: '2px solid rgba(255,215,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>⭕</div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px' }}>{c.name}</p>
                    {c.day_of_week && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>📅 {c.day_of_week} — {c.time_slot}</p>}
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>🤝 {c.meeting_type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GLOBAL VIEW */}
        {view === 'global' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6' }}>
              The global church — believers connecting across every nation, every city, every home.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <button onClick={() => setView('home')} style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
                  borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'Georgia, serif', marginBottom: '8px', display: 'block'
                }}>← Back</button>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', margin: 0, textAlign: 'center' }}>Global Church</p>
              </div>
              <div style={{ height: '200px' }}>
                <GlobalAnimation />
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '16px', fontStyle: 'italic' }}>
                "Go therefore and make disciples of all nations" — Matthew 28:19
              </p>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,215,0,0.8)', marginBottom: '20px' }}>
              🌍 Global fellowship features coming in Phase 2
            </p>
          </div>
        )}

      </div>
    </div>
  )
}