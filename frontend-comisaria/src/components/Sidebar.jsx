import { useNavigate } from 'react-router-dom'

function Sidebar() {

  const navigate = useNavigate()

  return (
    <div style={sidebar}>

      <h2 style={logo}>Comisaría</h2>

      <div style={menu}>

        <div style={item} onClick={() => navigate('/dashboard')}>
          📊 Dashboard
        </div>

        <div style={item} onClick={() => navigate('/casos')}>
          📂 Casos
        </div>

        <div style={item} onClick={() => navigate('/usuarios')}>
          👥 Usuarios
        </div>

        <div style={item} onClick={() => navigate('/crear-caso')}>
          ➕ Crear Caso
        </div>

        <div style={item} onClick={() => navigate('/reportes')}>
          📈 Estadísticas
        </div>

      </div>

    </div>
  )
}

// 🎨 estilos
const sidebar = {
  width: '220px',
  background: '#0f172a',
  color: 'white',
  padding: '20px',
  height: '100vh'
}

const logo = {
  marginBottom: '30px'
}

const menu = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}

const item = {
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '6px',
  transition: '0.2s'
}

export default Sidebar