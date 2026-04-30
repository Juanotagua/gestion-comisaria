import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CrearCaso() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    numero_radicado: '',
    id_tipo_proceso: 1,
    id_estado: 1,
    id_prioridad: 1,
    descripcion_hechos: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:3000/api/casos', {
        ...form,
        fecha_apertura: new Date(),
        id_usuario_creador: 1 // luego lo hacemos dinámico con login
      })

      alert('Caso creado 🚀')
      navigate('/casos')

    } catch (error) {
      console.error(error)
      alert('Error creando caso')
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Crear Caso</h1>

      <form onSubmit={handleSubmit}>

        <input
          name="numero_radicado"
          placeholder="Radicado"
          onChange={handleChange}
        />

        <input
          name="descripcion_hechos"
          placeholder="Descripción"
          onChange={handleChange}
        />

        <button type="submit">
          Guardar
        </button>

      </form>
    </div>
  )
}

export default CrearCaso