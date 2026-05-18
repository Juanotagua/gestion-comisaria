import EstadoBadge from './EstadoBadge'
import PrioridadBadge from './PrioridadBadge'

function CasoCard({
  caso,
  verSeguimiento,
  descargarPDF,
  abrirGestion
}) {

  return (

    <div

      style={card}

      onMouseEnter={(e) => {

        e.currentTarget.style.transform =
          'translateY(-5px)'

        e.currentTarget.style.boxShadow =
          '0 24px 50px rgba(15,23,42,0.12)'

      }}

      onMouseLeave={(e) => {

        e.currentTarget.style.transform =
          'translateY(0px)'

        e.currentTarget.style.boxShadow =
          '0 10px 30px rgba(15,23,42,0.05)'

      }}
    >

      {/* HEADER */}
      <div style={header}>

        {/* LEFT */}
        <div style={leftHeader}>

          <div style={radicadoBox}>

            <div style={radicadoDot} />

            <h3 style={radicado}>
              {caso.numero_radicado}
            </h3>

          </div>

          <p style={tipo}>
            {caso.nombre_proceso}
          </p>

        </div>

        {/* RIGHT */}
        <div style={badges}>

          <EstadoBadge
            estado={caso.nombre_estado}
          />

          <PrioridadBadge
            prioridad={caso.nombre_prioridad}
          />

        </div>

      </div>

      {/* BODY */}
      <div style={body}>

        <p style={descripcion}>
          {caso.descripcion_hechos}
        </p>

      </div>

      {/* INFO */}
      <div style={infoGrid}>

        <div style={infoCard}>

          <span style={infoLabel}>
            Usuario asignado
          </span>

          <span style={infoValue}>
            👤 {
              caso.usuario_asignado ||
              'Sin asignar'
            }
          </span>

        </div>

        <div style={infoCard}>

          <span style={infoLabel}>
            Fecha apertura
          </span>

          <span style={infoValue}>
            📅 {
              caso.fecha_apertura
                ? new Date(
                    caso.fecha_apertura
                  ).toLocaleDateString()

                : 'Sin fecha'
            }
          </span>

        </div>

      </div>

      {/* ACTIONS */}
      <div style={actions}>

        <button
          style={primaryButton}
          onClick={() =>
            verSeguimiento(caso.id_caso)
          }
        >
          Ver seguimiento
        </button>

        <button
          style={secondaryButton}
          onClick={() =>
            descargarPDF(caso.id_caso)
          }
        >
          Generar PDF
        </button>

        <button
          style={outlineButton}
          onClick={() =>
            abrirGestion(caso)
          }
        >
          Gestionar caso
        </button>

      </div>

    </div>

  )

}

/* =========================
   ESTILOS
========================= */

const card = {
  background: '#FFFFFF',
  borderRadius: '28px',
  padding: '26px',
  border: '1px solid #E2E8F0',
  boxShadow:
    '0 10px 30px rgba(15,23,42,0.05)',
  transition:
    'transform 0.25s ease, box-shadow 0.25s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  position: 'relative',
  overflow: 'hidden'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '18px',
  flexWrap: 'wrap'
}

const leftHeader = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
}

const radicadoBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
}

const radicadoDot = {
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  background:
    'linear-gradient(135deg, #8B1E2D, #DC2626)',
  boxShadow:
    '0 0 16px rgba(220,38,38,0.35)'
}

const radicado = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '800',
  color: '#0F172A',
  letterSpacing: '-0.7px'
}

const tipo = {
  margin: 0,
  color: '#64748B',
  fontSize: '14px',
  fontWeight: '500'
}

const badges = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
}

const body = {
  borderTop: '1px solid #F1F5F9',
  borderBottom: '1px solid #F1F5F9',
  padding: '20px 0'
}

const descripcion = {
  margin: 0,
  color: '#334155',
  lineHeight: '1.8',
  fontSize: '15px'
}

const infoGrid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px'
}

const infoCard = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '18px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}

const infoLabel = {
  fontSize: '12px',
  color: '#64748B',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}

const infoValue = {
  fontSize: '14px',
  color: '#0F172A',
  fontWeight: '600'
}

const actions = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(3, 1fr)',
  gap: '12px',
  marginTop: '4px'
}

const primaryButton = {
  padding: '14px',
  border: 'none',
  borderRadius: '16px',
  background:
    'linear-gradient(135deg, #8B1E2D, #991B1B)',
  color: '#FFFFFF',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  transition: '0.25s ease',
  boxShadow:
    '0 10px 20px rgba(139,30,45,0.20)'
}

const secondaryButton = {
  padding: '14px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: '#0F172A',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  transition: '0.25s ease'
}

const outlineButton = {
  padding: '14px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  background: '#F8FAFC',
  color: '#0F172A',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  transition: '0.25s ease'
}

export default CasoCard