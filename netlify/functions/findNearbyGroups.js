exports.handler = async (event) => {
  const { createClient } = require('@supabase/supabase-js')
  const { lat, lng, day, timeSlot } = JSON.parse(event.body || '{}')
  
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: groups } = await supabase
    .from('gathering_groups')
    .select('*, gathering_spots(*), gathering_members(user_id, bringing_guest)')
    .eq('day_of_the_week', day)
    .eq('time_slot', timeSlot)

  if (!groups) return { statusCode: 200, body: JSON.stringify({ groups: [] }) }

  const distanceMiles = (lat1, lng1, lat2, lng2) => {
    const R = 3958.8
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const nearby = groups
    .filter(g => g.gathering_spots?.lat && g.gathering_spots?.lng)
    .map(g => ({
      ...g,
      distance: distanceMiles(lat, lng, g.gathering_spots.lat, g.gathering_spots.lng),
      memberCount: g.gathering_members?.length || 0,
      isFull: (g.gathering_members?.length || 0) >= g.max_members
    }))
    .filter(g => g.distance <= 5)
    .sort((a, b) => a.distance - b.distance)

  if (nearby.length === 0) return { statusCode: 200, body: JSON.stringify({ groups: [] }) }

  const initiatorIds = [...new Set(nearby.map(g => g.initiated_by))]
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, username, avatar_url')
    .in('user_id', initiatorIds)

  const result = nearby.map(g => ({
    id: g.id,
    spotId: g.spot_id,
    spotName: g.gathering_spots.name,
    spotAddress: g.gathering_spots.address,
    spotLat: g.gathering_spots.lat,
    spotLng: g.gathering_spots.lng,
    day: g.day_of_the_week,
    timeSlot: g.time_slot,
    memberCount: g.memberCount,
    maxMembers: g.max_members,
    isFull: g.isFull,
    distance: Math.round(g.distance * 10) / 10,
    initiatedBy: g.initiated_by,
    initiatorUsername: profiles?.find(p => p.user_id === g.initiated_by)?.username || 'Fellow Believer'
  }))

  return { statusCode: 200, body: JSON.stringify({ groups: result }) }
}