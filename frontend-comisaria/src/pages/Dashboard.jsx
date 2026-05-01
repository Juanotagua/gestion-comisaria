import { useEffect, useState } from 'react'

function Reportes() {

  const [resumen, setResumen] = useState(null)
  const [prioridades, setPrioridades] = useState([])
  const [estados, setEstados] = useState([])
  const [topUsuarios, setTopUsuarios] = useState([])

  useEffect(() => {

    const cargar = async () => {
      try {
        const r1 = await fetch('http://localhost:3000/api/dashboard/resumen')
        setResumen(await r1.json())

        const r2 = await fetch('http://localhost:3000/api/dashboard/por-prioridad')
        setPrioridades(await r2.json())

        const r3 = await fetch('http://localhost:3000/api/dashboard/por-estado')
        setEstados(await r3.json())

        const r4 = await fetch('http://localhost:3000/api/dashboard/top-usuarios')
        setTopUsuarios(await r4.json())

      } catch (err) {
        console.error(err)
      }
    }

    cargar()

  }, [])

  if (!resumen) return <p style={{ padding: '30px' }}>Cargando estadísticas...</p>

  return (
    <div style={container}>
      <h1>📈 Estadísticas del Sistema</h1>

      {/* 🔹 TARJETAS */}
      <div style={grid}>
        <Card title="Casos activos" value={resumen.casos_activos} />
        <Card title="Prioridad alta" value={resumen.prioridad_alta} />
        <Card title="Funcionarios" value={resumen.funcionarios} />
      </div>

      {/* 🔹 PRIORIDADES */}
      <Section title="Casos por prioridad">
        {prioridades.map(p => (
          <Bar 
            key={p.nombre_prioridad}
            label={p.nombre_prioridad}
            value={p.total}
            color={getColorPrioridad(p.nombre_prioridad)}
          />
        ))}
      </Section>

      {/* 🔹 ESTADOS */}
      <Section title="Casos por estado">
        {estados.map(e => (
          <Bar 
            key={e.nombre_estado}
            label={e.nombre_estado}
            value={e.total}
            color="#3b82f6"
          />
        ))}
      </Section>

      {/* 🔹 TOP USUARIOS */}
      <Section title="Funcionarios con más casos">
        {topUsuarios.map(u => (
          <Bar 
            key={u.nombre}
            label={u.nombre}
            value={u.total}
            color="#8b5cf6"
          />
        ))}
      </Section>

    </div>
  )
}

// 🔹 COMPONENTES

function Card({ title, value }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={number}>{value}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

function Bar({ label, value, color }) {

  const width = value * 40

  return (
    <div style={barContainer}>
      <span style={{ width: '150px' }}>{label}</span>

      <div style={barBg}>
        <div
          style={{
            ...barFill,
            width: `${width}px`,
            background: color,
            animation: 'grow 0.5s ease'
          }}
        />
      </div>

      <span>{value}</span>
    </div>
  )
}

// 🎨 ESTILOS

const container = {
  padding: '30px',
  background: '#f1f5f9',
  minHeight: '100vh'
}

const grid = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap'
}

const card = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  minWidth: '200px',
  textAlign: 'center'
}

const number = {
  fontSize: '28px',
  color: '#3b82f6',
  marginTop: '10px'
}

const barContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  margin: '10px 0'
}

const barBg = {
  flex: 1,
  height: '10px',
  background: '#e2e8f0',
  borderRadius: '6px'
}

const barFill = {
  height: '10px',
  borderRadius: '6px'
}

// 🎨 colores prioridad
const getColorPrioridad = (p) => {
  if (p === 'Alta') return '#ef4444'
  if (p === 'Media') return '#f59e0b'
  if (p === 'Baja') return '#22c55e'
  return '#3b82f6'
}

export default Reportes