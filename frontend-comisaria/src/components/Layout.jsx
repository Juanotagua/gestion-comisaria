import Sidebar from './Sidebar'

function Layout({ children }) {

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  return (
    <div style={{ display: 'flex' }}>

      <Sidebar />

      <div style={{ flex: 1, background: '#f1f5f9', minHeight: '100vh' }}>

        {/* 🔥 HEADER */}
        <div style={header}>
          👤 {usuario?.nombre} ({usuario?.nombre_rol})
        </div>

        {/* 🔥 CONTENIDO */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>

      </div>

    </div>
  )
}

// 🎨 estilos
const header = {
  padding: '15px 20px',
  background: 'white',
  borderBottom: '1px solid #e2e8f0',
  fontWeight: 'bold'
}

export default Layout