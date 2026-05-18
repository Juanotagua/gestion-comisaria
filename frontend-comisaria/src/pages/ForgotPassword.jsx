import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ForgotPassword() {

  const [correo, setCorreo] =
    useState('')

    const navigate = useNavigate()

  const [mensaje, setMensaje] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const enviarCorreo = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const response = await axios.post(
`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { correo }
      )

      setMensaje(response.data.mensaje)

    } catch (error) {

      setMensaje(
        error.response?.data?.error ||
        'Error enviando correo'
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div style={container}>

      <form
        style={card}
        onSubmit={enviarCorreo}
      >

        <h1 style={titulo}>
          Recuperar contraseña
        </h1>

        <p style={subtitulo}>
          Ingresa tu correo institucional
        </p>

        <input
          type="email"
          placeholder="correo@gmail.com"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
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
              ? 'Enviando...'
              : 'Enviar enlace'
          }

        </button>

        {mensaje && (

          <p style={mensajeStyle}>
            {mensaje}
          </p>
          

        )}
        <p
  style={volver}
  onClick={() =>
    navigate('/')
  }
>

  ← Volver al inicio

</p>

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
const volver = {
  marginTop: '20px',
  textAlign: 'center',
  color: '#8B1E2D',
  fontWeight: '600',
  cursor: 'pointer'
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
  marginBottom: '20px',
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
  color: '#0F172A',
  textAlign: 'center'
}

export default ForgotPassword