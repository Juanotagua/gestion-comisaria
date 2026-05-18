import { useEffect, useState } from 'react'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

function Dashboard() {

  const [resumen, setResumen] = useState(null)

  const [prioridades, setPrioridades] =
    useState([])

  const [estados, setEstados] =
    useState([])

  const [topUsuarios, setTopUsuarios] =
    useState([])

    const [actividad, setActividad] =
  useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    cargarDashboard()

  }, [])

  const cargarDashboard = async () => {

    try {

      const r1 = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard/resumen`
      )

      const data1 = await r1.json()

      setResumen(data1)

      const r2 = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard/por-prioridad`
      )

      const data2 = await r2.json()

      setPrioridades(data2)

      const r3 = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard/por-estado`
      )

      const data3 = await r3.json()

      setEstados(data3)

      const r4 = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard/top-usuarios`
      )

      const data4 = await r4.json()

      setTopUsuarios(data4)
      const r5 = await fetch(
  `${import.meta.env.VITE_API_URL}/api/dashboard/actividad-reciente`
)

const data5 = await r5.json()

setActividad(data5)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
    

  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!resumen) {
    return (
      <EmptyState
        mensaje="No hay estadísticas disponibles"
      />
    )
  }

  const COLORS = [
    '#8B1E2D',
    '#2563EB',
    '#16A34A',
    '#EA580C',
    '#7C3AED'
  ]

  return (

    <div style={container}>

      {/* HEADER */}

      <div style={header}>

        <div>

          <h1 style={title}>
            Dashboard General
          </h1>

          <p style={subtitle}>
            Estadísticas generales del sistema
          </p>

        </div>

      </div>

      {/* STATS */}

      <div style={statsGrid}>

        <StatsCard
          titulo="Casos activos"
          valor={resumen.casos_activos}
          color="#8B1E2D"
          icono="📂"
        />

        <StatsCard
          titulo="Prioridad alta"
          valor={resumen.prioridad_alta}
          color="#EA580C"
          icono="⚠️"
        />

        <StatsCard
          titulo="Funcionarios"
          valor={resumen.funcionarios}
          color="#2563EB"
          icono="👮"
        />

      </div>

      {/* CHARTS */}

      <div style={chartsGrid}>

        {/* PRIORIDADES */}

        <div style={card}>

          <h2 style={cardTitle}>
            Casos por prioridad
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={prioridades}
                dataKey="total"
                nameKey="nombre_prioridad"
                outerRadius={120}
              >

                {prioridades.map((_, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* ESTADOS */}

        <div style={card}>

          <h2 style={cardTitle}>
            Casos por estado
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={estados}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="nombre_estado" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total"
                fill="#8B1E2D"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* TOP USUARIOS */}

      <div style={card}>

        <h2 style={cardTitle}>
          Funcionarios con más casos
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={topUsuarios}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="nombre" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#2563EB"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ACTIVIDAD RECIENTE */}

      <div style={card}>

  <div style={tableHeader}>

    <h2 style={cardTitle}>
      Actividad reciente
    </h2>

  </div>

  <div style={tableContainer}>

    <table style={table}>

      <thead>

        <tr>

          <th style={th}>Usuario</th>

          <th style={th}>Acción</th>

          <th style={th}>Caso</th>

          <th style={th}>Fecha</th>

        </tr>

      </thead>

      <tbody>

        {Array.isArray(actividad) && actividad.map((item) => (

          <tr key={item.id_seguimiento}>

            <td style={td}>
              {item.nombre || 'Funcionario'}
            </td>

            <td style={td}>
              {item.descripcion}
            </td>

            <td style={td}>
              {item.numero_radicado}
            </td>

            <td style={td}>
              {
                new Date(item.fecha_registro)
                .toLocaleDateString()
              }
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

      </div>

    </div>

  )

}

/* ESTILOS */

const container = {
  padding: '28px',
  background: '#F1F5F9',
  minHeight: '100vh'
}

const header = {
  marginBottom: '35px'
}

const title = {
  margin: 0,
  fontSize: '42px',
  color: '#0F172A'
}

const subtitle = {
  marginTop: '10px',
  color: '#64748B',
  fontSize: '17px'
}

const statsGrid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '18px',
  marginBottom: '24px'
}

const chartsGrid = {
  display: 'grid',
  gridTemplateColumns:
    '1fr 1fr',
  gap: '20px',
  marginBottom: '24px'
}

const card = {
  background: '#FFFFFF',
  borderRadius: '22px',
  padding: '20px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
}

const cardTitle = {
  marginBottom: '20px',
  color: '#0F172A'
}
const tableHeader = {
  marginBottom: '20px'
}

const tableContainer = {
  overflowX: 'auto'
}

const table = {
  width: '100%',
  borderCollapse: 'collapse'
}

const th = {
  textAlign: 'left',
  padding: '14px',
  background: '#F8FAFC',
  color: '#475569',
  fontSize: '14px',
  borderBottom: '1px solid #E2E8F0'
}

const td = {
  padding: '16px 14px',
  borderBottom: '1px solid #E2E8F0',
  color: '#0F172A',
  fontSize: '14px'
}

export default Dashboard