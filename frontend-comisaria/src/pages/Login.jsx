import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/api'
import Toast from '../components/Toast'

function Login() {

  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {

    e.preventDefault()

    // VALIDACIONES
    if (!correo || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(correo)) {
      setError('Ingrese un correo válido')
      return
    }

    try {

      const res = await login(correo, password)

      localStorage.setItem(
        'usuario',
        JSON.stringify(res.usuario)
      )

      navigate('/dashboard')

    } catch (err) {

      setError(
        err.message || 'Error al iniciar sesión'
      )

    }

  }

  return (

    <div style={container}>

      {/* PANEL IZQUIERDO */}
      <div style={leftPanel}>

        <div>

          <h1 style={logo}>
            Comisaría
          </h1>

          <p style={subtitle}>
            Sistema de Gestión de Casos
          </p>

        </div>

        <div style={leftContent}>

          <h2 style={title}>
            Plataforma institucional
          </h2>

          <p style={description}>
            Gestión centralizada de casos, seguimiento,
            trazabilidad y control administrativo para
            comisarías de familia.
          </p>

        </div>

      </div>

      {/* LOGIN */}
      <div style={rightPanel}>

        <form
          onSubmit={handleLogin}
          style={card}
        >

          <div style={{ marginBottom: '30px' }}>

            <h2 style={loginTitle}>
              Iniciar sesión
            </h2>

            <p style={loginSubtitle}>
              Ingrese sus credenciales para continuar
            </p>

          </div>

          {/* CORREO */}
          <div style={fieldContainer}>

            <label style={label}>
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@comisaria.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onFocus={() => setError('')}
              style={input}

              onFocusCapture={(e) => {
                e.currentTarget.style.border =
                  '1px solid #2563EB'

                e.currentTarget.style.boxShadow =
                  '0 0 0 4px rgba(37,99,235,0.12)'
              }}

              onBlur={(e) => {
                e.currentTarget.style.border =
                  '1px solid #CBD5E1'

                e.currentTarget.style.boxShadow =
                  'none'
              }}
            />

          </div>

          {/* PASSWORD */}
          <div style={fieldContainer}>

            <label style={label}>
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setError('')}
              style={input}

              onFocusCapture={(e) => {
                e.currentTarget.style.border =
                  '1px solid #2563EB'

                e.currentTarget.style.boxShadow =
                  '0 0 0 4px rgba(37,99,235,0.12)'
              }}

              onBlur={(e) => {
                e.currentTarget.style.border =
                  '1px solid #CBD5E1'

                e.currentTarget.style.boxShadow =
                  'none'
              }}
            />

          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={!correo || !password}
            style={{
              ...button,
              opacity:
                !correo || !password ? 0.6 : 1
            }}

            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                '#1D4ED8'

              e.currentTarget.style.transform =
                'translateY(-1px)'
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                '#2563EB'

              e.currentTarget.style.transform =
                'translateY(0px)'
            }}
          >
            Ingresar
          </button>
          <p
  style={{
    marginTop: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#8B1E2D',
    fontWeight: '600'
  }}

  onClick={() =>
    navigate('/forgot-password')
  }
>

  ¿Olvidaste tu contraseña?

</p>

          {/* ERROR */}
          {error && (

            <div style={errorBox}>
              {error}
            </div>

          )}

        </form>

      </div>

    </div>

  )

}

/* ESTILOS */

const container = {
  display: 'flex',
  height: '100vh',
  background: '#F8FAFC'
}

const leftPanel = {
  flex: 1,
  background: 'linear-gradient(135deg, #0F172A, #1E293B)',
  color: 'white',
  padding: '60px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}

const logo = {
  fontSize: '42px',
  margin: 0,
  fontWeight: '700'
}

const subtitle = {
  marginTop: '10px',
  color: '#CBD5E1'
}

const leftContent = {
  maxWidth: '480px'
}

const title = {
  fontSize: '42px',
  lineHeight: '1.2',
  marginBottom: '20px'
}

const description = {
  color: '#CBD5E1',
  lineHeight: '1.8',
  fontSize: '16px'
}

const rightPanel = {
  width: '520px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px'
}

const card = {
  width: '100%',
  background: '#FFFFFF',
  padding: '45px',
  borderRadius: '24px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
}

const loginTitle = {
  margin: 0,
  color: '#0F172A',
  fontSize: '32px'
}

const loginSubtitle = {
  marginTop: '10px',
  color: '#64748B'
}

const fieldContainer = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '22px'
}

const label = {
  marginBottom: '10px',
  color: '#334155',
  fontWeight: '600',
  fontSize: '14px'
}

const input = {
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  fontSize: '15px',
  transition: '0.2s ease',
  background: '#FFFFFF'
}

const button = {
  width: '100%',
  marginTop: '10px',
  padding: '14px',
  borderRadius: '14px',
  border: 'none',
  background: '#2563EB',
  color: 'white',
  fontWeight: '600',
  fontSize: '15px',
  cursor: 'pointer',
  transition: '0.2s ease'
}

const errorBox = {
  marginTop: '20px',
  background: '#FEF2F2',
  border: '1px solid #FECACA',
  color: '#DC2626',
  padding: '14px',
  borderRadius: '12px',
  textAlign: 'center',
  fontSize: '14px'
}

export default Login