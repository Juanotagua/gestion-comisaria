const router = require('express').Router()
const pool = require('../db/conexion')

// 🔹 GET casos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id_caso,
        c.numero_radicado,
        e.nombre_estado,
        p.nombre_prioridad,
        c.descripcion_hechos
      FROM casos c
      JOIN catalogo_estados_caso e ON c.id_estado = e.id_estado
      JOIN catalogo_prioridades p ON c.id_prioridad = p.id_prioridad
      ORDER BY c.id_caso DESC
    `)

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener casos' })
  }
})

// 🔹 REASIGNAR
router.put('/:id/reasignar', async (req, res) => {
  try {
    const { id } = req.params
    const { id_usuario_asignado } = req.body
    const result = await pool.query(`
      UPDATE casos
      SET id_usuario_asignado=$1
      WHERE id_caso=$2
      RETURNING *;
    `, [id_usuario_asignado, id])

    res.json({
      mensaje: 'Caso reasignado correctamente',
      caso: result.rows[0]
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error reasignando caso' })
  }
})

module.exports = router