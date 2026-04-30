const router = require('express').Router()
const pool = require('../db/conexion')

// 🔹 tipos de proceso
router.get('/tipos-proceso', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catalogo_tipos_proceso')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error obteniendo tipos de proceso' })
  }
})

// 🔹 estados
router.get('/estados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catalogo_estados_caso')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error obteniendo estados' })
  }
})

// 🔹 prioridades
router.get('/prioridades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catalogo_prioridades')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error obteniendo prioridades' })
  }
})

module.exports = router