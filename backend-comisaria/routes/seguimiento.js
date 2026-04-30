const router = require('express').Router()
const db = require('../db/conexion')

// 🔥 GET seguimiento por caso
router.get('/:idCaso', async (req, res) => {
  try {
    const { idCaso } = req.params

    const result = await db.query(`
      SELECT 
        s.id_seguimiento,
        s.descripcion,
        s.fecha_registro,
        u.nombre,
        a.nombre_accion
      FROM seguimiento s
      LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
      LEFT JOIN catalogo_acciones a ON s.id_accion = a.id_accion
      WHERE s.id_caso = $1
      ORDER BY s.fecha_registro DESC
    `, [idCaso])

    res.json(result.rows)

  } catch (error) {
    console.error("🔥 ERROR REAL:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router