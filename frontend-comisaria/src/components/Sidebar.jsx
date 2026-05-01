import { useNavigate } from 'react-router-dom'

function Sidebar() {

  const navigate = useNavigate()

  return (
    <div style={sidebar}>

      {/* 🔥 LOGO CLICKABLE */}
      <h2 
        style={{ ...logo, cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        Comisaría
      </h2>

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

      </div>

      {/* 🔥 LOGOUT ABAJO */}
      <div style={logoutContainer}>
        <div 
          style={logout}
          onClick={() => {
            localStorage.clear()
            window.location.href = '/'
          }}
        >
          🚪 Cerrar sesión
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
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
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
  transition: '0.2s',
  background: 'transparent'
}

const logoutContainer = {
  marginTop: 'auto'
}

const logout = {
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '6px',
  background: '#1e293b'
}

export default Sidebar