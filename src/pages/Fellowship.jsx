import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

// ============ AVATAR ============

function DefaultAvatarIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="20" fill="#ffffff" />
      <rect x="11" y="10" width="18" height="22" rx="2" fill="#7c3aed" stroke="#5b21b6" strokeWidth="1" />
      <line x1="20" y1="13" x2="20" y2="21" stroke="#ffd700" strokeWidth="2.5" />
      <line x1="16.5" y1="15.5" x2="23.5" y2="15.5" stroke="#ffd700" strokeWidth="2.5" />
    </svg>
  )
}

function AvatarDisplay({ url, size = 36 }) {
  if (url) {
    return <img src={url} alt="avatar" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}>
      <DefaultAvatarIcon size={size} />
    </div>
  )
}

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
      <text x="100" y="185" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="Georgia, serif">Video Prayer & Bible Study</text>
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
// ============ LOCAL GATHERING PLACES ============

function LocalGatheringPlaces({ coords, setCoords, locationMode, setLocationMode, zipCode, setZipCode, customAddress, setCustomAddress, selectedPlace, setSelectedPlace, selectedTimeSlot, setSelectedTimeSlot, nearbyGroups, setNearbyGroups, gatheringStatus, setGatheringStatus, places, setPlaces, activeType, setActiveType, searchRadius, setSearchRadius, user, allAvailability, onlineUsers, onSendMessage }) {
  
  const [openToHosting, setOpenToHosting] = useState(false)
  const [hostingLoading, setHostingLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [myGroups, setMyGroups] = useState([])
  const [myGatheringTimes, setMyGatheringTimes] = useState([])

  const placeTypes = [
    { key: 'church', label: '⛪ Churches', desc: 'Pentecostal & non-denominational' },
    { key: 'starbucks', label: '☕ Starbucks', desc: 'Coffee meetups' },
    { key: 'ihop', label: '🥞 IHOP', desc: 'Breakfast meetups' },
    { key: 'panera', label: '🥖 Panera Bread', desc: 'Casual meetups' },
    { key: 'park', label: '🌳 Parks', desc: 'Outdoor gatherings' },
    { key: 'library', label: '📚 Libraries', desc: 'Quiet study & fellowship' },
  ]

  useEffect(() => {
    if (!user) return
    const loadHostingStatus = async () => {
      const { data } = await supabase.from('user_profiles').select('open_to_hosting').eq('user_id', user.id).single()
      if (data) setOpenToHosting(data.open_to_hosting || false)
    }
    loadHostingStatus()
    loadMyGroups()
  }, [user])

  useEffect(() => {
    loadMyGatheringTimes()
  }, [allAvailability])

  const loadMyGatheringTimes = () => {
    const times = allAvailability.filter(a => a.purpose === 'local_gathering' && !isPastOrExpired(a))
    setMyGatheringTimes(times)
  }

  const loadMyGroups = async () => {
    const { data: memberships } = await supabase.from('gathering_members').select('id, group_id, bringing_guest').eq('user_id', user.id)
    if (!memberships || memberships.length === 0) { setMyGroups([]); return }
    const groupIds = memberships.map(m => m.group_id)
    const { data: groups } = await supabase.from('gathering_groups').select('*, gathering_spots(*), gathering_members(user_id)').in('id', groupIds)
    if (groups) {
      const allMemberUserIds = [...new Set(groups.flatMap(g => g.gathering_members?.map(m => m.user_id) || []))]
      const { data: profiles } = await supabase.from('user_profiles').select('user_id, username, avatar_url').in('user_id', allMemberUserIds)
      setMyGroups(groups.map(g => ({
        ...g,
        memberCount: g.gathering_members?.length || 0,
        memberId: memberships.find(m => m.group_id === g.id)?.id,
        bringing_guest: memberships.find(m => m.group_id === g.id)?.bringing_guest,
        memberProfiles: (g.gathering_members || []).map(m => {
          const profile = profiles?.find(p => p.user_id === m.user_id)
          return { userId: m.user_id, username: profile?.username || 'Fellow Believer', avatarUrl: profile?.avatar_url || null }
        }).filter(m => m.userId !== user.id)
      })))
    }
  }

  const isGroupLocked = (group) => {
    const now = new Date()
    const today = now.toLocaleDateString('en-US', { weekday: 'long' })
    if (group.day_of_the_week !== today) return false
    const [time, period] = group.time_slot.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let startHour = hours
    if (period === 'PM' && hours !== 12) startHour += 12
    if (period === 'AM' && hours === 12) startHour = 0
    const startMinutes = startHour * 60 + minutes
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    return nowMinutes >= startMinutes + 30
  }

  const toggleHosting = async () => {
    setHostingLoading(true)
    const newValue = !openToHosting
    await supabase.from('user_profiles').update({ open_to_hosting: newValue }).eq('user_id', user.id)
    setOpenToHosting(newValue)
    setHostingLoading(false)
  }

  const getGPSLocation = () => {
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setError('Could not get your location. Try zip code instead.')
        setLocating(false)
      }
    )
  }

  const getZipLocation = async () => {
    if (!zipCode.trim()) { setError('Please enter a zip code.'); return }
    setLocating(true)
    setError('')
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&format=json`)
      const data = await res.json()
      if (data.length > 0) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      } else {
        setError('Zip code not found. Try another.')
      }
    } catch {
      setError('Could not look up zip code.')
    }
    setLocating(false)
  }

  const searchPlaces = async (type) => {
    if (!coords) { setError('Please set your location first.'); return }
    setActiveType(type)
    setLoading(true)
    setError('')
    setPlaces([])

    const radiusMeters = (searchRadius || 5) * 1609
    const queries = {
      church: `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="christian"](around:${radiusMeters},${coords.lat},${coords.lng});way["amenity"="place_of_worship"]["religion"="christian"](around:${radiusMeters},${coords.lat},${coords.lng}););out center 20;`,
      starbucks: `[out:json][timeout:25];(node["brand"="Starbucks"](around:${radiusMeters},${coords.lat},${coords.lng});way["brand"="Starbucks"](around:${radiusMeters},${coords.lat},${coords.lng}););out center 10;`,
      ihop: `[out:json][timeout:25];(node["brand"="IHOP"](around:${radiusMeters},${coords.lat},${coords.lng});way["brand"="IHOP"](around:${radiusMeters},${coords.lat},${coords.lng}););out center 10;`,
      panera: `[out:json][timeout:25];(node["brand"="Panera Bread"](around:${radiusMeters},${coords.lat},${coords.lng});way["brand"="Panera Bread"](around:${radiusMeters},${coords.lat},${coords.lng}););out center 10;`,
      park: `[out:json][timeout:25];(node["leisure"="park"](around:${radiusMeters},${coords.lat},${coords.lng});way["leisure"="park"](around:${radiusMeters},${coords.lat},${coords.lng}););out center 15;`,
      library: `[out:json][timeout:25];(node["amenity"="library"](around:${radiusMeters},${coords.lat},${coords.lng});way["amenity"="library"](around:${radiusMeters},${coords.lat},${coords.lng}););out center 10;`
    }

    const query = queries[type]
    if (!query) { setLoading(false); return }

    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query)
      })
      const data = await res.json()
      
      const distanceMiles = (lat1, lng1, lat2, lng2) => {
        const R = 3958.8
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLng = (lng2 - lng1) * Math.PI / 180
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        return Math.round(R * c * 10) / 10
      }

      const places = data.elements.map(el => {
        const lat = el.lat || el.center?.lat
        const lng = el.lon || el.center?.lon
        return {
          id: el.id,
          name: el.tags?.name || el.tags?.brand || 'Unnamed',
          lat,
          lng,
          distance: distanceMiles(coords.lat, coords.lng, lat, lng),
          address: [
            el.tags?.['addr:housenumber'],
            el.tags?.['addr:street'],
            el.tags?.['addr:city'],
            el.tags?.['addr:state'],
            el.tags?.['addr:postcode']
          ].filter(Boolean).join(' '),
          denomination: el.tags?.denomination || null
        }
      }).filter(p => p.name !== 'Unnamed' && p.lat && p.lng)
      .filter(p => p.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance)

      if (places.length > 0) setPlaces(places)
      else setError('No results found nearby.')
    } catch {
      setError('Search failed. Try again.')
    }
    setLoading(false)
  }

  const openInMaps = (place) => {
    const query = place.address ? `${place.name} ${place.address}` : `${place.name} near ${coords?.lat},${coords?.lng}`
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank')
  }

  const selectPlace = async (place) => {
    if (place.id === 'custom' && (!place.lat || !place.lng)) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place.address)}&format=json&limit=1&countrycodes=us&addressdetails=1`)
        const data = await res.json()
        if (data.length > 0) {
          place = { ...place, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        }
      } catch (e) {
        console.error('geocode error:', e)
      }
    }
    setSelectedPlace(place)
    setNearbyGroups([])
    setSelectedTimeSlot('')
    setGatheringStatus('')
  }

  const pickTimeSlot = async (slot) => {
    const key = slot.time_slot + '|' + slot.day_of_the_week
    setSelectedTimeSlot(key)
    setLoadingGroups(true)
    setNearbyGroups([])
    try {
      const res = await fetch('/.netlify/functions/findNearbyGroups', {
        method: 'POST',
        body: JSON.stringify({
          lat: selectedPlace.lat || coords?.lat,
          lng: selectedPlace.lng || coords?.lng,
          day: slot.day_of_the_week,
          timeSlot: slot.time_slot
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.groups) setNearbyGroups(data.groups)
      }
    } catch (e) {
      console.error('findNearbyGroups error:', e)
    }
    setLoadingGroups(false)
  }

  const startOwnGroup = async () => {
    if (!selectedPlace || !selectedTimeSlot) return
    const [timeSlot, day] = selectedTimeSlot.split('|')
    if (myGroups.length >= 5) { setGatheringStatus('You have reached the maximum of 5 gatherings. Leave one to start a new one.'); return }
    let spotId
    const { data: existingSpots } = await supabase.from('gathering_spots').select('id').eq('address', selectedPlace.address)
    const existingSpot = existingSpots?.[0] || null
    if (existingSpot) {
      spotId = existingSpot.id
    } else {
      const { data: newSpot } = await supabase.from('gathering_spots').insert([{
        name: selectedPlace.name,
        address: selectedPlace.address || '',
        lat: selectedPlace.lat || coords?.lat || null,
        lng: selectedPlace.lng || coords?.lng || null,
        type: activeType || 'custom',
        created_by: user.id
      }]).select().single()
      spotId = newSpot?.id
    }
    if (!spotId) { setGatheringStatus('Error saving location. Try again.'); return }
    const { data: newGroup } = await supabase.from('gathering_groups').insert([{
      spot_id: spotId, day_of_the_week: day, time_slot: timeSlot,
      initiated_by: user.id, member_count: 1, max_members: 5
    }]).select().single()
    if (!newGroup) { setGatheringStatus('Error creating group. Try again.'); return }
    await supabase.from('gathering_members').insert([{ group_id: newGroup.id, user_id: user.id }])
    setGatheringStatus('Gathering started! Nearby believers will be notified.')
    setSelectedPlace(null)
    setSelectedTimeSlot('')
    loadMyGroups()
  }

  const joinGroup = async (group) => {
    if (myGroups.length >= 5) { setGatheringStatus('You have reached the maximum of 5 gatherings.'); return }
    const { error } = await supabase.from('gathering_members').insert([{ group_id: group.id, user_id: user.id }])
    if (error) { setGatheringStatus('Could not join group. Try again.'); return }
    await supabase.from('gathering_groups').update({ member_count: group.memberCount + 1 }).eq('id', group.id)
    setGatheringStatus('You joined the gathering!')
    setSelectedPlace(null)
    setSelectedTimeSlot('')
    loadMyGroups()
  }

  const leaveGroup = async (group) => {
    await supabase.from('gathering_members').delete().eq('id', group.memberId)
    await supabase.from('gathering_groups').update({ member_count: Math.max(0, group.memberCount - 1) }).eq('id', group.id)
    loadMyGroups()
  }

  const notifyWhenOpen = async () => {
    setGatheringStatus('You will be notified if a spot opens.')
  }

  const toggleBringingGuest = async (memberId, value) => {
    await supabase.from('gathering_members').update({ bringing_guest: value }).eq('id', memberId)
    loadMyGroups()
  }

  return (
    <div style={{ marginTop: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
      <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffd700', marginBottom: '4px' }}>📍 Find a Place to Meet</p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>Public meetups recommended for first meetings</p>

      {/* HOME/APARTMENT HOSTING OPTION */}
      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: openToHosting ? '12px' : '0' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: '0 0 2px' }}>🏠 Open to Home/Apartment Meetup</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Let matches know you're open to meeting at a private residence</p>
          </div>
          <button onClick={toggleHosting} disabled={hostingLoading} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            background: openToHosting ? 'rgba(122,255,122,0.2)' : 'rgba(0,0,0,0.2)',
            color: openToHosting ? '#7aff7a' : 'rgba(255,255,255,0.6)',
            border: openToHosting ? '1px solid rgba(122,255,122,0.5)' : '1px solid rgba(255,255,255,0.2)',
            fontFamily: 'Georgia, serif'
          }}>{hostingLoading ? '...' : openToHosting ? 'On' : 'Off'}</button>
        </div>
        {openToHosting && (
          <div style={{ background: 'rgba(255,215,0,0.08)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(255,215,0,0.2)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.6' }}>
              As adult believers, you and your fellow members have the right to meet at someone's home. Before doing so, we strongly encourage a video call first — schedule one in Video Prayer & Bible Study, or start one immediately if others are available now. Proceeding without a video call is discouraged but remains your choice as a believer. Proceed prayerfully.
            </p>
          </div>
        )}
      </div>

      {/* INITIATE PUBLIC PLACE MEETING */}
      <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>Initiate a Public Place Meeting</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setLocationMode('gps')} style={{
          flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
          background: locationMode === 'gps' ? 'rgba(255,215,0,0.25)' : 'rgba(0,0,0,0.15)',
          color: locationMode === 'gps' ? '#ffd700' : '#ffffff',
          border: locationMode === 'gps' ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
          fontFamily: 'Georgia, serif'
        }}>📡 Use My Location</button>
        <button onClick={() => setLocationMode('zip')} style={{
          flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
          background: locationMode === 'zip' ? 'rgba(255,215,0,0.25)' : 'rgba(0,0,0,0.15)',
          color: locationMode === 'zip' ? '#ffd700' : '#ffffff',
          border: locationMode === 'zip' ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
          fontFamily: 'Georgia, serif'
        }}>🔢 Enter Zip Code</button>
      </div>

      {locationMode === 'gps' ? (
        <button onClick={getGPSLocation} disabled={locating} style={{
          width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '8px',
          background: coords ? 'rgba(122,255,122,0.2)' : 'rgba(0,0,0,0.2)',
          border: coords ? '1px solid rgba(122,255,122,0.5)' : '1px solid rgba(255,255,255,0.2)',
          color: coords ? '#7aff7a' : '#ffffff', fontWeight: '700', cursor: 'pointer',
          fontFamily: 'Georgia, serif', fontSize: '13px'
        }}>{locating ? 'Locating...' : coords ? '✓ Location found' : 'Detect My Location'}</button>
      ) : (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="Enter zip code"
            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '13px', outline: 'none', fontFamily: 'Georgia, serif' }}
          />
          <button onClick={getZipLocation} disabled={locating} style={{
            padding: '10px 16px', borderRadius: '8px', background: '#ffd700', color: '#0d2a4a',
            fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '13px'
          }}>{locating ? '...' : 'Go'}</button>
        </div>
      )}

      {coords && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <p style={{ fontSize: '12px', color: '#7aff7a', fontWeight: '700', margin: 0 }}>✓ Location found</p>
          <button onClick={() => setCoords(null)} style={{
            padding: '4px 10px', borderRadius: '20px',
            background: 'rgba(200,50,50,0.15)', border: '1px solid rgba(255,100,100,0.3)',
            color: '#ff9999', fontWeight: '700', cursor: 'pointer',
            fontFamily: 'Georgia, serif', fontSize: '11px'
          }}>✕ Clear</button>
        </div>
      )}

      {error && <p style={{ fontSize: '12px', color: '#ff9999', marginBottom: '10px' }}>{error}</p>}
<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0', alignSelf: 'center' }}>Radius:</p>
        {[2, 5, 7].map(r => (
          <button key={r} onClick={() => setSearchRadius(r)} style={{
            padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            background: searchRadius === r ? 'rgba(255,215,0,0.25)' : 'rgba(0,0,0,0.2)',
            color: searchRadius === r ? '#ffd700' : '#ffffff',
            border: searchRadius === r ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
            fontFamily: 'Georgia, serif'
          }}>{r} mi</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {placeTypes.map(t => (
          <button key={t.key} onClick={() => searchPlaces(t.key)} style={{
            padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            background: activeType === t.key ? 'rgba(255,215,0,0.25)' : 'rgba(0,0,0,0.2)',
            color: activeType === t.key ? '#ffd700' : '#ffffff',
            border: activeType === t.key ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
            fontFamily: 'Georgia, serif'
          }}>{t.label}</button>
        ))}
      </div>

      {loading && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Searching...</p>}

      {places.length > 0 && (
        <div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{places.length} results found</p>
          {places.map((p, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', marginBottom: '8px', border: selectedPlace?.id === p.id ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: '0 0 2px' }}>{p.name}</p>
                  {p.address && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>{p.address}</p>}
                  <p style={{ fontSize: '11px', color: 'rgba(255,215,0,0.7)', margin: '0 0 2px' }}>{p.distance} miles away</p>
                  {p.denomination && <p style={{ fontSize: '11px', color: 'rgba(255,215,0,0.7)', margin: '0 0 4px' }}>{p.denomination}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                  <button onClick={() => openInMaps(p)} style={{
                    padding: '6px 10px', borderRadius: '20px',
                    background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)',
                    color: '#ffd700', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    fontFamily: 'Georgia, serif'
                  }}>🗺️ Map</button>
                  <button onClick={() => selectPlace(p)} style={{
                    padding: '6px 10px', borderRadius: '20px',
                    background: 'rgba(122,255,122,0.2)', border: '1px solid rgba(122,255,122,0.5)',
                    color: '#7aff7a', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                  }}>⛪ Gather Here</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOM ADDRESS */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>Or enter a custom public address:</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={customAddress} onChange={e => setCustomAddress(e.target.value)} placeholder="e.g. 123 Main St, Newark NJ"
            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '13px', outline: 'none', fontFamily: 'Georgia, serif' }}
          />
          <button onClick={() => selectPlace({ id: 'custom', name: customAddress, address: customAddress, lat: null, lng: null })} disabled={!customAddress.trim()} style={{
            padding: '10px 14px', borderRadius: '8px', background: '#ffd700', color: '#0d2a4a',
            fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '12px'
          }}>Use This</button>
        </div>
      </div>

      {/* GATHERING HUB PANEL */}
      {selectedPlace && (
        <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,215,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', margin: '0 0 2px' }}>📍 {selectedPlace.name}</p>
              {selectedPlace.address && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{selectedPlace.address}</p>}
            </div>
            <button onClick={() => { setSelectedPlace(null); setNearbyGroups([]); setSelectedTimeSlot('') }} style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer'
            }}>✕</button>
          </div>

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Pick your matched time slot:</p>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '12px' }}>
            {myGatheringTimes.length === 0 && (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>No Local Gathering times set yet. Add one above first.</p>
            )}
            {myGatheringTimes.map((t, i) => (
              <button key={i} onClick={() => pickTimeSlot(t)} style={{
                flexShrink: 0, padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                background: selectedTimeSlot === t.time_slot + '|' + t.day_of_the_week ? 'rgba(255,215,0,0.3)' : 'rgba(0,0,0,0.2)',
                color: selectedTimeSlot === t.time_slot + '|' + t.day_of_the_week ? '#ffd700' : '#ffffff',
                border: selectedTimeSlot === t.time_slot + '|' + t.day_of_the_week ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
              }}>{t.is_recurring ? `Every ${t.day_of_the_week}` : t.day_of_the_week} — {t.time_slot}</button>
            ))}
          </div>

          {loadingGroups && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '12px' }}>Finding nearby gatherings...</p>}

          {nearbyGroups.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>
                {nearbyGroups.length} gathering{nearbyGroups.length > 1 ? 's' : ''} found nearby:
              </p>
              {nearbyGroups.map((g, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', marginBottom: '8px', border: g.isFull ? '1px solid rgba(255,100,100,0.3)' : '1px solid rgba(122,255,122,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: '0 0 2px' }}>{g.spotName}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>{g.distance} miles away · Started by @{g.initiatorUsername}</p>
                      <p style={{ fontSize: '11px', color: g.isFull ? '#ff9999' : '#7aff7a', margin: 0, fontWeight: '700' }}>
                        {g.memberCount}/{g.maxMembers} {g.isFull ? '· FULL' : '· Open'}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {!g.isFull ? (
                        <button onClick={() => joinGroup(g)} style={{
                          padding: '6px 12px', borderRadius: '20px',
                          background: 'rgba(122,255,122,0.2)', border: '1px solid rgba(122,255,122,0.5)',
                          color: '#7aff7a', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                          fontFamily: 'Georgia, serif'
                        }}>Join</button>
                      ) : (
                        <button onClick={() => notifyWhenOpen(g)} style={{
                          padding: '6px 12px', borderRadius: '20px',
                          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                          color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                          fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                        }}>🔔 Notify Me</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTimeSlot && !loadingGroups && (
            <button onClick={startOwnGroup} style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: nearbyGroups.length > 0 ? 'rgba(0,0,0,0.2)' : 'linear-gradient(135deg, #ffd700, #ffb300)',
              color: nearbyGroups.length > 0 ? '#ffffff' : '#0d2a4a',
              fontWeight: '700', cursor: 'pointer',
              border: nearbyGroups.length > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              fontFamily: 'Georgia, serif', fontSize: '13px'
            }}>
              {nearbyGroups.length > 0 ? '+ Start My Own Group Here Instead' : '⛪ Start a Gathering Here'}
            </button>
          )}

          {gatheringStatus && (
            <p style={{ fontSize: '13px', color: '#7aff7a', marginTop: '10px', fontWeight: '700', textAlign: 'center' }}>{gatheringStatus}</p>
          )}
        </div>
      )}

      {/* MY GATHERINGS */}
      {myGroups.length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '10px' }}>My Gatherings</p>
          {myGroups.map((g, i) => {
            const isLocked = isGroupLocked(g)
            return (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: '0 0 2px' }}>{g.gathering_spots?.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>{g.day_of_the_week} — {g.time_slot}</p>
                    <p style={{ fontSize: '11px', color: '#7aff7a', margin: '0 0 6px' }}>{g.memberCount}/{g.max_members} members</p>
                    {g.memberProfiles && g.memberProfiles.map((m, mi) => (
                      <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,215,0,0.4)' }}>
                            {m.avatarUrl ? <img src={m.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <DefaultAvatarIcon size={24} />}
                          </div>
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '7px', height: '7px', borderRadius: '50%', background: onlineUsers?.[m.userId] ? '#7aff7a' : '#888888', border: '1px solid rgba(0,0,0,0.4)' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>@{m.username}</span>
                        <button onClick={() => onSendMessage(m)} style={{
                          padding: '3px 8px', borderRadius: '12px', fontSize: '11px',
                          background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)',
                          color: '#ffd700', cursor: 'pointer', fontFamily: 'Georgia, serif'
                        }}>💬</button>
                      </div>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', marginTop: '4px' }}>
                      <input type="checkbox" checked={g.bringing_guest || false} onChange={(e) => toggleBringingGuest(g.memberId, e.target.checked)} />
                      Bringing a guest
                    </label>
                  </div>
                  {!isLocked ? (
                    <button onClick={() => leaveGroup(g)} style={{
                      padding: '6px 10px', borderRadius: '20px',
                      background: 'rgba(200,50,50,0.2)', border: '1px solid rgba(255,100,100,0.4)',
                      color: '#ff9999', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                      fontFamily: 'Georgia, serif'
                    }}>Leave</button>
                  ) : (
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Locked</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
// ============ CONSTANTS & HELPERS ============

const TIME_SLOTS = [
  '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
  '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM',
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
]
const MEETING_TYPES = ['Video Call', 'In Person']
const RECURRENCE_TYPES = ['Weekly', 'Biweekly', 'Monthly']
const EXPIRY_DAYS = 90

const PURPOSE_LABELS = {
  prayer_circle: 'Video Prayer & Bible Study',
  accountability: 'Accountability',
  local_gathering: 'Local Gathering'
}

function getDateOptions() {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

function formatDateForDB(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dbDateToLocal(dbDate) {
  return new Date(dbDate + 'T00:00:00')
}

function formatShortDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function getDayName(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isPastOrExpired(entry) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (entry.is_recurring) {
    if (!entry.expires_at) return false
    return dbDateToLocal(entry.expires_at) < today
  } else {
    if (!entry.event_date) return false
    return dbDateToLocal(entry.event_date) < today
  }
}

function isExpiringSoon(entry) {
  if (!entry.is_recurring || !entry.expires_at) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = dbDateToLocal(entry.expires_at)
  const diffDays = Math.round((exp - today) / 86400000)
  return diffDays >= 0 && diffDays <= 7
}

// ============ TIMES + MATCHES PANEL ============

function TimesAndMatchesPanel({ purpose, label, user, allAvailability, onAvailabilityChange, onBack, showCircles, circles, onCirclesChange, onStartCall, onStartGroupCall, onlineUsers, meetingTypes, onSendMessage }) {
  const [dateMode, setDateMode] = useState('specific')
  const [selectedDateStr, setSelectedDateStr] = useState('')
  const [selectedRecurringDay, setSelectedRecurringDay] = useState('')
  const [recurrenceType, setRecurrenceType] = useState('Weekly')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [matches, setMatches] = useState([])
  const [circleName, setCircleName] = useState('')
  const [creatingCircle, setCreatingCircle] = useState(false)
  const [showVideoDisclaimer, setShowVideoDisclaimer] = useState(false)

  const dateOptions = getDateOptions()
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const myTimes = allAvailability.filter(a => a.purpose === purpose)
  const myActiveTimes = myTimes.filter(a => !isPastOrExpired(a))

  const currentDayOfWeek = dateMode === 'specific' && selectedDateStr
    ? getDayName(dbDateToLocal(selectedDateStr))
    : selectedRecurringDay

  const findConflict = (day, time) => {
    const hit = allAvailability.find(a =>
      a.purpose !== purpose && a.day_of_the_week === day && a.time_slot === time && !isPastOrExpired(a)
    )
    return hit ? hit.purpose : null
  }

  const liveConflict = (currentDayOfWeek && selectedTime) ? findConflict(currentDayOfWeek, selectedTime) : null

  const saveTime = async () => {
    if (!selectedTime || !selectedType) { setStatus('Please select a time and meeting type.'); return }
    if (dateMode === 'specific' && !selectedDateStr) { setStatus('Please select a date.'); return }
    if (dateMode === 'recurring' && !selectedRecurringDay) { setStatus('Please select a day of the week.'); return }

    setSaving(true)
    const dayName = currentDayOfWeek
    const payload = {
      user_id: user.id,
      day_of_the_week: dayName,
      time_slot: selectedTime,
      meeting_type: selectedType,
      purpose,
      is_recurring: dateMode === 'recurring',
      event_date: dateMode === 'specific' ? selectedDateStr : null,
      recurrence_type: dateMode === 'recurring' ? recurrenceType : null,
      expires_at: dateMode === 'recurring' ? formatDateForDB(addDays(new Date(), EXPIRY_DAYS)) : null,
      created_at: new Date().toISOString()
    }

    const { error } = await supabase.from('fellowship_availability').insert([payload])
    if (error) { setStatus('Error: ' + error.message) }
    else {
      setStatus('Time saved!')
      setSelectedDateStr(''); setSelectedRecurringDay(''); setSelectedTime(''); setSelectedType('')
      onAvailabilityChange()
    }
    setSaving(false)
  }

  const deleteTime = async (id) => {
    await supabase.from('fellowship_availability').delete().eq('id', id)
    onAvailabilityChange()
  }

  const renewTime = async (id) => {
    const newExpiry = formatDateForDB(addDays(new Date(), EXPIRY_DAYS))
    await supabase.from('fellowship_availability').update({ expires_at: newExpiry }).eq('id', id)
    onAvailabilityChange()
  }

  const findMatches = async () => {
    if (myActiveTimes.length === 0) { setMatches([]); return }
    const { data: allPurposeAvail } = await supabase.from('fellowship_availability').select('*').eq('purpose', purpose).neq('user_id', user.id)
    if (!allPurposeAvail) { setMatches([]); return }
    const activeOthers = allPurposeAvail.filter(a => !isPastOrExpired(a))
    const matchedUserIds = []
    const matchedEntries = []
    activeOthers.forEach(a => {
      const hasMatch = myActiveTimes.some(m =>
        m.day_of_the_week === a.day_of_the_week && m.time_slot === a.time_slot &&
        (m.meeting_type === a.meeting_type || m.meeting_type === 'Either' || a.meeting_type === 'Either')
      )
      if (hasMatch && !matchedUserIds.includes(a.user_id)) {
        matchedUserIds.push(a.user_id)
        matchedEntries.push(a)
      }
    })
    if (matchedUserIds.length > 0) {
      const { data: profiles } = await supabase.from('user_profiles').select('user_id, username, avatar_url, open_to_hosting').in('user_id', matchedUserIds)
      setMatches(matchedEntries.map(m => {
        const profile = profiles?.find(p => p.user_id === m.user_id)
        return { ...m, username: profile?.username || 'Fellow Believer', avatarUrl: profile?.avatar_url || null, open_to_hosting: profile?.open_to_hosting || false }
      }))
    } else {
      setMatches([])
    }
  }

  useEffect(() => { findMatches() }, [allAvailability])

  const createCircle = async () => {
    if (!circleName.trim()) { setStatus('Please enter a circle name.'); return }
    if (circles.length >= 5) { setStatus('Maximum of 5 prayer circles reached. Remove one to create a new one.'); return }
    setCreatingCircle(true)
    const { data, error } = await supabase.from('fellowship_circles').insert([{
      name: circleName.trim(), created_by: user.id, meeting_type: selectedType || 'Either',
      day_of_the_week: currentDayOfWeek || '', time_slot: selectedTime || '', created_at: new Date().toISOString()
    }]).select().single()
    if (error) { console.error('createCircle error:', error); setStatus('Error: ' + error.message) }
    else {
      const memberInserts = [{ circle_id: data.id, user_id: user.id, joined_at: new Date().toISOString() }]
      matches.slice(0, 4).forEach(m => {
        memberInserts.push({ circle_id: data.id, user_id: m.user_id, joined_at: new Date().toISOString() })
      })
      const { error: memberError } = await supabase.from('fellowship_members').insert(memberInserts)
if (memberError) console.error('member insert error:', memberError)
      setStatus(`Prayer circle created with ${memberInserts.length} member${memberInserts.length > 1 ? 's' : ''}!`)
      setCircleName('')
      onCirclesChange()
    }
    setCreatingCircle(false)
  }

  const removeCircle = async (circleId) => {
    await supabase.from('fellowship_members').delete().eq('circle_id', circleId)
    await supabase.from('fellowship_circles').delete().eq('id', circleId)
    onCirclesChange()
  }

  const describeEntry = (a) => {
    if (a.is_recurring) {
      return `Every ${a.day_of_the_week} — ${a.time_slot} (${a.recurrence_type})`
    }
    const d = dbDateToLocal(a.event_date)
    return `${formatShortDate(d)} — ${a.time_slot}`
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
          borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700',
          cursor: 'pointer', fontFamily: 'Georgia, serif', marginBottom: '10px', display: 'block'
        }}>← Back</button>
        <p style={{ fontSize: '20px', fontWeight: '700', color: '#ffd700', margin: 0 }}>{label}</p>
      </div>

      {status && (
        <p style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', padding: '10px', borderRadius: '10px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{status}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

        {/* LEFT: Set Times */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '12px' }}>Set Your Times</p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button onClick={() => setDateMode('specific')} style={{
              flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              background: dateMode === 'specific' ? 'rgba(255,215,0,0.25)' : 'rgba(0,0,0,0.15)',
              color: dateMode === 'specific' ? '#ffd700' : '#ffffff',
              border: dateMode === 'specific' ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
              fontFamily: 'Georgia, serif'
            }}>📅 Specific Date</button>
            <button onClick={() => setDateMode('recurring')} style={{
              flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              background: dateMode === 'recurring' ? 'rgba(255,215,0,0.25)' : 'rgba(0,0,0,0.15)',
              color: dateMode === 'recurring' ? '#ffd700' : '#ffffff',
              border: dateMode === 'recurring' ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
              fontFamily: 'Georgia, serif'
            }}>🔁 Recurring</button>
          </div>

          {dateMode === 'specific' ? (
            <>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Pick a date (next 14 days):</p>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '14px' }}>
                {dateOptions.map(d => {
                  const dbStr = formatDateForDB(d)
                  return (
                    <button key={dbStr} onClick={() => setSelectedDateStr(dbStr)} style={{
                      flexShrink: 0, padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      background: selectedDateStr === dbStr ? 'rgba(255,215,0,0.3)' : 'rgba(0,0,0,0.2)',
                      color: selectedDateStr === dbStr ? '#ffd700' : '#ffffff',
                      border: selectedDateStr === dbStr ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                      fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                    }}>{formatShortDate(d)}</button>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Repeats every:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {DAYS.map(d => (
                  <button key={d} onClick={() => setSelectedRecurringDay(d)} style={{
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    background: selectedRecurringDay === d ? 'rgba(255,215,0,0.3)' : 'rgba(0,0,0,0.2)',
                    color: selectedRecurringDay === d ? '#ffd700' : '#ffffff',
                    border: selectedRecurringDay === d ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                    fontFamily: 'Georgia, serif'
                  }}>{d}</button>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>How often:</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {RECURRENCE_TYPES.map(t => (
                  <button key={t} onClick={() => setRecurrenceType(t)} style={{
                    flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    background: recurrenceType === t ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.15)',
                    color: recurrenceType === t ? '#ffd700' : '#ffffff',
                    border: recurrenceType === t ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
                    fontFamily: 'Georgia, serif'
                  }}>{t}</button>
                ))}
              </div>
            </>
          )}

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Time slot:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', maxHeight: '220px', overflowY: 'auto' }}>
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
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {(meetingTypes || MEETING_TYPES).map(t => (
              <button key={t} onClick={() => {
                setSelectedType(t)
                setShowVideoDisclaimer(t === 'Video Call' && purpose === 'local_gathering')
              }} style={{
                flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                background: selectedType === t ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.15)',
                color: selectedType === t ? '#ffd700' : '#ffffff',
                border: selectedType === t ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
                fontFamily: 'Georgia, serif'
              }}>{t}</button>
            ))}
            {showVideoDisclaimer && (
              <div style={{ marginTop: '8px', background: 'rgba(255,215,0,0.08)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(255,215,0,0.2)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: '1.6' }}>
                  We understand that life happens and you may not always be able to attend in person. We've made a way for you to still be part of this gathering through video — you'll count as one of the 5 members just as if you were there. God bless you for staying connected with your brothers and sisters in Christ.
                </p>
              </div>
            )}
          </div>

          {liveConflict && (
            <p style={{ fontSize: '12px', color: '#ffb347', marginBottom: '10px', fontWeight: '600' }}>
              ⚠️ Conflicts with your {PURPOSE_LABELS[liveConflict]} time at this slot.
            </p>
          )}

          <button onClick={saveTime} disabled={saving} style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: '#1a1916', color: '#ffffff', fontWeight: 'bold',
            cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)', marginBottom: '16px'
          }}>{saving ? 'Saving...' : '+ Add This Time'}</button>

          {myTimes.length > 0 && (
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>My {label}:</p>
              {myTimes.map(a => {
                const conflict = !isPastOrExpired(a) ? findConflict(a.day_of_the_week, a.time_slot) : null
                const expired = isPastOrExpired(a)
                const expiringSoon = isExpiringSoon(a)
                return (
                  <div key={a.id} style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', marginBottom: '8px',
                    border: expired ? '1px solid rgba(255,100,100,0.4)' : conflict ? '1px solid rgba(255,179,71,0.5)' : '1px solid rgba(255,255,255,0.15)',
                    opacity: expired ? 0.6 : 1
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 2px' }}>{describeEntry(a)}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{a.meeting_type}</p>
                        {conflict && !expired && (
                          <p style={{ fontSize: '11px', color: '#ffb347', margin: '4px 0 0', fontWeight: '600' }}>⚠️ Also booked for {PURPOSE_LABELS[conflict]}</p>
                        )}
                        {expired && (
                          <p style={{ fontSize: '11px', color: '#ff9999', margin: '4px 0 0', fontWeight: '600' }}>
                            {a.is_recurring ? 'Expired — renew to keep matching' : 'Date has passed'}
                          </p>
                        )}
                        {expiringSoon && !expired && (
                          <p style={{ fontSize: '11px', color: '#ffd700', margin: '4px 0 0', fontWeight: '600' }}>Expiring soon</p>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                        {a.is_recurring && (expired || expiringSoon) && (
                          <button onClick={() => renewTime(a.id)} style={{
                            background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)',
                            color: '#ffd700', borderRadius: '20px', padding: '4px 10px',
                            fontSize: '11px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                          }}>Renew</button>
                        )}
                        <button onClick={() => deleteTime(a.id)} style={{
                          background: 'rgba(200,50,50,0.2)', border: '1px solid rgba(255,100,100,0.4)',
                          color: '#ff9999', borderRadius: '20px', padding: '4px 10px',
                          fontSize: '11px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                        }}>Remove</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Matches (+ Circles) */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffd700', marginBottom: '12px' }}>Matches</p>

          {matches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 8px' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>🙏</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>No matches yet. Add a time to find believers who share it.</p>
            </div>
          )}

          {matches.map((m, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ border: '2px solid rgba(255,215,0,0.5)', borderRadius: '50%' }}>
                    <AvatarDisplay url={m.avatarUrl} size={36} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: onlineUsers?.[m.user_id] ? '#7aff7a' : '#888888',
                    border: '2px solid rgba(0,0,0,0.4)'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700', margin: '0 0 2px' }}>@{m.username}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{describeEntry(m)} · {m.meeting_type} · <span style={{ color: onlineUsers?.[m.user_id] ? '#7aff7a' : '#888888' }}>{onlineUsers?.[m.user_id] ? 'Online' : 'Offline'}</span></p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => onStartCall(m, purpose)} style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(122,255,122,0.2)', border: '1px solid rgba(122,255,122,0.5)',
                    color: '#7aff7a', fontSize: '15px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }} title="Start video call">📞</button>
                  <button onClick={() => onSendMessage(m)} style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)',
                    color: '#ffd700', fontSize: '15px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }} title="Send message">💬</button>
                </div>
              </div>
            </div>
          ))}

          {showCircles && (
            <>
              {matches.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>Create a Prayer Circle</p>
                  <input value={circleName} onChange={e => setCircleName(e.target.value)}
                    placeholder="Name your circle"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '13px', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box', marginBottom: '8px' }}
                  />
                  <button onClick={createCircle} disabled={creatingCircle} style={{
                    width: '100%', padding: '10px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ffd700, #ffb300)', color: '#0d2a4a',
                    fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '13px'
                  }}>{creatingCircle ? 'Creating...' : '⭕ Create Prayer Circle'}</button>
                </div>
              )}

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>My Prayer Circles</p>
                {circles.length === 0 && (
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>No circles yet.</p>
                )}
                {circles.map(c => (
                  <div key={c.id} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px' }}>{c.name}</p>
                        {c.day_of_week && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '0 0 6px' }}>📅 {c.day_of_week} — {c.time_slot} · {c.meeting_type}</p>}
                        {c.members && c.members.filter(m => m.userId !== user.id).map(m => (
                          <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                                {m.avatarUrl ? (
                                  <img src={m.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <DefaultAvatarIcon size={24} />
                                )}
                              </div>
                              <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                width: '7px', height: '7px', borderRadius: '50%',
                                background: onlineUsers?.[m.userId] ? '#7aff7a' : '#888888',
                                border: '1px solid rgba(0,0,0,0.4)'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', color: onlineUsers?.[m.userId] ? '#7aff7a' : 'rgba(255,255,255,0.7)', fontWeight: '700' }}>@{m.username}</span>
                            <span style={{ fontSize: '12px', color: onlineUsers?.[m.userId] ? '#7aff7a' : '#888888', fontWeight: '700' }}>{onlineUsers?.[m.userId] ? '● Online' : '● Offline'}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => onStartGroupCall(c)} style={{
                          padding: '6px 10px', borderRadius: '20px',
                          background: 'rgba(122,255,122,0.2)', border: '1px solid rgba(122,255,122,0.5)',
                          color: '#7aff7a', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                          fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                        }}>🎥 Join Call</button>
                        {c.created_by === user.id && (
                          <button onClick={() => removeCircle(c.id)} style={{
                            padding: '6px 10px', borderRadius: '20px',
                            background: 'rgba(200,50,50,0.2)', border: '1px solid rgba(255,100,100,0.4)',
                            color: '#ff9999', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                            fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                          }}>Remove</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============

export default function Fellowship({ setScreen, user, username, avatarUrl, onAvatarChange, onStartCall, onStartGroupCall, gatheringCoords, setGatheringCoords, gatheringLocationMode, setGatheringLocationMode, gatheringZipCode, setGatheringZipCode, gatheringCustomAddress, setGatheringCustomAddress, gatheringSelectedPlace, setGatheringSelectedPlace, gatheringSelectedTimeSlot, setGatheringSelectedTimeSlot, gatheringNearbyGroups, setGatheringNearbyGroups, gatheringStatus, setGatheringStatus, gatheringPlaces, setGatheringPlaces, gatheringActiveType, setGatheringActiveType, gatheringSearchRadius, setGatheringSearchRadius, onlineUsers, onOpenInbox, unreadCount }) {
  const [view, setView] = useState(() => localStorage.getItem('fellowshipView') || 'home')
  const [allAvailability, setAllAvailability] = useState([])
  const [circles, setCircles] = useState([])
  const [showAvatarPanel, setShowAvatarPanel] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)

  const changeView = (newView) => {
    setView(newView)
    localStorage.setItem('fellowshipView', newView)
  }

  useEffect(() => {
    if (user) { loadAvailability(); loadCircles() }
  }, [user])

  const loadAvailability = async () => {
    const { data } = await supabase.from('fellowship_availability').select('*').eq('user_id', user.id)
    if (data) setAllAvailability(data)
  }

  const loadCircles = async () => {
    const { data } = await supabase.from('fellowship_members').select('circle_id').eq('user_id', user.id)
    if (data && data.length > 0) {
      const circleIds = data.map(d => d.circle_id)
      const { data: circleData } = await supabase.from('fellowship_circles').select('*').in('id', circleIds)
      if (circleData) {
        const { data: allMembers } = await supabase.from('fellowship_members').select('circle_id, user_id').in('circle_id', circleIds)
        const memberUserIds = [...new Set(allMembers?.map(m => m.user_id) || [])]
        const { data: profiles } = await supabase.from('user_profiles').select('user_id, username, avatar_url').in('user_id', memberUserIds)
        const enriched = circleData.map(c => {
          const members = allMembers?.filter(m => m.circle_id === c.id) || []
          const memberProfiles = members.map(m => {
            const profile = profiles?.find(p => p.user_id === m.user_id)
            return { userId: m.user_id, username: profile?.username || 'Fellow Believer', avatarUrl: profile?.avatar_url || null }
          })
          return { ...c, memberCount: members.length, members: memberProfiles }
        })
        setCircles(enriched)
      }
    }
  }

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setAvatarError('Max file size is 5MB'); return }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setAvatarError('Please choose a JPG, PNG, or WEBP image'); return }
    setAvatarError('')
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return
    setAvatarUploading(true)
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const newUrl = urlData.publicUrl + '?t=' + Date.now()
      await supabase.from('user_profiles').update({ avatar_url: newUrl }).eq('user_id', user.id)
      onAvatarChange(newUrl)
      setShowAvatarPanel(false)
      setAvatarFile(null)
      setAvatarPreview(null)
    } else {
      setAvatarError('Upload failed: ' + uploadError.message)
    }
    setAvatarUploading(false)
  }

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
      <div style={{ padding: '20px 20px 12px', flexShrink: 0, position: 'relative', zIndex: 50 }}>
        <button onClick={() => setScreen('home')} style={{
          background: 'transparent', border: 'none', color: '#ffffff',
          fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: 0,
          marginBottom: '12px', display: 'block', fontFamily: 'Georgia, serif'
        }}>← Back to Cross</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)', margin: 0 }}>
            ✝️ Christian Fellowship
          </h2>
          <div style={{ position: 'relative' }}>
            <button onClick={onOpenInbox} style={{
              background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: '20px',
              padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginRight: '8px'
            }}>
              <span style={{ fontSize: '14px' }}>📬</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffd700', fontFamily: 'Georgia, serif' }}>Inbox</span>
              {unreadCount > 0 && (
                <span style={{ background: '#ff4444', color: '#ffffff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
              )}
            </button>
            <button onClick={() => setShowAvatarPanel(!showAvatarPanel)} style={{
              background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: '20px',
              padding: '4px 12px 4px 6px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <AvatarDisplay url={avatarUrl} size={24} />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#7aff7a', border: '1px solid rgba(0,0,0,0.4)'
                }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffd700' }}>@{username}</span>
            </button>

            {showAvatarPanel && (
              <div style={{
                position: 'absolute', right: 0, top: '40px', zIndex: 9999,
                background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px', padding: '16px', width: '220px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#ffd700', marginBottom: '10px' }}>Update Photo</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <AvatarDisplay url={avatarPreview || avatarUrl} size={64} />
                </div>
                <label style={{
                  display: 'block', width: '100%', padding: '8px', borderRadius: '8px', marginBottom: '8px',
                  background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', color: '#ffd700',
                  fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '12px',
                  textAlign: 'center', boxSizing: 'border-box'
                }}>
                  Choose Photo
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} style={{ display: 'none' }} />
                </label>
                {avatarError && <p style={{ fontSize: '11px', color: '#ff7a7a', marginBottom: '8px', textAlign: 'center' }}>{avatarError}</p>}
                {avatarFile && (
                  <button onClick={uploadAvatar} disabled={avatarUploading} style={{
                    width: '100%', padding: '8px', borderRadius: '8px', marginBottom: '8px',
                    background: '#ffd700', color: '#0d2a4a', fontWeight: '700', cursor: 'pointer',
                    border: 'none', fontFamily: 'Georgia, serif', fontSize: '12px'
                  }}>{avatarUploading ? 'Saving...' : 'Save Photo'}</button>
                )}
                <button onClick={() => setShowAvatarPanel(false)} style={{
                  width: '100%', padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
                  fontWeight: '600', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '12px'
                }}>Close</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'home', label: '🏠 Home' },
            { key: 'prayer', label: '🙏 Video Prayer & Bible Study' },
            { key: 'accountability', label: '🤝 Accountability Matches' },
            { key: 'gathering', label: '✝️ Local Gathering Times' },
            { key: 'global', label: '🌍 Global Church' },
          ].map(tab => (
            <button key={tab.key} onClick={() => changeView(tab.key)} style={{
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

        {/* HOME VIEW */}
        {view === 'home' && (
          <div>
            <p style={{ fontSize: '24px', fontWeight: '700', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6', fontFamily: 'Garamond, Georgia, serif' }}>
              "For where two or three gather in my name, there am I with them." — Matthew 18:20
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { component: <PrayerCircleAnimation />, view: 'prayer' },
                { component: <AccountabilityAnimation />, view: 'accountability' },
                { component: <GatheringAnimation />, view: 'gathering' },
                { component: <GlobalAnimation />, view: 'global' },
              ].map((item, i) => (
                <div key={i} onClick={() => changeView(item.view)} style={{
                  background: 'rgba(0,0,0,0.2)', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  aspectRatio: '1', overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)', cursor: 'pointer'
                }}>
                  {item.component}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRAYER CIRCLE TIMES */}
        {view === 'prayer' && (
          <TimesAndMatchesPanel
            purpose="prayer_circle"
            label="Video Prayer & Bible Study"
            user={user}
            allAvailability={allAvailability}
            onAvailabilityChange={loadAvailability}
            onBack={() => changeView('home')}
            showCircles={true}
            circles={circles}
            onCirclesChange={loadCircles}
            onStartCall={onStartCall}
            onStartGroupCall={onStartGroupCall}
            onlineUsers={onlineUsers}
            meetingTypes={['Video Call']}
            onSendMessage={(m) => { onOpenInbox(m); }}
          />
        )}

        {/* ACCOUNTABILITY MATCHES */}
        {view === 'accountability' && (
          <TimesAndMatchesPanel
            purpose="accountability"
            label="Accountability Matches"
            user={user}
            allAvailability={allAvailability}
            onAvailabilityChange={loadAvailability}
            onBack={() => changeView('home')}
            showCircles={false}
            onStartCall={onStartCall}
            onStartGroupCall={onStartGroupCall}
            onlineUsers={onlineUsers}
            onSendMessage={(m) => { onOpenInbox(m); }}
          />
        )}

       {/* LOCAL GATHERING TIMES */}
        <div style={{ display: view === 'gathering' ? 'block' : 'none' }}>
          <TimesAndMatchesPanel
            purpose="local_gathering"
            label="Local Gathering Times"
            user={user}
            allAvailability={allAvailability}
            onAvailabilityChange={loadAvailability}
            onBack={() => changeView('home')}
            showCircles={false}
            onStartCall={onStartCall}
            onStartGroupCall={onStartGroupCall}
            onlineUsers={onlineUsers}
            onSendMessage={(m) => { onOpenInbox(m); }}
          />
          <LocalGatheringPlaces
        
            coords={gatheringCoords}
            setCoords={setGatheringCoords}
            locationMode={gatheringLocationMode}
            setLocationMode={setGatheringLocationMode}
            zipCode={gatheringZipCode}
            setZipCode={setGatheringZipCode}
            customAddress={gatheringCustomAddress}
            setCustomAddress={setGatheringCustomAddress}
            selectedPlace={gatheringSelectedPlace}
            setSelectedPlace={setGatheringSelectedPlace}
            selectedTimeSlot={gatheringSelectedTimeSlot}
            setSelectedTimeSlot={setGatheringSelectedTimeSlot}
            nearbyGroups={gatheringNearbyGroups}
            setNearbyGroups={setGatheringNearbyGroups}
            gatheringStatus={gatheringStatus}
            setGatheringStatus={setGatheringStatus}
            places={gatheringPlaces}
            setPlaces={setGatheringPlaces}
            activeType={gatheringActiveType}
            setActiveType={setGatheringActiveType}
            searchRadius={gatheringSearchRadius}
            setSearchRadius={setGatheringSearchRadius}
            user={user}
            allAvailability={allAvailability}
            onlineUsers={onlineUsers}
            onSendMessage={(m) => { onOpenInbox(m); }}
          />
        </div>

        {/* GLOBAL VIEW */}
        {view === 'global' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6' }}>
              The global church — believers connecting across every nation, every city, every home.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <button onClick={() => changeView('home')} style={{
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