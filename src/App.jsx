import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import './App.css'
import Scripture from './pages/Scripture'
import Fellowship from './pages/Fellowship'
import GoldCross from './components/GoldCross'
import Prayer from './pages/Prayer'
import UserInboxBadge from './components/UserInboxBadge'
import BibleTetris from './components/BibleTetris'

const PURPOSE_LABELS = {
  prayer_circle: 'Video Prayer & Bible Study',
  accountability: 'Accountability',
  local_gathering: 'Local Gathering'
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:openrelay.metered.ca:80' },
    { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
    { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
    { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
  ]
}

const MAX_GROUP_SIZE = 5

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

function ComingSoon({ title, emoji, setScreen, user, username, avatarUrl, onAvatarChange, unreadCount, onOpenInbox }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 40%, #87ceeb 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      justifyContent: 'flex-start', fontFamily: 'Georgia, serif',
      color: 'white', textAlign: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '8%', left: '-10%', width: '300px', height: '80px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: '200px', height: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', top: '15%', right: '-5%', width: '250px', height: '70px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <button onClick={() => setScreen('home')} style={{
            background: 'transparent', border: 'none', color: '#ffffff',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            padding: 0, display: 'block', textAlign: 'left'
          }}>← Back to Cross</button>
          <UserInboxBadge user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={onAvatarChange} unreadCount={unreadCount} onOpenInbox={onOpenInbox} compact />
        </div>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{emoji}</div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{title}</h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Coming soon...</p>
      </div>
    </div>
  )
}

function UsernameSetup({ user, onComplete }) {
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checking, setChecking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState('')

  const checkUsername = async (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsernameInput(cleaned)
    if (cleaned.length < 3) { setUsernameAvailable(null); return }
    setChecking(true)
    const { data } = await supabase.from('user_profiles').select('username').eq('username', cleaned).single()
    setUsernameAvailable(!data)
    setChecking(false)
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

  const saveUsername = async () => {
    if (!usernameInput.trim() || !usernameAvailable) return
    setSaving(true)

    let avatarUrl = null
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${user.id}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
        avatarUrl = urlData.publicUrl + '?t=' + Date.now()
      }
    }

    const { error } = await supabase.from('user_profiles').insert([{
      user_id: user.id, username: usernameInput.trim(), avatar_url: avatarUrl, created_at: new Date().toISOString()
    }])
    if (error) { setStatus('Error: ' + error.message) }
    else { onComplete(usernameInput.trim(), avatarUrl) }
    setSaving(false)
  }

  const bgStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 70%, #e0f4ff 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', fontFamily: 'Georgia, serif',
    color: 'white', textAlign: 'center', padding: '24px',
    position: 'relative', overflow: 'hidden'
  }

  return (
    <div style={bgStyle}>
      <div style={{ position: 'absolute', top: '8%', left: '-10%', width: '300px', height: '80px', background: 'rgba(255,255,255,0.7)', borderRadius: '50px', filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: '200px', height: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(6px)' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '360px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px', color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          HisJoyMyStrength
        </h1>
        <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '32px', fontStyle: 'italic' }}>
          One last step before you begin your journey
        </p>

        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffd700', marginBottom: '8px' }}>Choose Your Username</p>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
            This is how other believers will see you here.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <label style={{ cursor: 'pointer', position: 'relative' }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="preview" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,215,0,0.6)' }} />
              ) : (
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,215,0,0.6)' }}>
                  <DefaultAvatarIcon size={72} />
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: 0, right: 0, background: '#ffd700', borderRadius: '50%',
                width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', border: '2px solid #1a6bbd'
              }}>📷</div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} style={{ display: 'none' }} />
            </label>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Tap to add a photo (optional)</p>
          {avatarError && <p style={{ fontSize: '12px', color: '#ff7a7a', marginBottom: '8px' }}>{avatarError}</p>}

          <input
            value={usernameInput}
            onChange={e => checkUsername(e.target.value)}
            placeholder="e.g. blessed_warrior, faith_walker"
            maxLength={20}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '100px',
              border: `2px solid ${usernameAvailable === true ? '#7aff7a' : usernameAvailable === false ? '#ff7a7a' : 'rgba(255,255,255,0.4)'}`,
              background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '18px',
              outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box', marginBottom: '8px', marginTop: '10px'
            }}
          />

          {usernameInput.length > 0 && usernameInput.length < 3 && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Minimum 3 characters</p>
          )}
          {checking && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Checking availability...</p>
          )}
          {usernameAvailable === true && (
            <p style={{ fontSize: '12px', color: '#7aff7a', marginBottom: '8px' }}>✓ Username available!</p>
          )}
          {usernameAvailable === false && (
            <p style={{ fontSize: '12px', color: '#ff7a7a', marginBottom: '8px' }}>✗ Already taken. Try another.</p>
          )}

          <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
            Lowercase letters, numbers, underscores only. Max 20 characters.
          </p>

          {status && <p style={{ fontSize: '13px', color: '#ff7a7a', marginBottom: '12px' }}>{status}</p>}

          <button onClick={saveUsername} disabled={!usernameAvailable || saving} style={{
            width: '100%', padding: '14px', borderRadius: '100px',
            background: usernameAvailable ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
            color: usernameAvailable ? '#1a6bbd' : '#0d2a4a',
            fontSize: '18px', fontWeight: '700', cursor: usernameAvailable ? 'pointer' : 'not-allowed',
            border: 'none', fontFamily: 'Georgia, serif'
          }}>
            {saving ? 'Saving...' : '✝️ Enter HisJoyMyStrength'}
          </button>
        </div>
      </div>
    </div>
  )
}
function InboxList({ user, onSelectConversation, onUnreadChange }) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    const { data } = await supabase
      .from('private_messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!data) { setLoading(false); return }

    const otherUserIds = [...new Set(data.map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id))]
    const { data: profiles } = await supabase.from('user_profiles').select('user_id, username, avatar_url').in('user_id', otherUserIds)

    const convMap = {}
    data.forEach(m => {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id
      if (!convMap[otherId]) {
        const profile = profiles?.find(p => p.user_id === otherId)
        convMap[otherId] = {
          userId: otherId,
          username: profile?.username || 'Fellow Believer',
          avatarUrl: profile?.avatar_url || null,
          lastMessage: m.message,
          lastTime: m.created_at,
          unread: 0
        }
      }
      if (m.receiver_id === user.id && !m.read) convMap[otherId].unread++
    })

    setConversations(Object.values(convMap))
    onUnreadChange(Object.values(convMap).reduce((sum, c) => sum + c.unread, 0))
    setLoading(false)
  }

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px', fontFamily: 'Georgia, serif' }}>Loading...</p>

  if (conversations.length === 0) return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Georgia, serif', fontSize: '14px' }}>No messages yet. Start a conversation with a match!</p>
    </div>
  )

  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {conversations.map((conv, i) => (
        <div key={i} onClick={() => onSelectConversation(conv)} style={{
          padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
          background: conv.unread > 0 ? 'rgba(255,215,0,0.05)' : 'transparent'
        }}>
          <div style={{ flexShrink: 0 }}>
            {conv.avatarUrl ? (
              <img src={conv.avatarUrl} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: conv.unread > 0 ? '#ffd700' : '#ffffff', margin: 0, fontFamily: 'Georgia, serif' }}>@{conv.username}</p>
              {conv.unread > 0 && (
                <span style={{ background: '#ff4444', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{conv.unread}</span>
              )}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ConversationView({ user, conversation, onBack, onlineUsers }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
    markAsRead()
    const channel = supabase
      .channel('conv-' + conversation.userId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_messages' }, (payload) => {
        const m = payload.new
        if ((m.sender_id === user.id && m.receiver_id === conversation.userId) ||
            (m.sender_id === conversation.userId && m.receiver_id === user.id)) {
          setMessages(prev => [...prev, m])
          markAsRead()
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversation.userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    const { data } = await supabase
      .from('private_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversation.userId}),and(sender_id.eq.${conversation.userId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  const markAsRead = async () => {
    await supabase.from('private_messages').update({ read: true }).eq('sender_id', conversation.userId).eq('receiver_id', user.id).eq('read', false)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return
    setSending(true)
    await supabase.from('private_messages').insert([{
      sender_id: user.id,
      receiver_id: conversation.userId,
      message: newMessage.trim()
    }])
    setNewMessage('')
    setSending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
        fontFamily: 'Georgia, serif', fontSize: '12px', cursor: 'pointer',
        padding: '8px 20px', textAlign: 'left'
      }}>← Back to Inbox</button>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
        {messages.map((m, i) => {
          const isMine = m.sender_id === user.id
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
              <div style={{
                maxWidth: '75%', padding: '8px 12px', borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isMine ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
                border: isMine ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.15)'
              }}>
                <p style={{ fontSize: '13px', color: '#ffffff', margin: 0, fontFamily: 'Georgia, serif', lineHeight: '1.5' }}>{m.message}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', textAlign: isMine ? 'right' : 'left' }}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: '8px' }}>
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)',
            color: '#ffffff', fontSize: '13px', outline: 'none', fontFamily: 'Georgia, serif'
          }}
        />
        <button onClick={sendMessage} disabled={sending || !newMessage.trim()} style={{
          padding: '10px 16px', borderRadius: '20px',
          background: newMessage.trim() ? '#ffd700' : 'rgba(255,255,255,0.1)',
          color: newMessage.trim() ? '#0d2a4a' : 'rgba(255,255,255,0.4)',
          fontWeight: '700', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
          border: 'none', fontFamily: 'Georgia, serif', fontSize: '13px'
        }}>Send</button>
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
  const [username, setUsername] = useState(null)
  const [tetrisOpened, setTetrisOpened] = useState(false)
  const [showTetris, setShowTetris] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [screen, setScreen] = useState(() => {
    return localStorage.getItem('lastScreen') || 'login'
  })
  const [onlineUsers, setOnlineUsers] = useState({})
  const presenceChannelRef = useRef(null)
  const [upcomingReminder, setUpcomingReminder] = useState(null)
  const [showInbox, setShowInbox] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [inboxView, setInboxView] = useState('list')
  const [selectedConversation, setSelectedConversation] = useState(null)

  // ---- 1-on-1 call state ----
  const [incomingCall, setIncomingCall] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const [callStatus, setCallStatus] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [remoteCameraOn, setRemoteCameraOn] = useState(true)
  const peerConnectionRef = useRef(null)
  const callChannelRef = useRef(null)
  const callStatusChannelRef = useRef(null)
  const localStreamRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // ---- Group call state (Prayer Circles, up to 5 people) ----
  const [activeGroupCall, setActiveGroupCall] = useState(null)
  const [groupParticipants, setGroupParticipants] = useState([])
  const [groupLocalStream, setGroupLocalStream] = useState(null)
  const [groupMicOn, setGroupMicOn] = useState(true)
  const [groupCameraOn, setGroupCameraOn] = useState(true)
  const groupLocalStreamRef = useRef(null)
  const groupPeerConnectionsRef = useRef({})
  const groupChannelRef = useRef(null)
  const [scriptureDay, setScriptureDay] = useState(1)
  const [scriptureDayLoaded, setScriptureDayLoaded] = useState(false)
  const [gatheringCoords, setGatheringCoords] = useState(null)
  const [gatheringLocationMode, setGatheringLocationMode] = useState('gps')
  const [gatheringZipCode, setGatheringZipCode] = useState('')
  const [gatheringCustomAddress, setGatheringCustomAddress] = useState('')
  const [gatheringSelectedPlace, setGatheringSelectedPlace] = useState(null)
  const [gatheringSelectedTimeSlot, setGatheringSelectedTimeSlot] = useState('')
  const [gatheringNearbyGroups, setGatheringNearbyGroups] = useState([])
  const [gatheringStatus, setGatheringStatus] = useState('')
  const [gatheringPlaces, setGatheringPlaces] = useState([])
  const [gatheringActiveType, setGatheringActiveType] = useState(null)
  const [gatheringSearchRadius, setGatheringSearchRadius] = useState(5)
  const groupJoiningRef = useRef(false)

  const navigateTo = (newScreen) => {
    setScreen(newScreen)
    localStorage.setItem('lastScreen', newScreen)
  }

  const openInbox = (match) => {
    setShowInbox(true)
    if (match && match.user_id) {
      setSelectedConversation({ userId: match.user_id, username: match.username, avatarUrl: match.avatarUrl })
      setInboxView('conversation')
    } else {
      setInboxView('list')
    }
  }


  useEffect(() => {
    let mounted = true

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return
        if (session) {
          setUser(session.user)
          loadProfile(session.user.id)
          const saved = localStorage.getItem('lastScreen')
          if (!saved || saved === 'login') navigateTo('home')
        } else {
          setUser(null)
          setUsername(null)
          setAvatarUrl(null)
          navigateTo('login')
        }
      })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session) {
        setUser(session.user)
        loadProfile(session.user.id)
        const saved = localStorage.getItem('lastScreen')
        if (!saved || saved === 'login') navigateTo('home')
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])
useEffect(() => {
    if (!user) return
    const existing = supabase.getChannels().find(c => c.topic === 'realtime:online-users')
    if (existing) supabase.removeChannel(existing)
    const channel = supabase.channel('online-users', {
      config: { presence: { key: user.id } }
    })
    presenceChannelRef.current = channel
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const online = {}
        Object.keys(state).forEach(uid => { online[uid] = true })
        setOnlineUsers(online)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => ({ ...prev, [key]: true }))
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })
    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => {
    if (!user) return
    const checkUpcoming = async () => {
      const now = new Date()
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const totalMinutes = hours * 60 + minutes + 5
      const reminderHours = Math.floor(totalMinutes / 60) % 24
      const reminderMinutes = totalMinutes % 60
      const period = reminderHours < 12 ? 'AM' : 'PM'
      const displayHours = reminderHours % 12 === 0 ? 12 : reminderHours % 12
      const displayMinutes = reminderMinutes === 0 ? '00' : reminderMinutes < 10 ? `0${reminderMinutes}` : `${reminderMinutes}`
      const targetSlot = `${displayHours}:${displayMinutes} ${period}`

      const { data: mySlots } = await supabase
        .from('fellowship_availability')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_of_the_week', dayName)
        .eq('time_slot', targetSlot)

      if (!mySlots || mySlots.length === 0) return

      for (const slot of mySlots) {
        const { data: matches } = await supabase
          .from('fellowship_availability')
          .select('*')
          .eq('purpose', slot.purpose)
          .eq('day_of_the_week', dayName)
          .eq('time_slot', targetSlot)
          .neq('user_id', user.id)

        if (matches && matches.length > 0) {
          const matchUserIds = matches.map(m => m.user_id)
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('user_id, username, avatar_url')
            .in('user_id', matchUserIds)

          const firstMatch = matches[0]
          const profile = profiles?.find(p => p.user_id === firstMatch.user_id)

          setUpcomingReminder({
            purpose: slot.purpose,
            timeSlot: targetSlot,
            matchUser: {
              user_id: firstMatch.user_id,
              username: profile?.username || 'Fellow Believer',
              avatarUrl: profile?.avatar_url || null
            }
          })
          return
        }
      }
    }

    checkUpcoming()
    const interval = setInterval(checkUpcoming, 60000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('incoming-calls-' + user.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fellowship_calls', filter: `callee_id=eq.${user.id}` }, async (payload) => {
        if (payload.new.status === 'ringing') {
          const { data: profile } = await supabase.from('user_profiles').select('username, avatar_url').eq('user_id', payload.new.caller_id).single()
          setIncomingCall({ ...payload.new, callerUsername: profile?.username || 'Fellow Believer', callerAvatar: profile?.avatar_url })
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])
  useEffect(() => {
    if (!user) return
    const loadUnread = async () => {
      const { count } = await supabase
        .from('private_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false)
      setUnreadCount(count || 0)
    }
    loadUnread()
    const channel = supabase
      .channel('private-messages-' + user.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `receiver_id=eq.${user.id}` }, () => {
        loadUnread()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream
  }, [localStream])
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream
  }, [remoteStream])

  const loadProfile = async (userId) => {
    setCheckingUsername(true)
    const { data, error } = await supabase.from('user_profiles').select('username, avatar_url').eq('user_id', userId).single()
    if (data && !error) {
      setUsername(data.username)
      setAvatarUrl(data.avatar_url || null)
    } else {
      setUsername(null)
      setAvatarUrl(null)
    }
    setCheckingUsername(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setMessage(error.message) }
    else { setMessage('Account created! You can now sign in.') }
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage(error.message) }
    else if (data?.user) {
      fetch('/.netlify/functions/logIP', {
        method: 'POST',
        body: JSON.stringify({ user_id: data.user.id, event_type: 'login' })
      })
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    if (activeCall) await endCall(true)
    if (activeGroupCall) leaveGroupCall()
    await supabase.auth.signOut()
    localStorage.removeItem('lastScreen')
    setUsername(null)
    setAvatarUrl(null)
  }

  // ============ 1-ON-1 CALL FUNCTIONS ============

  const setupPeerConnection = async (callId, isCaller) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      setLocalStream(stream)

      const pc = new RTCPeerConnection(ICE_SERVERS)
      peerConnectionRef.current = pc

      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
        setCallStatus('connected')
      }

      const channel = supabase.channel('call-' + callId)
      callChannelRef.current = channel

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          channel.send({ type: 'broadcast', event: 'ice-candidate', payload: { candidate: event.candidate, from: isCaller ? 'caller' : 'callee' } })
        }
      }

      channel
        .on('broadcast', { event: 'callee-ready' }, async () => {
          if (!isCaller) return
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          channel.send({ type: 'broadcast', event: 'offer', payload: { offer } })
        })
        .on('broadcast', { event: 'offer' }, async ({ payload }) => {
          if (isCaller) return
          await pc.setRemoteDescription(new RTCSessionDescription(payload.offer))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          channel.send({ type: 'broadcast', event: 'answer', payload: { answer } })
        })
        .on('broadcast', { event: 'answer' }, async ({ payload }) => {
          if (!isCaller) return
          await pc.setRemoteDescription(new RTCSessionDescription(payload.answer))
        })
        .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
          const fromOther = isCaller ? payload.from === 'callee' : payload.from === 'caller'
          if (fromOther && payload.candidate) {
            try { await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)) } catch (e) {}
          }
        })
        .on('broadcast', { event: 'camera-toggle' }, ({ payload }) => {
          setRemoteCameraOn(payload.cameraOn)
        })
        .on('broadcast', { event: 'call-ended' }, () => {
          endCall(false)
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED' && !isCaller) {
            channel.send({ type: 'broadcast', event: 'callee-ready', payload: {} })
          }
        })
    } catch (err) {
      alert('Could not access camera/microphone: ' + err.message)
      setActiveCall(null)
      setCallStatus(null)
    }
  }

  const startCall = async (matchUser, purpose) => {
    const { data, error } = await supabase.from('fellowship_calls').insert([{
      caller_id: user.id,
      callee_id: matchUser.user_id,
      status: 'ringing',
      call_type: purpose,
      created_at: new Date().toISOString()
    }]).select().single()
    if (error) { alert('Could not start call: ' + error.message); return }

    setActiveCall({ ...data, isCaller: true, otherUsername: matchUser.username, otherAvatar: matchUser.avatarUrl })
    setCallStatus('calling')

    const statusChannel = supabase
      .channel('call-status-' + data.id)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'fellowship_calls', filter: `id=eq.${data.id}` }, (payload) => {
        if (payload.new.status === 'declined') {
          endCall(false)
        }
      })
      .subscribe()
    callStatusChannelRef.current = statusChannel

    await setupPeerConnection(data.id, true)
  }

  const acceptCall = async () => {
    const call = incomingCall
    setIncomingCall(null)
    setActiveCall({ ...call, isCaller: false, otherUsername: call.callerUsername, otherAvatar: call.callerAvatar })
    setCallStatus('connecting')
    await supabase.from('fellowship_calls').update({ status: 'active' }).eq('id', call.id)
    await setupPeerConnection(call.id, false)
  }

  const declineCall = async () => {
    if (!incomingCall) return
    await supabase.from('fellowship_calls').update({ status: 'declined' }).eq('id', incomingCall.id)
    setIncomingCall(null)
  }

  const endCall = async (notify = true) => {
    if (notify && callChannelRef.current) {
      callChannelRef.current.send({ type: 'broadcast', event: 'call-ended', payload: {} })
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
      localStreamRef.current = null
    }
    if (callChannelRef.current) {
      supabase.removeChannel(callChannelRef.current)
      callChannelRef.current = null
    }
    if (callStatusChannelRef.current) {
      supabase.removeChannel(callStatusChannelRef.current)
      callStatusChannelRef.current = null
    }
    if (activeCall) {
      await supabase.from('fellowship_calls').update({ status: 'ended' }).eq('id', activeCall.id)
    }
    setActiveCall(null)
    setCallStatus(null)
    setLocalStream(null)
    setRemoteStream(null)
    setMicOn(true)
    setCameraOn(true)
    setRemoteCameraOn(true)
  }

  const toggleMic = () => {
    if (!localStreamRef.current) return
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setMicOn(audioTrack.enabled)
    }
  }

  const toggleCamera = () => {
    if (!localStreamRef.current) return
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setCameraOn(videoTrack.enabled)
      if (callChannelRef.current) {
        callChannelRef.current.send({ type: 'broadcast', event: 'camera-toggle', payload: { cameraOn: videoTrack.enabled } })
      }
    }
  }

  // ============ GROUP CALL FUNCTIONS (Prayer Circles, up to 5) ============

  const startOrJoinGroupCall = async (circle) => {
    if (activeGroupCall || groupJoiningRef.current) return
    groupJoiningRef.current = true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      groupLocalStreamRef.current = stream
      setGroupLocalStream(stream)
      setActiveGroupCall({ circleId: circle.id, circleName: circle.name })
      setGroupParticipants([])

      const connectToPeer = async (channel, otherId, presenceInfo, initiate) => {
        if (groupPeerConnectionsRef.current[otherId]) return
        const pc = new RTCPeerConnection(ICE_SERVERS)
        groupPeerConnectionsRef.current[otherId] = pc

        stream.getTracks().forEach(track => pc.addTrack(track, stream))

        pc.ontrack = (event) => {
          setGroupParticipants(prev => {
            const existing = prev.find(p => p.userId === otherId)
            if (existing) return prev.map(p => p.userId === otherId ? { ...p, stream: event.streams[0] } : p)
            return [...prev, {
              userId: otherId,
              username: presenceInfo?.username || 'Fellow Believer',
              avatarUrl: presenceInfo?.avatarUrl || null,
              stream: event.streams[0],
              cameraOn: true
            }]
          })
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            channel.send({ type: 'broadcast', event: 'signal', payload: { from: user.id, to: otherId, kind: 'ice-candidate', candidate: event.candidate } })
          }
        }

        if (initiate) {
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          channel.send({ type: 'broadcast', event: 'signal', payload: { from: user.id, to: otherId, kind: 'offer', offer } })
        }
      }

      if (groupChannelRef.current) {
        await supabase.removeChannel(groupChannelRef.current)
        groupChannelRef.current = null
      }

      const channel = supabase.channel('group-call-' + circle.id, {
        config: { presence: { key: user.id } }
      })
      groupChannelRef.current = channel

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState()
          const otherIds = Object.keys(state).filter(id => id !== user.id)
          if (otherIds.length + 1 > MAX_GROUP_SIZE) return
          otherIds.forEach(otherId => {
            const presenceInfo = state[otherId][0]
            connectToPeer(channel, otherId, presenceInfo, user.id < otherId)
          })
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
          if (groupPeerConnectionsRef.current[key]) {
            groupPeerConnectionsRef.current[key].close()
            delete groupPeerConnectionsRef.current[key]
          }
          setGroupParticipants(prev => prev.filter(p => p.userId !== key))
        })
        .on('broadcast', { event: 'signal' }, async ({ payload }) => {
          if (payload.to !== user.id) return
          const { from, kind } = payload
          let pc = groupPeerConnectionsRef.current[from]
          if (!pc) {
            const state = channel.presenceState()
            const presenceInfo = state[from]?.[0]
            await connectToPeer(channel, from, presenceInfo, false)
            pc = groupPeerConnectionsRef.current[from]
          }
          if (kind === 'offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.offer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            channel.send({ type: 'broadcast', event: 'signal', payload: { from: user.id, to: from, kind: 'answer', answer } })
          } else if (kind === 'answer') {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.answer))
          } else if (kind === 'ice-candidate') {
            try { await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)) } catch (e) {}
          }
        })
        .on('broadcast', { event: 'camera-state' }, ({ payload }) => {
          setGroupParticipants(prev => prev.map(p => p.userId === payload.from ? { ...p, cameraOn: payload.cameraOn } : p))
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ username, avatarUrl, online_at: new Date().toISOString() })
          }
        })
    } catch (err) {
      alert('Could not access camera/microphone: ' + err.message)
      setActiveGroupCall(null)
    } finally {
      groupJoiningRef.current = false
    }
  }

  const leaveGroupCall = () => {
    Object.values(groupPeerConnectionsRef.current).forEach(pc => pc.close())
    groupPeerConnectionsRef.current = {}
    if (groupLocalStreamRef.current) {
      groupLocalStreamRef.current.getTracks().forEach(t => t.stop())
      groupLocalStreamRef.current = null
    }
    if (groupChannelRef.current) {
      supabase.removeChannel(groupChannelRef.current)
      groupChannelRef.current = null
    }
    setActiveGroupCall(null)
    setGroupParticipants([])
    setGroupLocalStream(null)
    setGroupMicOn(true)
    setGroupCameraOn(true)
  }

  const toggleGroupMic = () => {
    if (!groupLocalStreamRef.current) return
    const audioTrack = groupLocalStreamRef.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setGroupMicOn(audioTrack.enabled)
    }
  }

  const toggleGroupCamera = () => {
    if (!groupLocalStreamRef.current) return
    const videoTrack = groupLocalStreamRef.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setGroupCameraOn(videoTrack.enabled)
      if (groupChannelRef.current) {
        groupChannelRef.current.send({ type: 'broadcast', event: 'camera-state', payload: { from: user.id, cameraOn: videoTrack.enabled } })
      }
    }
  }

  const bgStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a6bbd 0%, #4a9fd4 70%, #e0f4ff 100%)',
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

  let screenContent = null

  if (user && checkingUsername) {
    screenContent = (
      <div style={bgStyle}>
        {clouds}
        <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>Loading...</p>
      </div>
    )
  } else if (user && !username) {
    screenContent = <UsernameSetup user={user} onComplete={(name, avatar) => { setUsername(name); setAvatarUrl(avatar) }} />
  } else if (screen === 'prayer') {
    screenContent = <Prayer setScreen={navigateTo} user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} unreadCount={unreadCount} onOpenInbox={() => openInbox()} />
  } else if (screen === 'scripture') {
    screenContent = <Scripture setScreen={navigateTo} user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} unreadCount={unreadCount} onOpenInbox={() => openInbox()} scriptureDay={scriptureDay} setScriptureDay={setScriptureDay} scriptureDayLoaded={scriptureDayLoaded} setScriptureDayLoaded={setScriptureDayLoaded} />
  } else if (screen === 'fellowship') {
    screenContent = <Fellowship setScreen={navigateTo} user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} onStartCall={startCall} onStartGroupCall={startOrJoinGroupCall} gatheringCoords={gatheringCoords} setGatheringCoords={setGatheringCoords} gatheringLocationMode={gatheringLocationMode} setGatheringLocationMode={setGatheringLocationMode} gatheringZipCode={gatheringZipCode} setGatheringZipCode={setGatheringZipCode} gatheringCustomAddress={gatheringCustomAddress} setGatheringCustomAddress={setGatheringCustomAddress} gatheringSelectedPlace={gatheringSelectedPlace} setGatheringSelectedPlace={setGatheringSelectedPlace} gatheringSelectedTimeSlot={gatheringSelectedTimeSlot} setGatheringSelectedTimeSlot={setGatheringSelectedTimeSlot} gatheringNearbyGroups={gatheringNearbyGroups} setGatheringNearbyGroups={setGatheringNearbyGroups} gatheringStatus={gatheringStatus} setGatheringStatus={setGatheringStatus} gatheringPlaces={gatheringPlaces} setGatheringPlaces={setGatheringPlaces} gatheringActiveType={gatheringActiveType} setGatheringActiveType={setGatheringActiveType} gatheringSearchRadius={gatheringSearchRadius} setGatheringSearchRadius={setGatheringSearchRadius} onlineUsers={onlineUsers} onOpenInbox={openInbox} unreadCount={unreadCount} onPlayTetris={() => { setTetrisOpened(true); setShowTetris(true); }} />
    
  } else if (screen === 'evangelism') {
    screenContent = <ComingSoon title="Evangelism Tracker" emoji="🌍" setScreen={navigateTo} user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} unreadCount={unreadCount} onOpenInbox={() => openInbox()} />
  } else if (screen === 'vice') {
    screenContent = <ComingSoon title="Vice Manager" emoji="⚔️" setScreen={navigateTo} user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} unreadCount={unreadCount} onOpenInbox={() => openInbox()} />
  } else if (screen === 'home') {
    screenContent = (
      <div style={bgStyle}>
        {clouds}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <UserInboxBadge user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} unreadCount={unreadCount} onOpenInbox={() => openInbox()} compact barMode />
        </div>
        <div style={{
          position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px', color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            HisJoyMyStrength
          </h1>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', letterSpacing: '0.5px', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            Welcome, @{username}
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
  } else {
    screenContent = (
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

  return (
    <>
      {tetrisOpened && (
        <div style={{ ...bgStyle, display: showTetris ? 'flex' : 'none' }}>
          {clouds}
          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <UserInboxBadge user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} unreadCount={unreadCount} onOpenInbox={() => openInbox()} compact barMode />
          </div>
          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
            {[
              ['🏠 Home', 'home'],
              ['🙏 Video Prayer & Bible Study', 'prayer_circle'],
              ['🤝 Accountability Matches', 'accountability'],
              ['✝️ Local Gathering Times', 'gathering'],
              ['🌍 Global Church', 'global'],
            ].map(([lbl, v]) => (
              <button key={v} onClick={() => { localStorage.setItem('fellowshipView', v); setShowTetris(false); }} style={{
                background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
                borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'Georgia, serif'
              }}>{lbl}</button>
            ))}
          </div>
          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px' }}>
            <BibleTetris isVisible={showTetris} onBack={() => setShowTetris(false)} />
          </div>
        </div>
      )}
      {!showTetris && screenContent}

      {/* 5-MINUTE REMINDER POPUP */}
      {upcomingReminder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }}>
          <div style={{ background: '#0d2a4a', borderRadius: '20px', padding: '28px', textAlign: 'center', maxWidth: '300px', border: '2px solid #ffd700', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>⏰</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffd700', marginBottom: '4px' }}>Starting in 5 minutes</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>{PURPOSE_LABELS[upcomingReminder.purpose]} with</p>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>@{upcomingReminder.matchUser.username}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>{upcomingReminder.timeSlot}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setUpcomingReminder(null)} style={{
                flex: 1, padding: '10px', borderRadius: '50px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px'
              }}>Dismiss</button>
              <button onClick={() => { startCall(upcomingReminder.matchUser, upcomingReminder.purpose); setUpcomingReminder(null) }} style={{
                flex: 1, padding: '10px', borderRadius: '50px',
                background: '#7aff7a', border: 'none',
                color: '#0d2a4a', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px'
              }}>📞 Call Now</button>
            </div>
          </div>
        </div>
      )}
{/* INBOX PANEL */}
      {showInbox && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0d2a4a', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,215,0,0.3)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffd700', margin: 0 }}>
                {inboxView === 'list' ? '📬 Inbox' : (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span>💬 @{selectedConversation?.username}</span>
    <div style={{
      width: '8px', height: '8px', borderRadius: '50%',
      background: onlineUsers?.[selectedConversation?.userId] ? '#7aff7a' : '#888888'
    }} />
  </div>
)}
              </p>
              <button onClick={() => { setShowInbox(false); setInboxView('list'); setSelectedConversation(null) }} style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer'
              }}>✕</button>
            </div>
            {inboxView === 'list' && (
              <InboxList user={user} onSelectConversation={(conv) => { setSelectedConversation(conv); setInboxView('conversation') }} onUnreadChange={setUnreadCount} />
            )}
            {inboxView === 'conversation' && selectedConversation && (
              <ConversationView user={user} conversation={selectedConversation} onBack={() => setInboxView('list')} onlineUsers={onlineUsers} />
            )}
          </div>
        </div>
      )}
      {/* INCOMING 1-ON-1 CALL POPUP */}
      {incomingCall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#0d2a4a', borderRadius: '20px', padding: '32px', textAlign: 'center', maxWidth: '300px', border: '2px solid #ffd700', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <AvatarDisplay url={incomingCall.callerAvatar} size={80} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '4px' }}>
              <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>@{incomingCall.callerUsername}</p>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7aff7a', flexShrink: 0 }} />
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>{PURPOSE_LABELS[incomingCall.call_type]} — Incoming Call</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={declineCall} style={{ flex: 1, padding: '12px', borderRadius: '50px', background: 'rgba(220,50,50,0.3)', border: '2px solid #ff5555', color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Decline</button>
              <button onClick={acceptCall} style={{ flex: 1, padding: '12px', borderRadius: '50px', background: '#7aff7a', border: 'none', color: '#0d2a4a', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Accept</button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE 1-ON-1 CALL SCREEN */}
      {activeCall && (
        <div style={{ position: 'fixed', inset: 0, background: '#0a1929', zIndex: 9000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d2a4a' }}>
              <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: (callStatus === 'connected' && remoteCameraOn) ? 'block' : 'none' }} />
              {!(callStatus === 'connected' && remoteCameraOn) && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <AvatarDisplay url={activeCall.otherAvatar} size={120} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', fontFamily: 'Georgia, serif', margin: 0 }}>@{activeCall.otherUsername}</p>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: onlineUsers?.[activeCall.isCaller ? activeCall.callee_id : activeCall.caller_id] ? '#7aff7a' : '#888888', flexShrink: 0 }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '8px', fontFamily: 'Georgia, serif' }}>
                    {callStatus === 'calling' ? 'Calling...' : callStatus === 'connecting' ? 'Connecting...' : 'Camera off'}
                  </p>
                </div>
              )}
            </div>

            <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '100px', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,215,0,0.6)', background: '#0d2a4a' }}>
              <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraOn ? 'block' : 'none' }} />
              {!cameraOn && (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}>
                  <AvatarDisplay url={avatarUrl} size={50} />
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', gap: '20px', background: 'rgba(0,0,0,0.3)' }}>
            <button onClick={toggleMic} style={{ width: '56px', height: '56px', borderRadius: '50%', background: micOn ? 'rgba(255,255,255,0.15)' : '#ff5555', border: 'none', fontSize: '22px', cursor: 'pointer' }}>{micOn ? '🎤' : '🔇'}</button>
            <button onClick={toggleCamera} style={{ width: '56px', height: '56px', borderRadius: '50%', background: cameraOn ? 'rgba(255,255,255,0.15)' : '#ff5555', border: 'none', fontSize: '22px', cursor: 'pointer' }}>{cameraOn ? '📹' : '🚫'}</button>
            <button onClick={() => endCall(true)} style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ff3333', border: 'none', fontSize: '22px', cursor: 'pointer' }}>📞</button>
          </div>
        </div>
      )}

      {/* ACTIVE GROUP CALL SCREEN (Prayer Circles, up to 5) */}
      {activeGroupCall && (
        <div style={{ position: 'fixed', inset: 0, background: '#0a1929', zIndex: 9500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#ffd700', fontWeight: '700', fontFamily: 'Georgia, serif', margin: 0 }}>🙏 {activeGroupCall.circleName}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>{groupParticipants.length + 1} / {MAX_GROUP_SIZE}</p>
          </div>

          <div style={{ flex: 1, padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 320px))', gap: '10px', alignContent: 'center', justifyContent: 'center', overflowY: 'auto' }}>
            {/* My own tile */}
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0d2a4a', border: '2px solid rgba(255,215,0,0.6)', aspectRatio: '1' }}>
              <video
                autoPlay playsInline muted
                ref={el => { if (el && groupLocalStream) el.srcObject = groupLocalStream }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: groupCameraOn ? 'block' : 'none' }}
              />
              {!groupCameraOn && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AvatarDisplay url={avatarUrl} size={60} />
                </div>
              )}
              <p style={{ position: 'absolute', bottom: '4px', left: '8px', color: '#ffd700', fontSize: '11px', fontWeight: '700', margin: 0, fontFamily: 'Georgia, serif' }}>You</p>
            </div>

            {/* Other participants */}
            {groupParticipants.map(p => (
              <div key={p.userId} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0d2a4a', border: '1px solid rgba(255,255,255,0.2)', aspectRatio: '1' }}>
                <video
                  autoPlay playsInline
                  ref={el => { if (el && p.stream) el.srcObject = p.stream }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: p.cameraOn ? 'block' : 'none' }}
                />
                {!p.cameraOn && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AvatarDisplay url={p.avatarUrl} size={60} />
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '4px', left: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: onlineUsers?.[p.userId] ? '#7aff7a' : '#888888' }} />
                  <p style={{ color: '#ffffff', fontSize: '11px', fontWeight: '700', margin: 0, fontFamily: 'Georgia, serif' }}>@{p.username}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '20px', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
            <button onClick={toggleGroupMic} style={{ width: '56px', height: '56px', borderRadius: '50%', background: groupMicOn ? 'rgba(255,255,255,0.15)' : '#ff5555', border: 'none', fontSize: '22px', cursor: 'pointer' }}>{groupMicOn ? '🎤' : '🔇'}</button>
            <button onClick={toggleGroupCamera} style={{ width: '56px', height: '56px', borderRadius: '50%', background: groupCameraOn ? 'rgba(255,255,255,0.15)' : '#ff5555', border: 'none', fontSize: '22px', cursor: 'pointer' }}>{groupCameraOn ? '📹' : '🚫'}</button>
            <button onClick={leaveGroupCall} style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ff3333', border: 'none', fontSize: '22px', cursor: 'pointer' }}>📞</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App