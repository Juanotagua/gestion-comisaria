function Toast({ message, type }) {

  if (!message) return null

  return (

    <div
      style={{
        position: 'fixed',
        top: '25px',
        right: '25px',
        padding: '16px 20px',
        borderRadius: '14px',
        color: 'white',
        fontWeight: '600',
        zIndex: 9999,
        minWidth: '280px',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        background:
          type === 'error'
            ? '#DC2626'
            : type === 'info'
            ? '#2563EB'
            : '#16A34A'
      }}
    >
      {message}
    </div>

  )

}

export default Toast