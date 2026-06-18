import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const EMOTIONS = [
  { category: 'Struggling', emotions: [
    { emoji: '😢', label: 'Sad' },
    { emoji: '😞', label: 'Depressed' },
    { emoji: '😟', label: 'Anxious' },
    { emoji: '😰', label: 'Worried' },
    { emoji: '💔', label: 'Desperate' },
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😒', label: 'Jealous' },
    { emoji: '🫥', label: 'Envious' },
    { emoji: '🌀', label: 'Unbalanced' },
    { emoji: '😣', label: 'Guilty' },
    { emoji: '😔', label: 'Regretful' },
    { emoji: '😳', label: 'Embarrassed' },
    { emoji: '💀', label: 'Doomed' },
  ]},
  { category: 'Neutral', emotions: [
    { emoji: '😐', label: 'Undetermined' },
    { emoji: '😶', label: 'Neutral' },
    { emoji: '🤔', label: 'Pensive' },
    { emoji: '☮️', label: 'Calm' },
    { emoji: '😌', label: 'Relaxed' },
    { emoji: '😴', label: 'Lazy' },
    { emoji: '🛌', label: 'Rested' },
    { emoji: '🥺', label: 'Longing' },
    { emoji: '❓', label: 'Uncertain' },
    { emoji: '😕', label: 'Confused' },
    { emoji: '🤨', label: 'Skeptical' },
  ]},
  { category: 'Positive', emotions: [
    { emoji: '😊', label: 'Happy' },
    { emoji: '🙏', label: 'Hopeful' },
    { emoji: '🙌', label: 'Grateful' },
    { emoji: '⚡', label: 'Energetic' },
    { emoji: '🔥', label: 'Unstoppable' },
    { emoji: '🌟', label: 'Blessed' },
    { emoji: '🙇', label: 'Humbled' },
    { emoji: '🕊️', label: 'Peaceful' },
    { emoji: '💪', label: 'Determined' },
    { emoji: '⚖️', label: 'Justified' },
    { emoji: '🏆', label: 'Vindicated' },
    { emoji: '🎉', label: 'Victorious' },
    { emoji: '😮‍💨', label: 'Relieved' },
    { emoji: '🌊', label: 'Refreshed/Renewed' },
  ]},
  { category: 'Watch', emotions: [
    { emoji: '🪨', label: 'Burdened' },
    { emoji: '🦚', label: 'Prideful' },
  ]},
]

function EmotionPicker({ selected, onChange, max = 3 }) {
  const toggle = (label) => {
    if (selected.includes(label)) {
      onChange(selected.filter(e => e !== label))
    } else {
      if (selected.length >= max) return
      onChange([...selected, label])
    }
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
        How are you feeling? (pick up to {max})
      </p>
      {EMOTIONS.map(group => (
        <div key={group.category} style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            {group.category}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {group.emotions.map(e => {
              const isSelected = selected.includes(e.label)
              return (
                <button key={e.label} onClick={() => toggle(e.label)} style={{
                  background: isSelected ? 'rgba(255,215,0,0.3)' : 'rgba(0,0,0,0.2)',
                  border: isSelected ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff', borderRadius: '20px', padding: '5px 10px', fontSize: '12px',
                  fontWeight: isSelected ? '700' : '400',
                  cursor: selected.length >= max && !isSelected ? 'not-allowed' : 'pointer',
                  opacity: selected.length >= max && !isSelected ? 0.4 : 1,
                  fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                }}>
                  {e.emoji} {e.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {selected.length > 0 && (
        <p style={{ fontSize: '13px', color: '#ffd700', fontWeight: '600', marginTop: '6px' }}>
          Selected: {selected.join(', ')}
        </p>
      )}
    </div>
  )
}

function LocationPicker({ spot, setSpot, cityState, setCityState, country, setCountry, label = 'Where are you praying?' }) {
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')

  const useMyLocation = () => {
    setLocating(true)
    setLocError('')
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported on this device.')
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const data = await res.json()
          const city = data.address.city || data.address.town || data.address.village || ''
          const state = data.address.state || ''
          const countryName = data.address.country || ''
          if (city || state) setCityState(`${city}${city && state ? ', ' : ''}${state}`)
          if (countryName) setCountry(countryName)
        } catch {
          setLocError('Could not get location name. Try typing it.')
        }
        setLocating(false)
      },
      () => {
        setLocError('Location access denied. Please type your location.')
        setLocating(false)
      }
    )
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)',
    color: '#ffffff', fontSize: '14px', outline: 'none',
    fontFamily: 'Georgia, serif', boxSizing: 'border-box', marginBottom: '8px'
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
        📍 {label} (optional)
      </p>
      <button onClick={useMyLocation} disabled={locating} style={{
        width: '100%', padding: '10px', borderRadius: '8px',
        background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.5)',
        color: '#ffd700', fontWeight: '600', cursor: 'pointer',
        fontFamily: 'Georgia, serif', fontSize: '13px', marginBottom: '10px'
      }}>
        {locating ? '📍 Finding your location...' : '📍 Use My Location'}
      </button>
      {locError && <p style={{ fontSize: '12px', color: '#ff7a7a', marginBottom: '8px' }}>{locError}</p>}
      <input value={spot} onChange={e => setSpot(e.target.value)} placeholder="Specific spot — e.g. my room, church, car" style={inputStyle} />
      <input value={cityState} onChange={e => setCityState(e.target.value)} placeholder="City, State — e.g. Ridgefield, NJ" style={inputStyle} />
      <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country — e.g. USA" style={{ ...inputStyle, marginBottom: 0 }} />
    </div>
  )
}

export default function Prayer({ setScreen, user }) {
  const [text, setText] = useState('')
  const [prayers, setPrayers] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [showEmotionPicker, setShowEmotionPicker] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [spot, setSpot] = useState('')
  const [cityState, setCityState] = useState('')
  const [country, setCountry] = useState('')

  const [answeredEmotions, setAnsweredEmotions] = useState([])
  const [showAnsweredEmotionPicker, setShowAnsweredEmotionPicker] = useState(null)
  const [answeredSpot, setAnsweredSpot] = useState('')
  const [answeredCityState, setAnsweredCityState] = useState('')
  const [answeredCountry, setAnsweredCountry] = useState('')

  const loadPrayers = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) setStatus(error.message)
    else setPrayers(data || [])
  }

  useEffect(() => { loadPrayers() }, [user])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    })
  }

  const formatLocation = (spot, cityState, country) => {
    const parts = [spot, cityState, country].filter(Boolean)
    return parts.length > 0 ? parts.join(' • ') : null
  }

  const savePrayer = async () => {
    if (!text.trim()) { setStatus('Please enter a prayer first.'); return }
    setLoading(true)
    setStatus('')
    const { error } = await supabase.from('prayers').insert([{
      text: text.trim(), user_id: user.id,
      emotion: selectedEmotions.length > 0 ? selectedEmotions.join(', ') : null,
      location_spot: spot.trim() || null,
      location_city_state: cityState.trim() || null,
      location_country: country.trim() || null
    }])
    if (error) { setStatus('Error: ' + error.message) }
    else {
      setText(''); setSelectedEmotions([]); setShowEmotionPicker(false)
      setSpot(''); setCityState(''); setCountry(''); setShowLocationPicker(false)
      setStatus('Prayer saved!'); loadPrayers()
    }
    setLoading(false)
  }

  const deletePrayer = async (id) => {
    const { error } = await supabase.from('prayers').delete().eq('id', id).eq('user_id', user.id)
    if (error) { setStatus('Error deleting: ' + error.message) }
    else { setConfirmDelete(null); loadPrayers() }
  }

  const toggleAnswered = async (id, current, emotions, aSpot, aCityState, aCountry) => {
    const newAnswered = !current
    const { error } = await supabase.from('prayers').update({
      answered: newAnswered,
      answered_at: newAnswered ? new Date().toISOString() : null,
      answered_emotion: newAnswered && emotions.length > 0 ? emotions.join(', ') : null,
      answered_location_spot: newAnswered ? (aSpot || null) : null,
      answered_location_city_state: newAnswered ? (aCityState || null) : null,
      answered_location_country: newAnswered ? (aCountry || null) : null
    }).eq('id', id).eq('user_id', user.id)
    if (error) { setStatus('Error: ' + error.message) }
    else {
      setShowAnsweredEmotionPicker(null)
      setAnsweredEmotions([]); setAnsweredSpot(''); setAnsweredCityState(''); setAnsweredCountry('')
      loadPrayers()
    }
  }

  const downloadCSV = (filter) => {
    let filtered = [...prayers]
    if (filter === 'answered') filtered = prayers.filter(p => p.answered)
    else if (filter === 'awaiting') filtered = prayers.filter(p => !p.answered)
    else if (filter === 'daterange') {
      filtered = prayers.filter(p => {
        const date = new Date(p.created_at)
        const from = dateFrom ? new Date(dateFrom) : null
        const to = dateTo ? new Date(dateTo + 'T23:59:59') : null
        if (from && date < from) return false
        if (to && date > to) return false
        return true
      })
    }
    if (filtered.length === 0) { setStatus('No prayers found for that filter.'); setShowDownloadMenu(false); return }
    const headers = ['Prayer', 'Emotions at Entry', 'Location Prayed', 'Date Added', 'Status', 'Emotions when Answered', 'Location when Answered', 'Date Answered']
    const rows = filtered.map(p => [
      `"${(p.text || '').replace(/"/g, '""')}"`,
      `"${p.emotion || ''}"`,
      `"${formatLocation(p.location_spot, p.location_city_state, p.location_country) || ''}"`,
      `"${formatDate(p.created_at)}"`,
      p.answered ? 'Answered' : 'Awaiting',
      `"${p.answered_emotion || ''}"`,
      `"${formatLocation(p.answered_location_spot, p.answered_location_city_state, p.answered_location_country) || ''}"`,
      `"${p.answered_at ? formatDate(p.answered_at) : ''}"`
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const fileName = filter === 'all' ? 'all-prayers' : filter === 'answered' ? 'answered-prayers' : filter === 'awaiting' ? 'awaiting-prayers' : 'prayers-by-date'
    a.download = `${fileName}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowDownloadMenu(false)
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 100%)',
      color: 'white', fontFamily: 'Georgia, serif', overflow: 'hidden'
    }}>

      {/* Fixed header — only title and back button */}
      <div style={{ padding: '24px 20px 16px', flexShrink: 0 }}>
        <button onClick={() => setScreen('home')} style={{
          background: 'transparent', border: 'none', color: '#ffffff',
          fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px', padding: 0,
          display: 'block', textAlign: 'left', alignSelf: 'flex-start'
        }}>← Back to Cross</button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)', margin: 0 }}>
            🙏 Prayer Tracker
          </h2>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} style={{
              background: 'rgba(255,215,0,0.2)', border: '2px solid rgba(255,215,0,0.6)',
              color: '#ffd700', borderRadius: '20px', padding: '8px 14px',
              fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif'
            }}>⬇ Download</button>

            {showDownloadMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '44px', zIndex: 100,
                background: '#0d2a4a', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px', padding: '12px', minWidth: '220px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Download as Excel/CSV</p>
                <button onClick={() => downloadCSV('all')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: '600', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '14px', textAlign: 'left' }}>📋 All Prayers</button>
                <button onClick={() => downloadCSV('answered')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '6px', background: 'rgba(100,200,100,0.15)', border: '1px solid rgba(100,200,100,0.3)', color: '#7aff7a', fontWeight: '600', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '14px', textAlign: 'left' }}>✅ Answered Prayers Only</button>
                <button onClick={() => downloadCSV('awaiting')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: '600', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '14px', textAlign: 'left' }}>⏳ Awaiting Prayers Only</button>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>By Date Range</p>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.3)', color: '#ffffff', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box', outline: 'none' }} />
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.3)', color: '#ffffff', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box', outline: 'none' }} />
                <button onClick={() => downloadCSV('daterange')} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', color: '#ffd700', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '14px' }}>⬇ Download Date Range</button>
                <button onClick={() => setShowDownloadMenu(false)} style={{ width: '100%', padding: '8px', borderRadius: '8px', marginTop: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', fontWeight: '600', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px' }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content — prayer form + past prayers */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>

        {status && (
          <p style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '10px', marginBottom: '12px', fontSize: '15px', fontWeight: 'bold', color: '#ffffff' }}>{status}</p>
        )}

        {/* Prayer text input */}
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="What are you praying for?"
          style={{
            width: '100%', padding: '14px', borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)',
            color: '#ffffff', fontSize: '16px', fontWeight: '500', outline: 'none',
            fontFamily: 'Georgia, serif', boxSizing: 'border-box'
          }}
        />

        {/* Emotion picker toggle */}
        <button onClick={() => { setShowEmotionPicker(!showEmotionPicker); setShowLocationPicker(false) }} style={{
          marginTop: '10px', width: '100%', padding: '12px', borderRadius: '10px',
          background: showEmotionPicker ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.2)',
          color: '#ffffff', fontWeight: '600', cursor: 'pointer',
          border: showEmotionPicker ? '2px solid rgba(255,215,0,0.5)' : '2px solid rgba(255,255,255,0.3)',
          fontFamily: 'Georgia, serif', fontSize: '14px', textAlign: 'left'
        }}>
          {selectedEmotions.length > 0 ? `😊 Feeling: ${selectedEmotions.join(', ')}` : '😊 How are you feeling? (optional)'}
          <span style={{ float: 'right' }}>{showEmotionPicker ? '▲' : '▼'}</span>
        </button>

        {showEmotionPicker && (
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', marginTop: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <EmotionPicker selected={selectedEmotions} onChange={setSelectedEmotions} />
            <button onClick={() => setShowEmotionPicker(false)} style={{
              marginTop: '12px', width: '100%', padding: '10px', borderRadius: '10px',
              background: '#ffd700', color: '#0d2a4a', fontWeight: 'bold', cursor: 'pointer',
              border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px'
            }}>✓ Done Selecting Emotions</button>
          </div>
        )}

        {/* Location picker toggle */}
        <button onClick={() => { setShowLocationPicker(!showLocationPicker); setShowEmotionPicker(false) }} style={{
          marginTop: '10px', width: '100%', padding: '12px', borderRadius: '10px',
          background: showLocationPicker ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.2)',
          color: '#ffffff', fontWeight: '600', cursor: 'pointer',
          border: showLocationPicker ? '2px solid rgba(255,215,0,0.5)' : '2px solid rgba(255,255,255,0.3)',
          fontFamily: 'Georgia, serif', fontSize: '14px', textAlign: 'left'
        }}>
          {spot || cityState || country ? `📍 ${[spot, cityState, country].filter(Boolean).join(' • ')}` : '📍 Where are you praying? (optional)'}
          <span style={{ float: 'right' }}>{showLocationPicker ? '▲' : '▼'}</span>
        </button>

        {showLocationPicker && (
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', marginTop: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <LocationPicker spot={spot} setSpot={setSpot} cityState={cityState} setCityState={setCityState} country={country} setCountry={setCountry} label="Where are you praying?" />
            <button onClick={() => setShowLocationPicker(false)} style={{
              marginTop: '12px', width: '100%', padding: '10px', borderRadius: '10px',
              background: '#ffd700', color: '#0d2a4a', fontWeight: 'bold', cursor: 'pointer',
              border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px'
            }}>✓ Done</button>
          </div>
        )}

        {/* Save Prayer button */}
        <button onClick={savePrayer} disabled={loading} style={{
          marginTop: '12px', width: '100%', padding: '14px', borderRadius: '10px',
          background: '#1a1916', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer',
          border: 'none', fontFamily: 'Georgia, serif', fontSize: '16px',
          letterSpacing: '1px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          marginBottom: '24px'
        }}>
          {loading ? 'Saving...' : 'Save Prayer'}
        </button>

        {/* Past Prayers */}
        <h3 style={{
          fontWeight: '700', marginBottom: '16px', fontSize: '20px', color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '8px',
          textShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>Past Prayers ({prayers.length})</h3>

        {prayers.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: '500' }}>
            No prayers yet. Add your first one above.
          </p>
        )}

        {prayers.map((p) => (
          <div key={p.id} style={{
            background: 'rgba(0,0,0,0.2)', padding: '16px', marginBottom: '12px',
            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: '0 0 8px 0', fontSize: '17px', fontWeight: '600', color: '#ffffff',
                  textDecoration: p.answered ? 'line-through' : 'none',
                  opacity: p.answered ? 0.6 : 1, lineHeight: '1.4',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)'
                }}>{p.text}</p>
                {p.emotion && (
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#ffd700' }}>
                    😊 Felt: {p.emotion}
                  </p>
                )}
                {formatLocation(p.location_spot, p.location_city_state, p.location_country) && (
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#d0eeff' }}>
                    📍 Prayed at: {formatLocation(p.location_spot, p.location_city_state, p.location_country)}
                  </p>
                )}
                <p style={{ margin: '0', fontSize: '13px', fontWeight: '600', color: '#d0eeff' }}>
                  🕐 Added: {formatDate(p.created_at)}
                </p>
                {p.answered && p.answered_at && (
                  <>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: '600', color: '#7aff7a' }}>
                      ✅ Answered: {formatDate(p.answered_at)}
                    </p>
                    {p.answered_emotion && (
                      <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: '600', color: '#ffd700' }}>
                        😊 Felt when answered: {p.answered_emotion}
                      </p>
                    )}
                    {formatLocation(p.answered_location_spot, p.answered_location_city_state, p.answered_location_country) && (
                      <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: '600', color: '#d0eeff' }}>
                        📍 Answered at: {formatLocation(p.answered_location_spot, p.answered_location_city_state, p.answered_location_country)}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => {
                    if (!p.answered) {
                      setShowAnsweredEmotionPicker(p.id)
                      setAnsweredEmotions([])
                      setAnsweredSpot(''); setAnsweredCityState(''); setAnsweredCountry('')
                    } else {
                      toggleAnswered(p.id, p.answered, [], '', '', '')
                    }
                  }}
                  style={{
                    background: p.answered ? 'rgba(50,200,50,0.3)' : 'rgba(0,0,0,0.25)',
                    border: p.answered ? '2px solid #7aff7a' : '2px solid rgba(255,255,255,0.4)',
                    color: p.answered ? '#7aff7a' : '#ffffff',
                    borderRadius: '20px', padding: '8px 14px', fontSize: '13px',
                    fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {p.answered ? '✓ Answered' : 'Awaiting'}
                </button>
                <button onClick={() => setConfirmDelete(p.id)} style={{
                  background: 'rgba(200,50,50,0.2)', border: '2px solid rgba(255,100,100,0.4)',
                  color: '#ff9999', borderRadius: '20px', padding: '6px 14px',
                  fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontFamily: 'Georgia, serif'
                }}>🗑 Delete</button>
              </div>
            </div>

            {confirmDelete === p.id && (
              <div style={{ marginTop: '12px', background: 'rgba(200,0,0,0.2)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,100,100,0.4)' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>
                  Are you sure you want to delete this prayer? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => deletePrayer(p.id)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#cc0000', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px' }}>Yes, Delete</button>
                  <button onClick={() => setConfirmDelete(null)} style={{ padding: '10px 16px', borderRadius: '10px', background: 'transparent', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)', fontFamily: 'Georgia, serif', fontSize: '14px' }}>Cancel</button>
                </div>
              </div>
            )}

            {showAnsweredEmotionPicker === p.id && (
              <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>
                  How do you feel now that this prayer was answered?
                </p>
                <EmotionPicker selected={answeredEmotions} onChange={setAnsweredEmotions} />
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginTop: '16px', marginBottom: '4px' }}>
                  Where were you when this prayer was answered?
                </p>
                <LocationPicker
                  spot={answeredSpot} setSpot={setAnsweredSpot}
                  cityState={answeredCityState} setCityState={setAnsweredCityState}
                  country={answeredCountry} setCountry={setAnsweredCountry}
                  label="Where were you when answered?"
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => toggleAnswered(p.id, p.answered, answeredEmotions, answeredSpot, answeredCityState, answeredCountry)}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#ffd700', color: '#0d2a4a', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px' }}>
                    Mark as Answered
                  </button>
                  <button onClick={() => setShowAnsweredEmotionPicker(null)}
                    style={{ padding: '10px 16px', borderRadius: '10px', background: 'transparent', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)', fontFamily: 'Georgia, serif', fontSize: '14px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}