import { useEffect, useState } from 'react'
import axios from 'axios'

function Usuarios() {

  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/usuarios')
      .then(res => setUsuarios(res.data))
  }, [])

  return (
    <div style={container}>
      <h1 style={title}>👥 Usuarios</h1>

      <div style={grid}>
        {usuarios.map(u => (
          <div key={u.id_usuario} style={card}>
            <h3>{u.nombre}</h3>
            <p>{u.correo}</p>
            <span style={badge}>{u.nombre_rol}</span>
          </div>
        ))}
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px'
}

const card = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
}

const badge = {
  display: 'inline-block',
  marginTop: '10px',
  padding: '5px 10px',
  background: '#3b82f6',
  color: 'white',
  borderRadius: '6px',
  fontSize: '12px'
}

export default Usuarios