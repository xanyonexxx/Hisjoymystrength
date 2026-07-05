import AvatarUsernameBadge from './AvatarUsernameBadge'

export default function UserInboxBadge({ user, username, avatarUrl, onAvatarChange, unreadCount, onOpenInbox, compact = false, barMode = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? '6px' : '8px' }}>
      <button onClick={onOpenInbox} style={{
        background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: '20px',
        padding: compact ? '4px 8px' : '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
      }}>
        <span style={{ fontSize: compact ? '12px' : '14px' }}>📬</span>
        {!compact && <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffd700', fontFamily: 'Georgia, serif' }}>Inbox</span>}
        {unreadCount > 0 && (
          <span style={{ background: '#ff4444', color: '#ffffff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
        )}
      </button>
      <AvatarUsernameBadge user={user} username={username} avatarUrl={avatarUrl} onAvatarChange={onAvatarChange} barMode={barMode} />
    </div>
  )
}
