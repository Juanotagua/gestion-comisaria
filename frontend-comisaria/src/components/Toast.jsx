function Toast({
  mensaje,
  tipo = 'success',
  visible
}) {

  if (!visible) return null

  return (

    <div
      style={{
        ...toast,
        background:
          tipo === 'success'
            ? '#16A34A'
            : tipo === 'error'
            ? '#DC2626'
            : '#0F172A'
      }}
    >

      <span style={icon}>
        {
          tipo === 'success'
            ? '✓'
            : tipo === 'error'
            ? '✕'
            : '!'
        }
      </span>

      <span>
        {mensaje}
      </span>

    </div>

  )

}

/* ESTILOS */

const toast = {
  position: 'fixed',
  top: '24px',
  right: '24px',

  minWidth: '280px',

  padding: '16px 20px',

  borderRadius: '16px',

  color: '#FFFFFF',

  display: 'flex',
  alignItems: 'center',
  gap: '12px',

  fontWeight: '600',

  zIndex: 999999,

  boxShadow: '0 20px 40px rgba(0,0,0,0.18)',

  animation: 'fadeIn 0.25s ease'
}

const icon = {
  fontSize: '18px',
  fontWeight: '800'
}

export default Toast