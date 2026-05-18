function PrioridadBadge({ prioridad }) {

  const getStyles = () => {

    switch (prioridad?.toLowerCase()) {

      case 'alta':
        return {
          background: '#FEE2E2',
          color: '#DC2626'
        }

      case 'media':
        return {
          background: '#FEF3C7',
          color: '#B45309'
        }

      case 'baja':
        return {
          background: '#DCFCE7',
          color: '#166534'
        }

      default:
        return {
          background: '#E2E8F0',
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

      {prioridad}

    </div>

  )

}

export default PrioridadBadge