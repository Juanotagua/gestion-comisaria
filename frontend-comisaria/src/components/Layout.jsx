import Sidebar from './Sidebar'

function Layout({ children }) {

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const isMobile =
    window.innerWidth <= 768

  return (

    <div style={container}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div style={{
        ...content,
        marginLeft: isMobile
          ? '0px'
          : '270px'
      }}>

        {/* HEADER */}
        <header style={header}>

          {/* LEFT */}
          <div>

            <h2 style={title}>
              Sistema de Gestión de Casos
            </h2>

            <p style={subtitle}>
              Plataforma institucional · Comisaría de Familia
            </p>

          </div>

          {/* RIGHT */}
          <div
            style={userBox}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                'translateY(-2px)'

              e.currentTarget.style.boxShadow =
                '0 12px 28px rgba(15,23,42,0.10)'

              e.currentTarget.style.border =
                '1px solid rgba(59,130,246,0.15)'

            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                'translateY(0px)'

              e.currentTarget.style.boxShadow =
                'none'

              e.currentTarget.style.border =
                '1px solid #E2E8F0'

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

/* =========================
   ESTILOS
========================= */

const container = {
  display: 'flex',
  minHeight: '100vh',
  background:
    'linear-gradient(to bottom right, #F8FAFC, #EEF2FF)'
}

const content = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: '0.3s ease'
}

const header = {
  minHeight: '86px',

  background:
    'rgba(255,255,255,0.75)',

  backdropFilter: 'blur(16px)',

  borderBottom:
    '1px solid rgba(226,232,240,0.8)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  padding: '0 34px',

  position: 'sticky',
  top: 0,
  zIndex: 50,

  boxShadow:
    '0 2px 12px rgba(15,23,42,0.03)'
}

const title = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#0F172A',
  margin: 0,
  letterSpacing: '-0.6px'
}

const subtitle = {
  fontSize: '13px',
  color: '#64748B',
  marginTop: '8px',
  letterSpacing: '0.2px'
}

const userBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',

  background:
    'rgba(255,255,255,0.92)',

  padding: '12px 18px',

  borderRadius: '18px',

  border:
    '1px solid #E2E8F0',

  transition: '0.25s ease',

  cursor: 'default'
}

const avatar = {
  width: '50px',
  height: '50px',

  borderRadius: '50%',

  background:
    'linear-gradient(135deg, #0F172A, #334155)',

  color: 'white',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  fontWeight: '700',
  fontSize: '18px',

  boxShadow:
    '0 10px 24px rgba(15,23,42,0.20)'
}

const userName = {
  fontWeight: '700',
  color: '#0F172A',
  fontSize: '14px',
  letterSpacing: '0.2px'
}

const userRole = {
  fontSize: '12px',
  color: '#64748B',
  marginTop: '4px',
  textTransform: 'capitalize'
}

const main = {
  flex: 1,

  padding:
    window.innerWidth <= 768
      ? '20px'
      : '34px',

  overflowY: 'auto',

  transition: '0.3s ease'
}

export default Layout