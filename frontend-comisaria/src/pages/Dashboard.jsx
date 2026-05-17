import { useEffect, useState } from 'react'
import Toast from '../components/Toast'
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

  if (!resumen) {
    return (
      <div style={loadingContainer}>
        <div style={loadingCard}>
          Cargando estadísticas...
        </div>
      </div>
    )
  }

  return (

    <div style={container}>

      {/* HEADER */}
      <div style={header}>

        <div>
          <h1 style={title}>
            Dashboard
          </h1>

          <p style={subtitle}>
            Estadísticas generales del sistema
          </p>
        </div>

      </div>

      {/* TARJETAS */}
      <div style={grid}>

        <Card
          title="Casos activos"
          value={resumen.casos_activos}
          color="#2563EB"
        />

        <Card
          title="Prioridad alta"
          value={resumen.prioridad_alta}
          color="#DC2626"
        />

        <Card
          title="Funcionarios"
          value={resumen.funcionarios}
          color="#7C3AED"
        />

      </div>

      {/* PRIORIDAD */}
      <Section title="Casos por prioridad">

        {prioridades.map((p) => (

          <Bar
            key={p.nombre_prioridad}
            label={p.nombre_prioridad}
            value={p.total}
            color={getColorPrioridad(p.nombre_prioridad)}
          />

        ))}

      </Section>

      {/* ESTADOS */}
      <Section title="Casos por estado">

        {estados.map((e) => (

          <Bar
            key={e.nombre_estado}
            label={e.nombre_estado}
            value={e.total}
            color="#2563EB"
          />

        ))}

      </Section>

      {/* TOP USUARIOS */}
      <Section title="Funcionarios con más casos">

        {topUsuarios.map((u) => (

          <Bar
            key={u.nombre}
            label={u.nombre}
            value={u.total}
            color="#7C3AED"
          />

        ))}

      </Section>

    </div>

  )

}

/* COMPONENTES */

function Card({ title, value, color }) {

  return (

    <div
      style={card}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          'translateY(-4px)'

        e.currentTarget.style.boxShadow =
          '0 16px 30px rgba(0,0,0,0.08)'
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          'translateY(0px)'

        e.currentTarget.style.boxShadow =
          '0 6px 18px rgba(0,0,0,0.05)'
      }}
    >

      <div
        style={{
          ...circle,
          background: color
        }}
      />

      <h3 style={cardTitle}>
        {title}
      </h3>

      <p
        style={{
          ...number,
          color
        }}
      >
        {value}
      </p>

    </div>

  )

}

function Section({ title, children }) {

  return (

    <div style={section}>

      <div style={sectionHeader}>
        <h2 style={sectionTitle}>
          {title}
        </h2>
      </div>

      <div style={sectionContent}>
        {children}
      </div>

    </div>

  )

}

function Bar({ label, value, color }) {

  const width = value * 35

  return (

    <div style={barContainer}>

      <div style={barTop}>

        <span style={barLabel}>
          {label}
        </span>

        <span style={barValue}>
          {value}
        </span>

      </div>

      <div style={barBg}>

        <div
          style={{
            ...barFill,
            width: `${width}px`,
            background: color
          }}
        />

      </div>

    </div>

  )

}

/* ESTILOS */

const container = {
  padding: '35px',
  background: '#F8FAFC',
  minHeight: '100vh'
}

const loadingContainer = {
  padding: '40px'
}

const loadingCard = {
  background: 'white',
  padding: '30px',
  borderRadius: '18px',
  border: '1px solid #E2E8F0'
}

const header = {
  marginBottom: '35px'
}

const title = {
  margin: 0,
  fontSize: '38px',
  color: '#0F172A'
}

const subtitle = {
  marginTop: '10px',
  color: '#64748B',
  fontSize: '15px'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '20px'
}

const card = {
  background: '#FFFFFF',
  borderRadius: '22px',
  padding: '28px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
  transition: '0.25s ease',
  cursor: 'default'
}

const circle = {
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  marginBottom: '18px'
}

const cardTitle = {
  color: '#64748B',
  fontSize: '15px',
  fontWeight: '600'
}

const number = {
  fontSize: '42px',
  fontWeight: '700',
  marginTop: '12px',
  marginBottom: 0
}

const section = {
  marginTop: '35px',
  background: '#FFFFFF',
  borderRadius: '22px',
  border: '1px solid #E2E8F0',
  overflow: 'hidden'
}

const sectionHeader = {
  padding: '22px 26px',
  borderBottom: '1px solid #E2E8F0'
}

const sectionTitle = {
  margin: 0,
  color: '#0F172A',
  fontSize: '22px'
}

const sectionContent = {
  padding: '26px'
}

const barContainer = {
  marginBottom: '22px'
}

const barTop = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px'
}

const barLabel = {
  color: '#334155',
  fontWeight: '600'
}

const barValue = {
  color: '#64748B'
}

const barBg = {
  width: '100%',
  height: '12px',
  background: '#E2E8F0',
  borderRadius: '999px',
  overflow: 'hidden'
}

const barFill = {
  height: '12px',
  borderRadius: '999px',
  transition: '0.4s ease'
}

/* COLORES PRIORIDAD */

const getColorPrioridad = (p) => {

  if (p === 'Alta') return '#DC2626'
  if (p === 'Media') return '#F59E0B'
  if (p === 'Baja') return '#16A34A'

  return '#2563EB'

}

export default Reportes