import Sidebar from './Sidebar'

function Layout({ children }) {

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  return (

    <div style={container}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div style={content}>

        {/* HEADER */}
        <header style={header}>

          {/* LEFT */}
          <div>

            <h2 style={title}>
              Sistema de Gestión de Casos
            </h2>

            <p style={subtitle}>
              Comisaría de Familia
            </p>

          </div>

          {/* RIGHT */}
          <div
            style={userBox}

            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'translateY(-1px)'

              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(0,0,0,0.06)'
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'translateY(0px)'

              e.currentTarget.style.boxShadow =
                'none'
            }}
          >

            {/* AVATAR */}
            <div style={avatar}>
              {usuario?.nombre?.charAt(0)}
            </div>

            {/* INFO */}
            <div>

              <div style={userName}>
                {usuario?.nombre}
              </div>

              <div style={userRole}>
                {usuario?.nombre_rol}
              </div>

            </div>

          </div>

        </header>

        {/* MAIN */}
        <main style={main}>
          {children}
        </main>

      </div>

    </div>

  )

}

/* ESTILOS */

const container = {
  display: 'flex',
  minHeight: '100vh',
  background: '#F8FAFC'
}

const content = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}

const header = {
  minHeight: '82px',
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 34px',
  position: 'sticky',
  top: 0,
  zIndex: 50
}

const title = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0F172A',
  margin: 0,
  letterSpacing: '-0.3px'
}

const subtitle = {
  fontSize: '13px',
  color: '#64748B',
  marginTop: '6px'
}

const userBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  background: '#FFFFFF',
  padding: '10px 16px',
  borderRadius: '16px',
  border: '1px solid #E2E8F0',
  transition: '0.2s ease',
  cursor: 'default'
}

const avatar = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #0F172A, #1E293B)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '17px',
  boxShadow: '0 6px 14px rgba(15,23,42,0.18)'
}

const userName = {
  fontWeight: '600',
  color: '#0F172A',
  fontSize: '14px'
}

const userRole = {
  fontSize: '12px',
  color: '#64748B',
  marginTop: '3px',
  textTransform: 'capitalize'
}

const main = {
  flex: 1,
  padding: '34px',
  overflowY: 'auto'
}

export default Layout