import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {

  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      label: 'Casos',
      route: '/casos'
    },
    {
      label: 'Usuarios',
      route: '/usuarios'
    },
    {
      label: 'Crear Caso',
      route: '/crear-caso'
    }
  ]

  return (

    <div style={sidebar}>

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div style={logoContainer}>

          <div style={logoCircle} />

          <div>

            <h1
              style={logo}
              onClick={() => navigate('/dashboard')}
            >
              Comisaría
            </h1>

            <p style={subtitle}>
              Sistema de Gestión
            </p>

          </div>

        </div>

        {/* MENU */}
        <div style={menu}>

          {menuItems.map((item) => {

            const activo =
              location.pathname === item.route

            return (

              <div
                key={item.route}

                onClick={() => navigate(item.route)}

                style={{
                  ...menuItem,
                  ...(activo ? activeItem : {})
                }}

                onMouseEnter={(e) => {

                  if (!activo) {
                    e.currentTarget.style.background =
                      '#1E293B'
                  }

                }}

                onMouseLeave={(e) => {

                  if (!activo) {
                    e.currentTarget.style.background =
                      'transparent'
                  }

                }}
              >

                <span>
                  {item.label}
                </span>

              </div>

            )

          })}

        </div>

      </div>

      {/* FOOTER */}
      <div style={footer}>

        <div style={footerLine} />

        <button
          style={logoutButton}

          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              '#334155'
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              '#1E293B'
          }}

          onClick={() => {
            localStorage.clear()
            window.location.href = '/'
          }}
        >
          Cerrar sesión
        </button>

      </div>

    </div>

  )

}

/* ESTILOS */

const sidebar = {
  width: '270px',
  background: '#0F172A',
  color: 'white',
  height: '100vh',
  padding: '28px 20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  borderRight: '1px solid rgba(255,255,255,0.06)'
}

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '45px'
}

const logoCircle = {
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  background: '#8B1E2D',
  boxShadow: '0 0 12px rgba(139,30,45,0.45)'
}

const logo = {
  margin: 0,
  fontSize: '28px',
  fontWeight: '700',
  color: '#FFFFFF',
  cursor: 'pointer',
  letterSpacing: '0.3px'
}

const subtitle = {
  marginTop: '6px',
  color: '#94A3B8',
  fontSize: '14px'
}

const menu = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
}

const menuItem = {
  padding: '14px 16px',
  borderRadius: '14px',
  cursor: 'pointer',
  transition: '0.2s ease',
  fontSize: '15px',
  fontWeight: '500',
  color: '#E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

const activeItem = {
  background: '#8B1E2D',
  color: '#FFFFFF',
  boxShadow: '0 8px 20px rgba(139,30,45,0.28)'
}

const footer = {
  marginTop: 'auto'
}

const footerLine = {
  width: '100%',
  height: '1px',
  background: 'rgba(255,255,255,0.08)',
  marginBottom: '20px'
}

const logoutButton = {
  width: '100%',
  padding: '14px',
  border: 'none',
  borderRadius: '14px',
  background: '#1E293B',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: '0.2s ease'
}

export default Sidebar