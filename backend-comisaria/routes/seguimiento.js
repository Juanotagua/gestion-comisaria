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
/* =========================
   CREAR COMENTARIO
========================= */

router.post('/', async (req, res) => {

  try {

    const {
      id_caso,
      id_usuario,
      descripcion
    } = req.body

    if (
      !id_caso ||
      !id_usuario ||
      !descripcion
    ) {

      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      })

    }

    // 🔥 ACCIÓN COMENTARIO
    const id_accion = 4

    const result = await db.query(`

      INSERT INTO seguimiento(
        id_caso,
        id_usuario,
        id_accion,
        descripcion,
        fecha_registro
      )

      VALUES(
        $1,
        $2,
        $3,
        $4,
        NOW()
      )

      RETURNING *

    `, [
      id_caso,
      id_usuario,
      id_accion,
      descripcion
    ])

    res.status(201).json({
      mensaje: 'Comentario agregado',
      seguimiento: result.rows[0]
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error agregando comentario'
    }) 

  }

})

module.exports = router