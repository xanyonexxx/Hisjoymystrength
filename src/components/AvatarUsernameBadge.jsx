import { useState } from 'react'
import { supabase } from '../supabase'

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

export default function AvatarUsernameBadge({ user, username, avatarUrl, onAvatarChange, barMode = false }) {
  const [showAvatarPanel, setShowAvatarPanel] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)

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

  const closeAvatarPanel = () => {
    setShowAvatarPanel(false)
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarError('')
  }

  return (
    <div style={{ position: 'relative' }}>
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

      {showAvatarPanel && barMode && (
        <div style={{
          position: 'absolute', top: 0, right: 'calc(100% + 44px)', zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px',
          whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
          <button onClick={closeAvatarPanel} style={{
            padding: '5px 10px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
            fontWeight: '600', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '11px'
          }}>Close</button>
          {avatarFile ? (
            <button onClick={uploadAvatar} disabled={avatarUploading} style={{
              padding: '5px 10px', borderRadius: '14px', background: '#ffd700', color: '#0d2a4a',
              fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'Georgia, serif', fontSize: '11px'
            }}>{avatarUploading ? 'Saving...' : 'Save Photo'}</button>
          ) : (
            <label style={{
              padding: '5px 10px', borderRadius: '14px', background: 'rgba(255,215,0,0.2)',
              border: '1px solid rgba(255,215,0,0.5)', color: '#ffd700', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Georgia, serif', fontSize: '11px'
            }}>
              Choose Photo
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} style={{ display: 'none' }} />
            </label>
          )}
          <AvatarDisplay url={avatarPreview || avatarUrl} size={26} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffd700', fontFamily: 'Georgia, serif' }}>Update Photo</span>
          {avatarError && (
            <span style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', fontSize: '10px', color: '#ff7a7a', whiteSpace: 'nowrap' }}>{avatarError}</span>
          )}
        </div>
      )}

      {showAvatarPanel && !barMode && (
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
  )
}
