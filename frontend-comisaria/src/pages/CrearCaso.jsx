import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CrearCaso() {

  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const [form, setForm] = useState({
    numero_radicado: '',
    id_tipo_proceso: '',
    id_estado: '',
    id_prioridad: '',
    descripcion_hechos: ''
  })

  const [tipos, setTipos] = useState([])
  const [estados, setEstados] = useState([])
  const [prioridades, setPrioridades] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/catalogos/tipos-proceso')
      .then(res => setTipos(res.data))

    axios.get('http://localhost:3000/api/catalogos/estados')
      .then(res => setEstados(res.data))

    axios.get('http://localhost:3000/api/catalogos/prioridades')
      .then(res => setPrioridades(res.data))
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.numero_radicado ||
      !form.id_tipo_proceso ||
      !form.id_estado ||
      !form.id_prioridad ||
      !form.descripcion_hechos
    ) {
      alert('Todos los campos son obligatorios')
      return
    }

    try {
      await axios.post('http://localhost:3000/api/casos', {
        numero_radicado: form.numero_radicado,
        id_tipo_proceso: Number(form.id_tipo_proceso),
        id_estado: Number(form.id_estado),
        id_prioridad: Number(form.id_prioridad),
        descripcion_hechos: form.descripcion_hechos,
        fecha_apertura: new Date(),
        id_usuario_creador: usuario.id_usuario
      })

      alert('Caso creado 🚀')
      navigate('/casos')

    } catch (error) {
      console.error(error)
      alert('Error creando caso')
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Crear Caso</h2>

        <form onSubmit={handleSubmit} style={formStyle}>

          <input
            name="numero_radicado"
            placeholder="Número de radicado"
            value={form.numero_radicado}
            onChange={handleChange}
            style={input}
          />

          <select
            name="id_tipo_proceso"
            value={form.id_tipo_proceso}
            onChange={handleChange}
            style={input}
          >
            <option value="">Seleccione tipo de proceso</option>
            {tipos.map(t => (
              <option key={t.id_tipo_proceso} value={t.id_tipo_proceso}>
                {t.nombre_proceso}
              </option>
            ))}
          </select>

          <select
            name="id_estado"
            value={form.id_estado}
            onChange={handleChange}
            style={input}
          >
            <option value="">Seleccione estado</option>
            {estados.map(e => (
              <option key={e.id_estado} value={e.id_estado}>
                {e.nombre_estado}
              </option>
            ))}
          </select>

          <select
            name="id_prioridad"
            value={form.id_prioridad}
            onChange={handleChange}
            style={input}
          >
            <option value="">Seleccione prioridad</option>
            {prioridades.map(p => (
              <option key={p.id_prioridad} value={p.id_prioridad}>
                {p.nombre_prioridad}
              </option>
            ))}
          </select>

          <textarea
            name="descripcion_hechos"
            placeholder="Descripción del caso"
            value={form.descripcion_hechos}
            onChange={handleChange}
            style={{ ...input, height: '100px' }}
          />

          <button type="submit" style={button}>
            Guardar Caso
          </button>

        </form>
      </div>
    </div>
  )
}

// 🎨 estilos
const container = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#0f172a'
}

const card = {
  background: '#1e293b',
  padding: '30px',
  borderRadius: '12px',
  width: '400px',
  color: 'white',
  boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
}

const title = {
  textAlign: 'center',
  marginBottom: '20px'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}

const input = {
  padding: '12px',
  borderRadius: '8px',
  border: 'none'
}

const button = {
  padding: '12px',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

export default CrearCaso