const express = require('express')
const router = express.Router()
const pool = require('../db/conexion')

// 🔹 RESUMEN
router.get('/resumen', async (req, res) => {
  try {
    const casosActivos = await pool.query(`
      SELECT COUNT(*) FROM casos WHERE id_estado = 1
    `)

    const prioridadAlta = await pool.query(`
      SELECT COUNT(*) FROM casos WHERE id_prioridad = 3
    `)

    const funcionarios = await pool.query(`
      SELECT COUNT(*) FROM usuarios
    `)

    res.json({
      casos_activos: Number(casosActivos.rows[0].count),
      prioridad_alta: Number(prioridadAlta.rows[0].count),
      funcionarios: Number(funcionarios.rows[0].count)
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en dashboard' })
  }
})

// 🔹 CASOS POR PRIORIDAD
router.get('/por-prioridad', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nombre_prioridad, COUNT(*) as total
      FROM casos c
      JOIN catalogo_prioridades p ON c.id_prioridad = p.id_prioridad
      GROUP BY p.nombre_prioridad
      ORDER BY total DESC
    `)

    // convierto a number
    const data = result.rows.map(r => ({
      nombre_prioridad: r.nombre_prioridad,
      total: Number(r.total)
    }))

    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error prioridad' })
  }
})

// 🔹 CASOS POR ESTADO
router.get('/por-estado', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.nombre_estado, COUNT(*) as total
      FROM casos c
      JOIN catalogo_estados_caso e ON c.id_estado = e.id_estado
      GROUP BY e.nombre_estado
      ORDER BY total DESC
    `)

    const data = result.rows.map(r => ({
      nombre_estado: r.nombre_estado,
      total: Number(r.total)
    }))

    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error estado' })
  }
})

// 🔹 TOP USUARIOS (más casos asignados)
router.get('/top-usuarios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.nombre, COUNT(c.id_caso) as total
      FROM casos c
      JOIN usuarios u ON c.id_usuario_asignado = u.id_usuario
      GROUP BY u.nombre
      ORDER BY total DESC
      LIMIT 5
    `)

    const data = result.rows.map(r => ({
      nombre: r.nombre,
      total: Number(r.total)
    }))

    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error top usuarios' })
  }
})
// 🔹 ACTIVIDAD RECIENTE
router.get('/actividad-reciente', async (req, res) => {

  try {

    const result = await pool.query(`

      SELECT
        s.id_seguimiento,
        s.descripcion,
        s.fecha_registro,
        c.numero_radicado,
        u.nombre
      FROM seguimiento s

      JOIN casos c
        ON s.id_caso = c.id_caso

      LEFT JOIN usuarios u
        ON s.id_usuario = u.id_usuario

      ORDER BY s.fecha_registro DESC

      LIMIT 8

    `)

    res.json(result.rows)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Error actividad reciente'
    })

  }

})

module.exports = router