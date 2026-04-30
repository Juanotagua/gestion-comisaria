import { useEffect, useState } from 'react'

function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard/resumen')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  if (!data) return <p style={{padding: '20px'}}>Cargando...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ marginBottom: '30px' }}>Panel Principal</h1>

      <div style={{
        display: 'flex',
        gap: '20px'
      }}>

        {/* Casos activos */}
        <div style={cardStyle}>
          <h2>{data.casos_activos}</h2>
          <p>Casos activos</p>
        </div>

        {/* Prioridad alta */}
        <div style={cardStyle}>
          <h2>{data.prioridad_alta}</h2>
          <p>Prioridad alta</p>
        </div>

        {/* Funcionarios */}
        <div style={cardStyle}>
          <h2>{data.funcionarios}</h2>
          <p>Funcionarios</p>
        </div>

      </div>
    </div>
  )
}

const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '12px',
  width: '200px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  textAlign: 'center'
}

export default Dashboard