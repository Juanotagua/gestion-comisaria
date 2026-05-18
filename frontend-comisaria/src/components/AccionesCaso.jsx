import { useState } from 'react'

function AccionesCaso({
  caso,
  actualizarEstado,
  reasignarCaso,
  agregarComentario,
  usuarios,
  estados
}) {

  const [estado, setEstado] = useState('')
  const [usuario, setUsuario] = useState('')
  const [comentario, setComentario] = useState('')

  // 🔥 GUARDAR ESTADO
  const handleActualizarEstado = () => {

    if (!estado) {
      alert('Seleccione un estado')
      return
    }

    actualizarEstado(
      caso.id_caso,
      estado
    )

  }

  // 🔥 REASIGNAR
  const handleReasignar = () => {

    if (!usuario) {
      alert('Seleccione un usuario')
      return
    }

    reasignarCaso(
      caso.id_caso,
      usuario
    )

  }

  // 🔥 COMENTARIO
  const handleComentario = () => {

    if (!comentario.trim()) {
      alert('Ingrese un comentario')
      return
    }

    agregarComentario(
      caso.id_caso,
      comentario
    )

    setComentario('')

  }

  return (

    <div style={container}>

      {/* ESTADO */}
      <div style={section}>

        <label style={label}>
          Estado
        </label>

        <div style={row}>

          <select
            value={estado}

            onChange={(e) =>
              setEstado(e.target.value)
            }

            style={select}
          >

            <option value="">
              Seleccionar
            </option>

            {estados?.map((item) => (

              <option
                key={item.id_estado}
                value={item.id_estado}
              >
                {item.nombre_estado}
              </option>

            ))}

          </select>

          <button
            style={primaryButton}
            onClick={handleActualizarEstado}
          >
            Guardar
          </button>

        </div>

      </div>

      {/* REASIGNAR */}
      <div style={section}>

        <label style={label}>
          Reasignar
        </label>

        <div style={row}>

          <select
            value={usuario}

            onChange={(e) =>
              setUsuario(e.target.value)
            }

            style={select}
          >

            <option value="">
              Usuario
            </option>

            {usuarios?.map((item) => (

              <option
                key={item.id_usuario}
                value={item.id_usuario}
              >
                {item.nombre}
              </option>

            ))}

          </select>

          <button
            style={primaryButton}
            onClick={handleReasignar}
          >
            Asignar
          </button>

        </div>

      </div>

      {/* COMENTARIO */}
      <div style={section}>

        <label style={label}>
          Comentario
        </label>

        <textarea
          value={comentario}

          onChange={(e) =>
            setComentario(e.target.value)
          }

          placeholder="Agregar comentario..."

          style={textarea}
        />

        <button
          style={secondaryButton}
          onClick={handleComentario}
        >
          Agregar comentario
        </button>

      </div>

    </div>

  )

}

/* ESTILOS */

const container = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
}

const section = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '18px',
  padding: '18px'
}

const label = {
  display: 'block',
  marginBottom: '12px',
  fontWeight: '600',
  color: '#0F172A'
}

const row = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
}

const select = {
  flex: 1,
  minWidth: '180px',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF'
}

const textarea = {
  width: '100%',
  minHeight: '100px',
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid #CBD5E1',
  resize: 'vertical',
  marginBottom: '14px',
  boxSizing: 'border-box'
}

const primaryButton = {
  padding: '12px 18px',
  border: 'none',
  borderRadius: '12px',
  background: '#8B1E2D',
  color: '#FFFFFF',
  fontWeight: '600',
  cursor: 'pointer'
}

const secondaryButton = {
  padding: '12px 18px',
  border: 'none',
  borderRadius: '12px',
  background: '#0F172A',
  color: '#FFFFFF',
  fontWeight: '600',
  cursor: 'pointer'
}

export default AccionesCaso