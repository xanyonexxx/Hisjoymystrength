function GoldCross({ onNavigate }) {
  return (
    <div style={{ position: 'relative', width: '380px', height: '500px' }}>
      <img
        src="/cross navigation photopea.png"
        alt="Cross"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />

      {/* Scripture Reading - Top arm */}
      <button
        onClick={() => onNavigate('scripture')}
        style={{
          position: 'absolute',
          top: '3%',
          left: '33%',
          width: '34%',
          height: '20%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
        title="Scripture Reading"
      />

      {/* Fellowship - Left arm */}
      <button
        onClick={() => onNavigate('fellowship')}
        style={{
          position: 'absolute',
          top: '35%',
          left: '1%',
          width: '30%',
          height: '20%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
        title="Fellowship"
      />

      {/* Prayer Tracker - Center */}
      <button
        onClick={() => onNavigate('prayer')}
        style={{
          position: 'absolute',
          top: '35%',
          left: '33%',
          width: '34%',
          height: '20%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
        title="Prayer Tracker"
      />

      {/* Evangelism Tracker - Right arm */}
      <button
        onClick={() => onNavigate('evangelism')}
        style={{
          position: 'absolute',
          top: '35%',
          right: '0%',
          width: '32%',
          height: '22%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10
        }}
        title="Evangelism Tracker"
      />

      {/* Vice Manager - Bottom arm */}
      <button
        onClick={() => onNavigate('vice')}
        style={{
          position: 'absolute',
          bottom: '4%',
          left: '33%',
          width: '34%',
          height: '20%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
        title="Vice Manager"
      />
    </div>
  )
}

export default GoldCross