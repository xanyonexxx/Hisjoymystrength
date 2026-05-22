import './App.css'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      color: 'white',
      textAlign: 'center',
      padding: '24px'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: '300',
        letterSpacing: '2px',
        marginBottom: '8px',
        color: '#d4af37'
      }}>
        HisJoyMyStrength
      </h1>
      <p style={{
        fontSize: '14px',
        color: '#888',
        letterSpacing: '1px',
        marginBottom: '48px'
      }}>
        "The joy of the Lord is my strength" — Nehemiah 8:10
      </p>
      <button style={{
        background: '#d4af37',
        color: '#0a0a0a',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '100px',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '1px',
        cursor: 'pointer'
      }}>
        Get Started
      </button>
    </div>
  )
}

export default App