const router = require('express').Router()
const pool = require('../db/conexion')

// 🔹 GET casos
router.get('/', async (req, res) => {
  try {

    const { id_usuario, rol } = req.query

    let query = `
      SELECT 
        c.id_caso,
        c.numero_radicado,
        e.nombre_estado,
        p.nombre_prioridad,
        c.descripcion_hechos
      FROM casos c
      JOIN catalogo_estados_caso e ON c.id_estado = e.id_estado
      JOIN catalogo_prioridades p ON c.id_prioridad = p.id_prioridad
    `

    let values = []
const rolUpper = rol?.toUpperCase()

if (
  rolUpper !== 'COMISARIO' &&
  rolUpper !== 'AUXILIAR'
) {
  query += ` WHERE c.id_usuario_asignado = $1`
  values.push(id_usuario)
}
    query += ` ORDER BY c.id_caso DESC`

    const result = await pool.query(query, values)

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener casos' })
  }
})
// 🔹 CREAR caso
router.post('/', async (req, res) => {
  try {

    const {
      numero_radicado,
      id_tipo_proceso,
      id_estado,
      id_prioridad,
      descripcion_hechos,
      fecha_apertura,
      id_usuario_creador
    } = req.body

    const result = await pool.query(`
      INSERT INTO casos(
        numero_radicado,
        id_tipo_proceso,
        id_estado,
        id_prioridad,
        descripcion_hechos,
        fecha_apertura,
        id_usuario_creador
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `,
    [
      numero_radicado,
      id_tipo_proceso,
      id_estado,
      id_prioridad,
      descripcion_hechos,
      fecha_apertura,
      id_usuario_creador
    ])

    res.status(201).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creando caso' })
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