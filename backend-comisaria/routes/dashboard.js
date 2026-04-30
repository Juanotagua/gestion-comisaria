const express = require('express')
const router = express.Router()
const pool = require('../db/conexion') 

// casos activos
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
      casos_activos: casosActivos.rows[0].count,
      prioridad_alta: prioridadAlta.rows[0].count,
      funcionarios: funcionarios.rows[0].count
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en dashboard' })
  }
})

module.exports = router