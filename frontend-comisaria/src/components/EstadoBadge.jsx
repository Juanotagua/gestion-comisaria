function EstadoBadge({ estado }) {

  const getStyles = () => {

    switch (estado?.toLowerCase()) {

      case 'pendiente':
        return {
          background: '#FEF3C7',
          color: '#92400E'
        }

      case 'en proceso':
        return {
          background: '#DBEAFE',
          color: '#1D4ED8'
        }

      case 'cerrado':
        return {
          background: '#DCFCE7',
          color: '#166534'
        }

      case 'archivado':
        return {
          background: '#E2E8F0',
          color: '#334155'
        }

      default:
        return {
          background: '#F1F5F9',
          color: '#475569'
        }

    }

  }

  const styles = getStyles()

  return (

    <div
      style={{
        background: styles.background,
        color: styles.color,

        padding: '8px 14px',

        borderRadius: '999px',

        fontSize: '12px',
        fontWeight: '700',

        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',

        letterSpacing: '0.3px',

        width: 'fit-content'
      }}
    >

      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: styles.color
        }}
      />

      {estado}

    </div>

  )

}

export default EstadoBadge