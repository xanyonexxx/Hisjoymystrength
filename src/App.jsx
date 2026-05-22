import './App.css'

function App() {
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
      <div style={{ position: 'absolute', top: '18%', right: '10%', width: '180px', height: '50px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', bottom: '25%', left: '5%', width: '220px', height: '60px', background: 'rgba(255,255,255,0.5)', borderRadius: '50px', filter: 'blur(7px)' }} />
      <div style={{ position: 'absolute', bottom: '30%', right: '0%', width: '280px', height: '75px', background: 'rgba(255,255,255,0.6)', borderRadius: '50px', filter: 'blur(8px)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{
          fontSize: '38px',
          fontWeight: '400',
          letterSpacing: '2px',
          marginBottom: '12px',
          color: '#ffffff',
          textShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}>
          HisJoyMyStrength
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '1px',
          marginBottom: '48px',
          textShadow: '0 1px 6px rgba(0,0,0,0.2)'
        }}>
          "The joy of the Lord is my strength" — Nehemiah 8:10
        </p>
        <button style={{
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '2px solid rgba(255,255,255,0.6)',
          padding: '14px 36px',
          borderRadius: '100px',
          fontSize: '15px',
          fontWeight: '600',
          letterSpacing: '1px',
          cursor: 'pointer',
          textShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }}>
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
