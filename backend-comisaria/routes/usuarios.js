const router = require('express').Router()
const pool = require('../db/conexion')

// 🔹 GET usuarios con rol
router.get('/', async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        r.nombre_rol
      FROM usuarios u
      JOIN catalogo_roles_usuario r 
        ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario
    `)

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error obteniendo usuarios' })
  }
})

module.exports = router