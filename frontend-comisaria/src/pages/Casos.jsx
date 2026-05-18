import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toast from '../components/Toast'
import EstadoBadge from '../components/EstadoBadge'
import PrioridadBadge from '../components/PrioridadBadge'
import CasoCard from '../components/CasoCard'
import TimelineSeguimiento from '../components/TimelineSeguimiento'
import ModalSeguimiento from '../components/ModalSeguimiento'
import ModalGestionCaso from '../components/ModalGestionCaso'

function Casos() {

  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const [casos, setCasos] = useState([])
  const [seguimiento, setSeguimiento] = useState([])
  const [comentario, setComentario] = useState('')
  const [guardandoComentario, setGuardandoComentario] = useState(false) 
  const [casoSeleccionado, setCasoSeleccionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarComentario, setMostrarComentario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [prioridadFiltro, setPrioridadFiltro] = useState('')
  const [orden, setOrden] = useState('reciente')
  const [usuarios, setUsuarios] = useState([])
  const [usuarioAsignar, setUsuarioAsignar] = useState({})
  const [estados, setEstados] = useState([])
  const [estadoSeleccionado, setEstadoSeleccionado] = useState({})
  const [modalSeguimiento, setModalSeguimiento] = useState(false)
  const [casoModal, setCasoModal] = useState(null)
  const [toast, setToast] = useState({ visible: false, mensaje: '',tipo: 'success'})
  const [modalGestion, setModalGestion] = useState(false)
  const [casoGestion, setCasoGestion] = useState(null)
  const [casoGestionando, setCasoGestionando] =useState(null)


  // 🔹 Obtener casos
  const obtenerCasos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/casos`, {
        params: {
          id_usuario: usuario.id_usuario,
          rol: usuario.nombre_rol
        }
      })
      setCasos(res.data)
    } catch (error) {
      console.error(error)
      mostrarToast('Error cargando casos', 'error')
    }
  }
  
 const abrirGestion = (caso) => {

  setCasoGestion(caso)

  setModalGestion(true)

}
  const mostrarToast = (
  mensaje,
  tipo = 'success'
) => {

  setToast({
    visible: true,
    mensaje,
    tipo
  })

  setTimeout(() => {

    setToast({
      visible: false,
      mensaje: '',
      tipo: 'success'
    })

  }, 3000)

}

  // 🔹 Obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`)
      setUsuarios(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  // 🔹 Obtener estados
  const obtenerEstados = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalogos/estados`)
      setEstados(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    obtenerCasos()
    obtenerUsuarios()
    obtenerEstados()
  }, [])

  // 🎨 COLOR ACCIONES
  const getColor = (accion) => {
    switch (accion) {
      case 'Creacion': return 'green'
      case 'Actualizacion': return 'blue'
      case 'Reasignacion': return 'orange'
      default: return 'black'
    }
  }

  // 🔥 VER SEGUIMIENTO
  const verSeguimiento = async (caso) => {

  try {

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/seguimiento/${caso.id_caso}`
    )

    setSeguimiento(response.data)

    setCasoModal(caso)

    setModalSeguimiento(true)

  } catch (error) {

    console.error(error)

    mostrarToast(
      'Error obteniendo seguimiento',
      'error'
    )

  }

}
  /* =========================
   DESCARGAR PDF
========================= */

const descargarPDF = async (idCaso) => {

  try {

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/casos/${idCaso}/pdf`,
      {
        responseType: 'blob'
      }
    )

    // 🔥 CREAR ARCHIVO
    const url = window.URL.createObjectURL(
      new Blob([response.data])
    )

    const link = document.createElement('a')

    link.href = url

    link.setAttribute(
      `download`,
      `caso-${idCaso}.pdf`
    )

    document.body.appendChild(link)

    link.click()

    link.remove()

  } catch (error) {

    console.error(error)

    mostrarToast('Error generando PDF','error')

  }

}
  // 🔥 AGREGAR COMENTARIO
const agregarComentario = async (
  idCaso,
  texto
) => {

  try {

    if (!texto.trim()) {

      mostrarToast('Ingrese un comentario','error')

      return

    }
    console.log({
  idCaso,
  usuario,
  texto
})

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/seguimiento`,
      {
        id_caso: idCaso,

        id_usuario: usuario.id_usuario,

        descripcion: texto
      }
    )

    mostrarToast('Comentario agregado','success')

    obtenerCasos()

  } catch (error) {

    console.error(error)

    mostrarToast('Error agregando comentario', 'error')

  }

}

  // 🔥 ASIGNAR CASO
 const asignarCaso = async (
  idCaso,
  idUsuario
) => {

  if (!idUsuario) {

    mostrarToast('Seleccione un usuario','error')
    return

  }

  try {

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/casos/${idCaso}/reasignar`,
      {
        id_usuario_asignado: Number(idUsuario),
        rol: usuario.nombre_rol
      }
    )

    mostrarToast('Caso asignado correctamente','success')

    obtenerCasos()

  } catch (error) {

    console.error(error)

    if (error.response?.status === 403) {

      mostrarToast('No tienes permisos para reasignar','error')

    } else {

      mostrarToast('Error asignando caso','error')

    }

  }

}

  //  ACTUALIZAR ESTADO 
  const actualizarEstado = async (idCaso, nuevoEstado) => {

    if (!nuevoEstado || nuevoEstado === '') {
      mostrarToast('Seleccione un estado válido', 'error')
      return
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/casos/${idCaso}/estado`, {
        id_estado: Number(nuevoEstado)
      })

      mostrarToast('Estado actualizado correctamente','success')
      obtenerCasos()

      // limpiar selección
      setEstadoSeleccionado({
        ...estadoSeleccionado,
        [idCaso]: ''
      })

    } catch (error) {
      console.error(error)
      mostrarToast(error.response?.data?.error || 'Error actualizando estado','error')
    }
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setEstadoFiltro('')
    setPrioridadFiltro('')
    setOrden('reciente')
  }

  const casosFiltrados = casos
    .filter(caso => {
      const texto = busqueda.toLowerCase().trim()

      const matchBusqueda =
        caso.numero_radicado.toLowerCase().includes(texto)

      const matchEstado = estadoFiltro
        ? caso.nombre_estado.toLowerCase() === estadoFiltro.toLowerCase()
        : true

      const matchPrioridad = prioridadFiltro
        ? caso.nombre_prioridad.toLowerCase() === prioridadFiltro.toLowerCase()
        : true

      return matchBusqueda && matchEstado && matchPrioridad
    })
    .sort((a, b) => {
      if (orden === 'reciente') return b.id_caso - a.id_caso
      if (orden === 'antiguo') return a.id_caso - b.id_caso
      return 0
    })

  return (
    <div style={{ padding: '30px' }}>
      <h1>Listado de Casos</h1>

      <button
      style={btnPrimary}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-1px)'
    e.currentTarget.style.background = '#1D4ED8'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0px)'
    e.currentTarget.style.background = '#2563EB'
  }}
      onClick={() => navigate('/crear-caso')}
      >
      Crear Caso
      </button>

      <div style={filtrosContainer}>

        <input
          placeholder="Buscar por radicado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={input}
  onFocus={(e) => {
    e.currentTarget.style.border =
      '1px solid #2563EB'

    e.currentTarget.style.boxShadow =
      '0 0 0 4px rgba(37,99,235,0.12)'
  }}
  onBlur={(e) => {
    e.currentTarget.style.border =
      '1px solid #CBD5E1'

    e.currentTarget.style.boxShadow =
      '0 1px 2px rgba(0,0,0,0.03)'
  }}
        />

        <select value={orden} onChange={(e) => setOrden(e.target.value)} style={selectModern}
  onFocus={(e) => {
    e.currentTarget.style.border =
      '1px solid #2563EB'

    e.currentTarget.style.boxShadow =
      '0 0 0 4px rgba(37,99,235,0.12)'
  }}
  onBlur={(e) => {
    e.currentTarget.style.border =
      '1px solid #CBD5E1'

    e.currentTarget.style.boxShadow =
      '0 1px 2px rgba(0,0,0,0.03)'
  }}>
          <option value="reciente">Más recientes</option>
          <option value="antiguo">Más antiguos</option>
          
        </select>

        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} style={selectModern}
  onFocus={(e) => {
    e.currentTarget.style.border =
      '1px solid #2563EB'

    e.currentTarget.style.boxShadow =
      '0 0 0 4px rgba(37,99,235,0.12)'
  }}
  onBlur={(e) => {
    e.currentTarget.style.border =
      '1px solid #CBD5E1'

    e.currentTarget.style.boxShadow =
      '0 1px 2px rgba(0,0,0,0.03)'
  }}>
          <option value="">Estado</option>
          <option value="Aperturado">Aperturado</option>
          <option value="En tramite">En tramite</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Envio a Juzgado">Envio a Juzgado</option>
          <option value="Pendiente Seguimiento">Pendiente Seguimiento</option>
          <option value="Etapa probatoria">Etapa probatoria</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <select value={prioridadFiltro} onChange={(e) => setPrioridadFiltro(e.target.value)} style={selectModern}
  onFocus={(e) => {
    e.currentTarget.style.border =
      '1px solid #2563EB'

    e.currentTarget.style.boxShadow =
      '0 0 0 4px rgba(37,99,235,0.12)'
  }}
  onBlur={(e) => {
    e.currentTarget.style.border =
      '1px solid #CBD5E1'

    e.currentTarget.style.boxShadow =
      '0 1px 2px rgba(0,0,0,0.03)'
  }}>
          <option value="">Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <button
  onClick={limpiarFiltros}
  style={{
    ...btnSecondary,
    ...btnLimpiar
  }}
>
  Limpiar
</button>

        <p>🔎 {casosFiltrados.length} resultado(s)</p>
      </div>

      {casosFiltrados.length === 0 && (
        <div style={emptyState}>
          <h3> Sin resultados</h3>
        </div>
      )}
<div style={cardsGrid}>

  {casosFiltrados.map((caso) => (

   <CasoCard
  key={caso.id_caso}

  caso={caso}

  verSeguimiento={verSeguimiento}

  descargarPDF={descargarPDF}

  abrirGestion={abrirGestion}
/>

  ))}

</div>
      {mostrarModal && (

  <div style={overlay}>

    <div style={modalModern}>

      {/* HEADER */}
      <div style={modalHeader}>

        <div>
          <h2 style={{
            margin: 0,
            color: '#0F172A'
          }}>
            Seguimiento del caso {casoSeleccionado}
          </h2>


          <p style={{
            marginTop: '6px',
            color: '#64748B'
          }}>
            Historial de acciones realizadas
          </p>
        </div>

        <button
          style={closeBtn}
          onClick={() => setMostrarModal(false)}
        >
          ✕
        </button>

      </div>

      {/* CONTENIDO */}
      <div style={{
        marginTop: '25px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>

        <TimelineSeguimiento
  seguimiento={seguimiento}
/>

      </div>

    </div>

  </div>

)}
{mostrarComentario && (

  <div style={overlay}>

    <div style={modalModern}>

      <div style={modalHeader}>

        <div>

          <h2 style={{
            margin: 0,
            color: '#0F172A'
          }}>
            Agregar comentario
          </h2>

          <p style={{
            marginTop: '8px',
            color: '#64748B'
          }}>
            Caso #{casoSeleccionado}
          </p>

        </div>

        <button
          style={closeBtn}
          onClick={() =>
            setMostrarComentario(false)
          }
        >
          ✕
        </button>

      </div>

      <textarea
        value={comentario}
        onChange={(e) =>
          setComentario(e.target.value)
        }
        placeholder="Ingrese observación..."
        style={textareaComentario}
        
      />

      <button
        style={{
          ...btnPrimary,
          marginTop: '20px'
        }}
        onClick={agregarComentario}
      >
        Guardar comentario
      </button>

    </div>
    

  </div>

)}
<ModalSeguimiento
  abierto={modalSeguimiento}
  cerrar={() => setModalSeguimiento(false)}
  seguimiento={seguimiento}
  caso={casoModal}
/>

<Toast
  visible={toast.visible}
  mensaje={toast.mensaje}
  tipo={toast.tipo}
/>
<ModalGestionCaso
  abierto={modalGestion}
  cerrar={() => setModalGestion(false)}
  caso={casoGestion}
  actualizarEstado={actualizarEstado}
  reasignarCaso={asignarCaso}
  agregarComentario={agregarComentario}
  usuarios={usuarios}
  estados={estados}
/>
    </div>
  )
}

// 🎨 estilos
const selectModern = {
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  minWidth: '180px',
  outline: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#0F172A',
  transition: '0.2s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
}

const cardsGrid = {
  display: 'grid',

  gridTemplateColumns:
    'repeat(auto-fit, minmax(420px, 1fr))',

  gap: '24px',

  alignItems: 'start'
}

const btnComentario = {
  alignSelf: 'flex-end',
  padding: '12px 18px',
  border: 'none',
  borderRadius: '12px',
  background: '#2563EB',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer'
}


const badge = {
  padding: '8px 14px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: '600'
}


const accionBox = {
  background: '#F8FAFC',
  padding: '18px',
  borderRadius: '14px',
  border: '1px solid #E2E8F0'
}
const textareaComentario = {
  width: '100%',
  minHeight: '140px',
  marginTop: '24px',
  padding: '16px',
  borderRadius: '14px',
  border: '1px solid #CBD5E1',
  resize: 'vertical',
  outline: 'none',
  fontSize: '15px',
  lineHeight: '1.5'
}
const labelStyle = {
  display: 'block',
  marginBottom: '10px',
  fontWeight: '600',
  color: '#334155'
}

const filaAccion = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  flexWrap: 'wrap'
}

const btnPrimary = {
  background: '#2563EB',
  color: 'white',
  border: 'none',
  padding: '11px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: '0.2s ease',
  boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
}

const btnSecondary = {
  background: '#E2E8F0',
  color: '#0F172A',
  border: 'none',
  padding: '11px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: '0.2s ease'
}

const filtrosContainer = {
  display: 'flex',
  gap: '12px',
  margin: '25px 0',
  alignItems: 'center',
  flexWrap: 'wrap',
  background: '#ffffff',
  padding: '18px',
  borderRadius: '16px',
  border: '1px solid #E2E8F0'
}
const modalModern = {
  width: '650px',
  maxHeight: '85vh',
  overflowY: 'auto',
  background: '#FFFFFF',
  borderRadius: '22px',
  padding: '30px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
  animation: 'fadeIn 0.2s ease'
}

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #E2E8F0',
  paddingBottom: '18px'
}

const closeBtn = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: 'none',
  background: '#F1F5F9',
  cursor: 'pointer',
  fontSize: '18px',
  transition: '0.2s ease'
}

const seguimientoCard = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '14px',
  padding: '18px'
}

const input = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  outline: 'none',
  fontSize: '14px',
  minWidth: '260px',
  transition: '0.2s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
}

const select = {
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #CBD5E1',
  background: '#F8FAFC',
  outline: 'none',
  cursor: 'pointer'
}

const btnLimpiar = {
  padding: '12px 18px',
  background: '#DC2626',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600'
}

const emptyState = {
  textAlign: 'center',
  marginTop: '60px',
  background: 'white',
  padding: '40px',
  borderRadius: '16px',
  color: '#64748B'
}

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(15,23,42,0.65)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999
}

const modal = {
  background: 'white',
  padding: '30px',
  width: '500px',
  maxHeight: '80vh',
  overflowY: 'auto',
  borderRadius: '18px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
}

export default Casos