import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: '#0f172a',
      color: 'white',
      padding: '20px'
    }}>

      <h2>Comisaría</h2>
      <hr />

      <p style={itemStyle} onClick={() => navigate('/dashboard')}>
        📊 Dashboard
      </p>

      <p style={itemStyle} onClick={() => navigate('/casos')}>
        📁 Casos
      </p>

      <p style={itemStyle}>
        👥 Usuarios
      </p>

      <p style={itemStyle}>
        📈 Reportes
      </p>

      <p style={itemStyle}>
        🔔 Notificaciones
      </p>

    </div>
  )
}

const itemStyle = {
  cursor: 'pointer',
  margin: '15px 0'
}

export default Sidebar