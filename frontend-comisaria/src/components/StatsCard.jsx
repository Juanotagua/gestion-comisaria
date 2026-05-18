function StatsCard({
  titulo,
  valor,
  color,
  icono
}) {

  return (

    <div
      style={{
        ...card,
        borderTop: `5px solid ${color}`
      }}
    >

      <div style={content}>

        <div>

          <p style={tituloStyle}>
            {titulo}
          </p>

          <h2 style={{
            ...valorStyle,
            color
          }}>
            {valor}
          </h2>

        </div>

        <div style={{
          ...iconBox,
          background: color
        }}>
          {icono}
        </div>

      </div>

    </div>

  )

}
const card = {
  background: '#FFFFFF',
  borderRadius: '18px',
  padding: '18px 22px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
  transition: '0.25s ease',
  minHeight: '95px',
  display: 'flex',
  alignItems: 'center'
}

const content = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '80%'
}

const tituloStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#64748B',
  fontWeight: '600',
  letterSpacing: '0.3px'
}

const valorStyle = {
  marginTop: '6px',
  marginBottom: 0,
  fontSize: '34px',
  fontWeight: '800',
  lineHeight: '1',
  color: '#0F172A'
}

const iconBox = {
  width: '30px',
  height: '30px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  color: '#FFFFFF',
  flexShrink: 0
}

export default StatsCard