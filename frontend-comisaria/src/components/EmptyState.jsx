function EmptyState({ mensaje }) {

  return (

    <div style={{
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '60px',
      border: '1px dashed #CBD5E1',
      textAlign: 'center'
    }}>

      <h2 style={{
        color: '#64748B',
        margin: 0
      }}>
        {mensaje}
      </h2>

    </div>

  )

}

export default EmptyState