import { useEffect, useState } from 'react'
import axios from 'axios'
import Toast from '../components/Toast'

function Usuarios() {

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [casosUsuario, setCasosUsuario] = useState([])

const [mostrarCasos, setMostrarCasos] =useState(false)

const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  const [busqueda, setBusqueda] = useState('')

  const [toast, setToast] = useState('')
  const [toastType, setToastType] =
    useState('success')

  const [mostrarModal, setMostrarModal] =
    useState(false)

  const [nuevoUsuario, setNuevoUsuario] =
    useState({
      nombre: '',
      correo: '',
      password: '',
      id_rol: ''
    })

  /* =========================
     CARGAR DATOS
  ========================= */

  useEffect(() => {

    cargarUsuarios()
    cargarRoles()

  }, [])

  const cargarUsuarios = async () => {

    try {

      const res = await axios.get(
        'http://localhost:3000/api/usuarios'
      )

      setUsuarios(res.data)

    } catch (error) {

      console.error(error)

      mostrarToast(
        'Error cargando usuarios',
        'error'
      )

    }

  }

  const cargarRoles = async () => {

    try {

      const res = await axios.get(
        'http://localhost:3000/api/usuarios/roles'
      )

      setRoles(res.data)

    } catch (error) {

      console.error(error)

    }

  }

  /* =========================
     TOAST
  ========================= */

  const mostrarToast = (
    mensaje,
    tipo = 'success'
  ) => {

    setToast(mensaje)
    setToastType(tipo)

    setTimeout(() => {
      setToast('')
    }, 3000)

  }

  /* =========================
     CREAR USUARIO
  ========================= */

  const crearUsuario = async () => {

    try {

      if (
        !nuevoUsuario.nombre ||
        !nuevoUsuario.correo ||
        !nuevoUsuario.password ||
        !nuevoUsuario.id_rol
      ) {

        mostrarToast(
          'Todos los campos son obligatorios',
          'error'
        )

        return

      }
      const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/

if (
  !passwordRegex.test(
    nuevoUsuario.password
  )
) {

  mostrarToast(
    'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial',
    'error'
  )

  return

}

      await axios.post(
        'http://localhost:3000/api/usuarios',
        nuevoUsuario
      )

      mostrarToast(
        'Usuario creado correctamente',
        'success'
      )

      setMostrarModal(false)

      setNuevoUsuario({
        nombre: '',
        correo: '',
        password: '',
        id_rol: ''
      })

      cargarUsuarios()

    } catch (error) {

      console.error(error)

      mostrarToast(
        error.response?.data?.error ||
        'Error creando usuario',
        'error'
      )

    }

  }
  const verCasosUsuario = async (usuario) => {

  try {

    const res = await axios.get(
      `http://localhost:3000/api/usuarios/${usuario.id_usuario}/casos`
    )

    setCasosUsuario(res.data)

    setUsuarioSeleccionado(usuario)

    setMostrarCasos(true)

  } catch (error) {

    console.error(error)

    mostrarToast(
      'Error obteniendo casos',
      'error'
    )

  }

}

  /* =========================
     FILTRO
  ========================= */

  const usuariosFiltrados =
    usuarios.filter((u) =>

      u.nombre
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )

      ||

      u.correo
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )

    )

  /* =========================
     ESTADÍSTICAS
  ========================= */

  const totalUsuarios =
    usuarios.length

  const comisarios =
    usuarios.filter(
      u => u.nombre_rol === 'COMISARIO'
    ).length

  const auxiliares =
    usuarios.filter(
      u => u.nombre_rol === 'AUXILIAR'
    ).length

  return (

    <div style={container}>

      {/* TOAST */}
      <Toast
        message={toast}
        type={toastType}
      />

      {/* HEADER */}
      <div style={header}>

        <div>

          <h1 style={title}>
            Gestión de Usuarios
          </h1>

          <p style={subtitle}>
            Administración de funcionarios y roles
          </p>

        </div>

        <div style={headerActions}>

          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            style={searchInput}
          />

          {
            (
              usuario?.nombre_rol === 'COMISARIO' ||
              usuario?.nombre_rol === 'ADMIN'
            ) && (

              <button
                style={newUserBtn}
                onClick={() =>
                  setMostrarModal(true)
                }
              >
                Nuevo usuario
              </button>

            )
          }

        </div>

      </div>

      {/* STATS */}
      <div style={statsGrid}>

        <StatCard
          title="Usuarios"
          value={totalUsuarios}
          color="#2563EB"
        />

        <StatCard
          title="Comisarios"
          value={comisarios}
          color="#DC2626"
        />

        <StatCard
          title="Auxiliares"
          value={auxiliares}
          color="#16A34A"
        />

      </div>

      {/* GRID */}
      <div style={grid}>

        {usuariosFiltrados.map((u) => (

          <div
  key={u.id_usuario}
  style={{
    ...card,
    cursor: 'pointer'
  }}

  onClick={() =>
    verCasosUsuario(u)
  }
>

            <div style={topCard}>

              <div style={avatar}>
                {u.nombre.charAt(0)}
              </div>

              <div>

                <h3 style={userName}>
                  {u.nombre}
                </h3>

                <p style={email}>
                  {u.correo}
                </p>

              </div>

            </div>

            <div style={badges}>

              <span
                style={{
                  ...roleBadge,

                  background:
                    u.nombre_rol === 'COMISARIO'
                      ? '#FEE2E2'
                      : '#DBEAFE',

                  color:
                    u.nombre_rol === 'COMISARIO'
                      ? '#DC2626'
                      : '#2563EB'
                }}
              >
                {u.nombre_rol}
              </span>

              <span style={activeBadge}>
                Activo
              </span>

            </div>

          </div>

        ))}

      </div>

      {/* =========================
          MODAL CREAR USUARIO
      ========================= */}

      {
        mostrarModal && (

          <div style={overlay}>

            <div style={modal}>

              <div style={modalHeader}>

                <div>

                  <h2 style={modalTitle}>
                    Nuevo Usuario
                  </h2>

                  <p style={modalSubtitle}>
                    Registro de funcionarios
                  </p>

                </div>

                <button
                  style={closeBtn}
                  onClick={() =>
                    setMostrarModal(false)
                  }
                >
                  ✕
                </button>

              </div>

              <div style={modalForm}>

                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={nuevoUsuario.nombre}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      nombre: e.target.value
                    })
                  }
                  style={modalInput}
                />

                <input
                  type="email"
                  placeholder="Correo"
                  value={nuevoUsuario.correo}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      correo: e.target.value
                    })
                  }
                  style={modalInput}
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={nuevoUsuario.password}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      password: e.target.value
                    })
                  }
                  style={modalInput}
                />
                <p style={passwordHint}>
                Debe contener:
                mínimo 8 caracteres,
                mayúscula,
                número
                y carácter especial
                </p>

                <select
                  value={nuevoUsuario.id_rol}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      id_rol: e.target.value
                    })
                  }
                  style={modalInput}
                >

                  <option value="">
                    Seleccione rol
                  </option>

                  {
                    roles.map((r) => (

                      <option
                        key={r.id_rol}
                        value={r.id_rol}
                      >
                        {r.nombre_rol}
                      </option>

                    ))
                  }

                </select>

                <button
                  style={saveBtn}
                  onClick={crearUsuario}
                >
                  Guardar usuario
                </button>

              </div>

            </div>

          </div>

        )
      }
      {
  mostrarCasos && (

    <div style={overlay}>

      <div style={casesModal}>

        <div style={modalHeader}>

          <div>

            <h2 style={modalTitle}>
              Casos asignados
            </h2>

            <p style={modalSubtitle}>
              {usuarioSeleccionado?.nombre}
            </p>

          </div>

          <button
            style={closeBtn}
            onClick={() =>
              setMostrarCasos(false)
            }
          >
            ✕
          </button>

        </div>

        <div style={casesContainer}>

          {
            casosUsuario.length === 0 && (

              <p style={{
                color: '#64748B'
              }}>
                Este usuario no tiene casos asignados
              </p>

            )
          }

          {
            casosUsuario.map((c) => (

              <div
                key={c.id_caso}
                style={caseCard}
              >

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>

                  <h3 style={{
                    margin: 0,
                    color: '#0F172A'
                  }}>
                    {c.numero_radicado}
                  </h3>

                  <span style={{
                    fontSize: '12px',
                    background: '#DBEAFE',
                    color: '#2563EB',
                    padding: '6px 10px',
                    borderRadius: '999px'
                  }}>
                    {c.nombre_estado}
                  </span>

                </div>

                <p style={{
                  color: '#64748B',
                  marginTop: '12px',
                  lineHeight: '1.5'
                }}>
                  {c.descripcion_hechos}
                </p>

                <div style={{
                  marginTop: '14px'
                }}>

                  <span style={{
                    background:
                      c.nombre_prioridad === 'Alta'
                        ? '#FEE2E2'
                        : c.nombre_prioridad === 'Media'
                        ? '#FEF3C7'
                        : '#DCFCE7',

                    color:
                      c.nombre_prioridad === 'Alta'
                        ? '#DC2626'
                        : c.nombre_prioridad === 'Media'
                        ? '#B45309'
                        : '#15803D',

                    padding: '7px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Prioridad {c.nombre_prioridad}
                  </span>

                </div>

              </div>

            ))
          }

        </div>

      </div>

    </div>

  )
}

    </div>

  )

}

/* =========================
   COMPONENTES
========================= */

function StatCard({
  title,
  value,
  color
}) {

  return (

    <div style={statCard}>

      <div
        style={{
          ...statCircle,
          background: color
        }}
      />

      <p style={statTitle}>
        {title}
      </p>

      <h2
        style={{
          ...statNumber,
          color
        }}
      >
        {value}
      </h2>

    </div>

  )

}

/* =========================
   ESTILOS
========================= */
const casesModal = {
  width: '700px',
  maxHeight: '85vh',
  overflowY: 'auto',
  background: 'white',
  borderRadius: '24px',
  padding: '30px',
  boxShadow:
    '0 20px 40px rgba(0,0,0,0.18)'
}

const casesContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  marginTop: '25px'
}

const caseCard = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '18px',
  padding: '20px'
}

const container = {
  padding: '35px',
  background: '#F8FAFC',
  minHeight: '100vh'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  gap: '20px',
  flexWrap: 'wrap'
}

const headerActions = {
  display: 'flex',
  gap: '14px',
  alignItems: 'center'
}

const title = {
  margin: 0,
  fontSize: '36px',
  color: '#0F172A'
}

const subtitle = {
  marginTop: '10px',
  color: '#64748B'
}

const searchInput = {
  padding: '14px 18px',
  borderRadius: '14px',
  border: '1px solid #CBD5E1',
  minWidth: '280px',
  outline: 'none',
  fontSize: '14px'
}

const newUserBtn = {
  padding: '14px 18px',
  border: 'none',
  borderRadius: '14px',
  background: '#2563EB',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer'
}

const statsGrid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
}

const statCard = {
  background: 'white',
  padding: '24px',
  borderRadius: '20px',
  border: '1px solid #E2E8F0',
  boxShadow:
    '0 4px 14px rgba(0,0,0,0.05)'
}

const statCircle = {
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  marginBottom: '18px'
}

const statTitle = {
  color: '#64748B',
  fontWeight: '600'
}

const statNumber = {
  fontSize: '36px',
  marginTop: '10px'
}

const grid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '22px'
}

const card = {
  background: 'white',
  padding: '24px',
  borderRadius: '22px',
  border: '1px solid #E2E8F0',
  boxShadow:
    '0 4px 14px rgba(0,0,0,0.05)'
}

const topCard = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
}

const avatar = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background:
    'linear-gradient(135deg, #0F172A, #1E293B)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: '700'
}
const passwordHint = {
  fontSize: '12px',
  color: '#64748B',
  marginTop: '-8px',
  lineHeight: '1.5'
}

const userName = {
  margin: 0,
  color: '#0F172A'
}

const email = {
  marginTop: '6px',
  color: '#64748B',
  fontSize: '14px'
}

const badges = {
  display: 'flex',
  gap: '10px',
  marginTop: '24px',
  flexWrap: 'wrap'
}

const roleBadge = {
  padding: '8px 14px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: '600'
}

const activeBadge = {
  padding: '8px 14px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: '600',
  background: '#DCFCE7',
  color: '#15803D'
}

/* MODAL */

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999
}

const modal = {
  maxHeight: '90vh',
overflowY: 'auto',
  width: '450px',
  background: 'white',
  borderRadius: '24px',
  padding: '30px',
  boxShadow:
    '0 20px 40px rgba(0,0,0,0.18)'
}

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
}

const modalTitle = {
  margin: 0,
  color: '#0F172A'
}

const modalSubtitle = {
  marginTop: '8px',
  color: '#64748B'
}

const closeBtn = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: 'none',
  background: '#F1F5F9',
  cursor: 'pointer'
}

const modalForm = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}

const modalInput = {
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid #CBD5E1',
  outline: 'none'
}

const saveBtn = {
  padding: '14px',
  borderRadius: '14px',
  border: 'none',
  background: '#2563EB',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer'
}

export default Usuarios