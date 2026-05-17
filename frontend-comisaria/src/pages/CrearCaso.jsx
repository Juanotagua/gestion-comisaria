import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'

function CrearCaso() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [form, setForm] = useState({
    numero: '',
    id_tipo_proceso: '',
    id_estado: '',
    id_prioridad: '',
    descripcion_hechos: ''
  })

  const [tipos, setTipos] = useState([])
  const [estados, setEstados] = useState([])
  const [prioridades, setPrioridades] = useState([])

  const [loading, setLoading] = useState(false)

  // 🔥 TOAST
  const [toast, setToast] = useState('')
  const [toastType, setToastType] =
    useState('success')

  /* =========================
     CARGAR CATÁLOGOS
  ========================= */

  useEffect(() => {

    const cargarCatalogos = async () => {

      try {

        const tiposRes = await axios.get(
          'http://localhost:3000/api/catalogos/tipos-proceso'
        )

        const estadosRes = await axios.get(
          'http://localhost:3000/api/catalogos/estados'
        )

        const prioridadesRes = await axios.get(
          'http://localhost:3000/api/catalogos/prioridades'
        )

        setTipos(tiposRes.data)
        setEstados(estadosRes.data)
        setPrioridades(prioridadesRes.data)

      } catch (error) {

        console.error(error)

        mostrarToast(
          'Error cargando catálogos',
          'error'
        )

      }

    }

    cargarCatalogos()

  }, [])

  /* =========================
     TOAST
  ========================= */

  const mostrarToast = (
    mensaje,
    tipo = 'success'
  ) => {

    setToast(mensaje)
    setToastType(tipo)

    setTimeout(() => {
      setToast('')
    }, 3000)

  }

  /* =========================
     INPUTS
  ========================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (
      !form.numero ||
      !form.id_tipo_proceso ||
      !form.id_estado ||
      !form.id_prioridad ||
      !form.descripcion_hechos
    ) {

      mostrarToast(
        'Todos los campos son obligatorios',
        'error'
      )

      return

    }

    try {

      setLoading(true)

      await axios.post(
        'http://localhost:3000/api/casos',
        {
          numero_radicado: form.numero,

          id_tipo_proceso:
            Number(form.id_tipo_proceso),

          id_estado:
            Number(form.id_estado),

          id_prioridad:
            Number(form.id_prioridad),

          descripcion_hechos:
            form.descripcion_hechos,

          fecha_apertura:
            new Date(),

          id_usuario_creador:
            usuario.id_usuario
        }
      )

      mostrarToast(
        'Caso creado correctamente',
        'success'
      )

      setTimeout(() => {
        navigate('/casos')
      }, 1200)

    } catch (error) {

      console.error(error)

      mostrarToast(
        error.response?.data?.error ||
        'Error creando caso',
        'error'
      )

    } finally {

      setLoading(false)

    }

  }

  const year =
    new Date().getFullYear()

  return (

    <div style={container}>

      {/* TOAST */}
      <Toast
        message={toast}
        type={toastType}
      />

      <div style={card}>

        {/* HEADER */}
        <div style={header}>

          <h1 style={title}>
            Crear Caso
          </h1>

          <p style={subtitle}>
            Registro y apertura de nuevos casos
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={formStyle}
        >

          {/* NÚMERO */}
          <div style={fieldContainer}>

            <label style={label}>
              Número del caso
            </label>

            <input
              type="number"
              name="numero"
              placeholder="Ingrese el número"
              value={form.numero}
              onChange={handleChange}
              style={input}
            />

            {/* PREVIEW */}
            <div style={preview}>

              <span style={previewLabel}>
                Radicado generado:
              </span>

              <span style={previewValue}>
                RAD-{form.numero || '0000'}-{year}
              </span>

            </div>

          </div>

          {/* GRID */}
          <div style={grid}>

            {/* TIPO */}
            <div style={fieldContainer}>

              <label style={label}>
                Tipo de proceso
              </label>

              <select
                name="id_tipo_proceso"
                value={form.id_tipo_proceso}
                onChange={handleChange}
                style={selectModern}
              >
                <option value="">
                  Seleccione
                </option>

                {tipos.map((t) => (
                  <option
                    key={t.id_tipo_proceso}
                    value={t.id_tipo_proceso}
                  >
                    {t.nombre_proceso}
                  </option>
                ))}

              </select>

            </div>

            {/* ESTADO */}
            <div style={fieldContainer}>

              <label style={label}>
                Estado
              </label>

              <select
                name="id_estado"
                value={form.id_estado}
                onChange={handleChange}
                style={selectModern}
              >
                <option value="">
                  Seleccione
                </option>

                {estados.map((e) => (
                  <option
                    key={e.id_estado}
                    value={e.id_estado}
                  >
                    {e.nombre_estado}
                  </option>
                ))}

              </select>

            </div>

            {/* PRIORIDAD */}
            <div style={fieldContainer}>

              <label style={label}>
                Prioridad
              </label>

              <select
                name="id_prioridad"
                value={form.id_prioridad}
                onChange={handleChange}
                style={selectModern}
              >
                <option value="">
                  Seleccione
                </option>

                {prioridades.map((p) => (
                  <option
                    key={p.id_prioridad}
                    value={p.id_prioridad}
                  >
                    {p.nombre_prioridad}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* DESCRIPCIÓN */}
          <div style={fieldContainer}>

            <label style={label}>
              Descripción de los hechos
            </label>

            <textarea
              name="descripcion_hechos"
              placeholder="Ingrese la descripción del caso"
              value={form.descripcion_hechos}
              onChange={handleChange}
              style={textarea}
            />

          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...button,
              opacity: loading ? 0.7 : 1
            }}
          >

            {
              loading
                ? 'Guardando...'
                : 'Guardar caso'
            }

          </button>

        </form>

      </div>

    </div>

  )

}

/* =========================
   ESTILOS
========================= */

const container = {
  width: '100%'
}

const card = {
  width: '100%',
  background: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #E2E8F0',
  padding: '35px',
  boxSizing: 'border-box',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
}

const header = {
  marginBottom: '35px'
}

const title = {
  margin: 0,
  fontSize: '34px',
  color: '#0F172A'
}

const subtitle = {
  marginTop: '10px',
  color: '#64748B'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
}

const grid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px'
}

const fieldContainer = {
  display: 'flex',
  flexDirection: 'column'
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
  fontSize: '15px'
}

const selectModern = {
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  fontSize: '15px',
  background: '#FFFFFF'
}

const textarea = {
  minHeight: '140px',
  padding: '16px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  resize: 'vertical',
  fontSize: '15px',
  lineHeight: '1.6'
}

const preview = {
  marginTop: '12px',
  background: '#EFF6FF',
  border: '1px solid #BFDBFE',
  padding: '14px',
  borderRadius: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
}

const previewLabel = {
  color: '#64748B',
  fontSize: '13px'
}

const previewValue = {
  color: '#1D4ED8',
  fontWeight: '700',
  fontSize: '15px'
}

const button = {
  marginTop: '10px',
  padding: '15px',
  borderRadius: '16px',
  border: 'none',
  background: '#2563EB',
  color: 'white',
  fontWeight: '600',
  fontSize: '15px',
  cursor: 'pointer'
}

export default CrearCaso