import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Casos() {
  const navigate = useNavigate()

  const [casos, setCasos] = useState([])
  const [seguimiento, setSeguimiento] = useState([])
  const [casoSeleccionado, setCasoSeleccionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)

  // 🔹 Obtener casos
  const obtenerCasos = () => {
    fetch('http://localhost:3000/api/casos')
      .then(res => res.json())
      .then(data => setCasos(data))
  }

  useEffect(() => {
    obtenerCasos()
  }, [])

  // 🎨 COLOR POR ACCIÓN
  const getColor = (accion) => {
    switch (accion) {
      case 'Creacion':
        return 'green'
      case 'Actualizacion':
        return 'blue'
      case 'Reasignacion':
        return 'orange'
      default:
        return 'black'
    }
  }

  // 🔥 VER SEGUIMIENTO (abre modal)
  const verSeguimiento = async (idCaso) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/seguimiento/${idCaso}`)

      setSeguimiento(res.data)
      setCasoSeleccionado(idCaso)
      setMostrarModal(true)

    } catch (error) {
      console.error(error)
      alert('Error obteniendo seguimiento')
    }
  }

  // 🔹 Asignar caso
  const asignarCaso = async (idCaso) => {
    const idUsuario = prompt('Ingrese ID del usuario a asignar')
    if (!idUsuario) return

    try {
      await axios.put(`http://localhost:3000/api/casos/${idCaso}/reasignar`, {
        id_usuario_asignado: Number(idUsuario)
      })

      alert('Caso asignado ✅')
      obtenerCasos()

    } catch (error) {
      console.error(error)
      alert('Error asignando caso')
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Listado de Casos</h1>

      <button onClick={() => navigate('/crear-caso')}>
        ➕ Crear Caso
      </button>

      {/* 🔹 LISTADO */}
      {casos.map(caso => (
        <div key={caso.id_caso} style={cardStyle}>
          <h3>{caso.numero_radicado}</h3>
          <p><b>Estado:</b> {caso.nombre_estado}</p>
          <p><b>Prioridad:</b> {caso.nombre_prioridad}</p>
          <p>{caso.descripcion_hechos}</p>

          <button onClick={() => asignarCaso(caso.id_caso)}>
            Asignar
          </button>

          <button onClick={() => verSeguimiento(caso.id_caso)}>
            Ver seguimiento
          </button>
        </div>
      ))}

      {/* 🔥 MODAL DE SEGUIMIENTO */}
      {mostrarModal && (
        <div style={overlay}>
          <div style={modal}>

            <h2>Seguimiento del caso {casoSeleccionado}</h2>

            <button onClick={() => setMostrarModal(false)} style={closeBtn}>
              ✖
            </button>

            {seguimiento.length === 0 ? (
              <p>No hay seguimiento</p>
            ) : (
              <div style={timelineContainer}>
                {seguimiento.map(item => (
                  <div key={item.id_seguimiento} style={timelineItem}>

                    <div style={dot}></div>

                    <div style={timelineContent}>
                      <p>
                        <b>{item.nombre}</b> — 
                        <span style={{ color: getColor(item.nombre_accion) }}>
                          {item.nombre_accion}
                        </span>
                      </p>

                      <p>{item.descripcion}</p>

                      <small>
                        {new Date(item.fecha_registro).toLocaleString()}
                      </small>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

/* 🎨 ESTILOS */

const cardStyle = {
  background: '#fff',
  padding: '15px',
  margin: '15px 0',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const modal = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '500px',
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative'
}

const closeBtn = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer'
}

const timelineContainer = {
  marginTop: '20px',
  paddingLeft: '20px',
  borderLeft: '3px solid #3b82f6'
}

const timelineItem = {
  position: 'relative',
  marginBottom: '20px'
}

const dot = {
  width: '12px',
  height: '12px',
  background: '#3b82f6',
  borderRadius: '50%',
  position: 'absolute',
  left: '-8px',
  top: '5px'
}

const timelineContent = {
  marginLeft: '15px',
  background: '#f8fafc',
  padding: '10px',
  borderRadius: '8px'
}

export default Casos