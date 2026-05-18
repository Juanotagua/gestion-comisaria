function TimelineSeguimiento({ seguimiento }) {

  return (

    <div style={container}>

      {seguimiento.map((item, index) => (

        <div
          key={item.id_seguimiento}
          style={itemContainer}
        >

          {/* LÍNEA */}
          {index !== seguimiento.length - 1 && (
            <div style={line} />
          )}

          {/* PUNTO */}
          <div
            style={{
              ...dot,
              background:
                item.nombre_accion === 'Comentario'
                  ? '#3B82F6'
                  : item.nombre_accion === 'Cambio de Estado'
                  ? '#F59E0B'
                  : item.nombre_accion === 'Reasignación'
                  ? '#8B5CF6'
                  : '#10B981'
            }}
          />

          {/* CARD */}
          <div style={card}>

            <div style={header}>

              <strong style={usuario}>
                {item.nombre}
              </strong>

              <span style={accion}>
                {item.nombre_accion}
              </span>

            </div>

            <p style={descripcion}>
              {item.descripcion}
            </p>

            <small style={fecha}>
              {new Date(
                item.fecha_registro
              ).toLocaleString()}
            </small>

          </div>

        </div>

      ))}

    </div>

  )

}

/* ESTILOS */

const container = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  marginTop: '20px'
}

const itemContainer = {
  position: 'relative',
  display: 'flex',
  gap: '18px'
}

const line = {
  position: 'absolute',
  left: '14px',
  top: '34px',
  width: '2px',
  height: '100%',
  background: '#E2E8F0'
}

const dot = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  flexShrink: 0,
  marginTop: '6px',
  boxShadow: '0 0 0 6px rgba(59,130,246,0.10)'
}

const card = {
  flex: 1,
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '18px',
  padding: '18px',
  boxShadow: '0 8px 24px rgba(15,23,42,0.05)'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  flexWrap: 'wrap',
  gap: '10px'
}

const usuario = {
  color: '#0F172A',
  fontSize: '15px'
}

const accion = {
  background: '#F1F5F9',
  padding: '6px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: '600',
  color: '#334155'
}

const descripcion = {
  color: '#475569',
  lineHeight: '1.6',
  marginBottom: '14px'
}

const fecha = {
  color: '#94A3B8'
}

export default TimelineSeguimiento