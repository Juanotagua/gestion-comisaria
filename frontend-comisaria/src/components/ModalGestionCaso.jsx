import AccionesCaso from './AccionesCaso'

function ModalGestionCaso({
  abierto,
  cerrar,
  caso,
  actualizarEstado,
  reasignarCaso,
  agregarComentario,
  usuarios,
  estados
}) {

  if (!abierto) return null

  return (

    <div style={overlay}>

      <div style={modal}>

        {/* HEADER */}
        <div style={header}>

          <div>

            <h2 style={title}>
              Gestionar caso
            </h2>

            <p style={subtitle}>
              {caso?.numero_radicado}
            </p>

          </div>

          <button
            onClick={cerrar}
            style={closeButton}
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div style={body}>

          <AccionesCaso
            caso={caso}
            actualizarEstado={actualizarEstado}
            reasignarCaso={reasignarCaso}
            agregarComentario={agregarComentario}
            usuarios={usuarios}
            estados={estados}
          />

        </div>

      </div>

    </div>

  )

}

/* ESTILOS */

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.55)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  padding: '20px'
}

const modal = {
  width: '100%',
  maxWidth: '700px',
  background: '#FFFFFF',
  borderRadius: '28px',
  overflow: 'hidden',
  boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
}

const header = {
  padding: '24px 30px',
  borderBottom: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const title = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '800',
  color: '#0F172A'
}

const subtitle = {
  marginTop: '6px',
  color: '#64748B'
}

const closeButton = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  border: 'none',
  background: '#F1F5F9',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: '700'
}

const body = {
  padding: '30px'
}

export default ModalGestionCaso