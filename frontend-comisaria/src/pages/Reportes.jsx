import { useEffect, useState } from 'react'

function Reportes() {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard/resumen')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  if (!data) return <p style={{ padding: '30px' }}>Cargando...</p>

  return (
    <div style={container}>
      <h1 style={title}>📈 Estadísticas</h1>

      <div style={grid}>

        <div style={card}>
          <h3>Casos activos</h3>
          <p style={number}>{data.casos_activos}</p>
        </div>

        <div style={card}>
          <h3>Prioridad alta</h3>
          <p style={number}>{data.prioridad_alta}</p>
        </div>

        <div style={card}>
          <h3>Funcionarios</h3>
          <p style={number}>{data.funcionarios}</p>
        </div>

      </div>
    </div>
  )
}

// 🎨 estilos
const container = {
  padding: '30px',
  background: '#f1f5f9',
  minHeight: '100vh'
}

const title = {
  marginBottom: '20px'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
}

const card = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  textAlign: 'center'
}

const number = {
  fontSize: '30px',
  fontWeight: 'bold',
  marginTop: '10px',
  color: '#3b82f6'
}

export default Reportes