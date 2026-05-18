import { useState } from 'react'
import {
  useParams,
  useNavigate
} from 'react-router-dom'

import axios from 'axios'

function ResetPassword() {

  const { token } = useParams()

  const navigate = useNavigate()

  const [password, setPassword] =
    useState('')

  const [confirmar, setConfirmar] =
    useState('')

  const [mensaje, setMensaje] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const cambiarPassword = async (e) => {

    e.preventDefault()

    setError('')
    setMensaje('')

    // 🔥 VALIDACIÓN SEGURA

const regexSeguridad =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/

if (!regexSeguridad.test(password)) {

  setError(

    'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial'

  )

  return

}

    // 🔥 VALIDAR COINCIDENCIA
    if (password !== confirmar) {

      setError(
        'Las contraseñas no coinciden'
      )

      return

    }

    try {

      setLoading(true)

      const response = await axios.post(
`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
          password
        }
      )

      setMensaje(
        response.data.mensaje
      )

      setTimeout(() => {

        navigate('/')

      }, 2500)

    } catch (error) {

      setError(

        error.response?.data?.error ||

        'Error cambiando contraseña'

      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div style={container}>

      <form
        style={card}
        onSubmit={cambiarPassword}
      >

        <h1 style={titulo}>
          Nueva contraseña
        </h1>

        <p style={subtitulo}>
          Ingresa y confirma tu nueva contraseña
        </p>

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={input}
          required
        />

        {/* CONFIRMAR */}

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e) =>
            setConfirmar(e.target.value)
          }
          style={input}
          required
        />

        <button
          type="submit"
          style={button}
        >

          {
            loading
              ? 'Guardando...'
              : 'Cambiar contraseña'
          }

        </button>

        {/* ERROR */}

        {error && (

          <p style={errorStyle}>
            {error}
          </p>

        )}

        {/* MENSAJE */}

        {mensaje && (

          <p style={mensajeStyle}>
            {mensaje}
          </p>

        )}

      </form>

    </div>

  )

}

/* ESTILOS */

const container = {

  minHeight: '100vh',

  display: 'flex',

  justifyContent: 'center',

  alignItems: 'center',

  background: '#F1F5F9'

}

const card = {

  background: '#FFFFFF',

  padding: '40px',

  borderRadius: '24px',

  width: '100%',

  maxWidth: '420px',

  boxShadow:
    '0 20px 50px rgba(15,23,42,0.08)'

}

const titulo = {

  margin: 0,

  color: '#0F172A'

}

const subtitulo = {

  color: '#64748B',

  marginBottom: '25px'

}

const input = {

  width: '100%',

  padding: '14px',

  borderRadius: '14px',

  border: '1px solid #CBD5E1',

  marginBottom: '18px',

  boxSizing: 'border-box'

}

const button = {

  width: '100%',

  padding: '14px',

  border: 'none',

  borderRadius: '14px',

  background: '#8B1E2D',

  color: '#FFFFFF',

  fontWeight: '700',

  cursor: 'pointer'

}

const mensajeStyle = {

  marginTop: '18px',

  color: '#166534',

  textAlign: 'center',

  fontWeight: '600'

}

const errorStyle = {

  marginTop: '18px',

  color: '#DC2626',

  textAlign: 'center',

  fontWeight: '600'

}

export default ResetPassword