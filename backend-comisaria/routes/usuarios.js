const router = require('express').Router()
const pool = require('../db/conexion')
const bcrypt = require('bcrypt')

/* =========================
   GET USUARIOS
========================= */



router.get('/', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.estado,
        r.nombre_rol,
        r.id_rol
      FROM usuarios u

      JOIN catalogo_roles_usuario r
        ON u.id_rol = r.id_rol

      ORDER BY u.id_usuario
    `)

    res.json(result.rows)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error obteniendo usuarios'
    })

  }

})

/* =========================
   GET ROLES
========================= */

router.get('/roles', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM catalogo_roles_usuario
      ORDER BY id_rol
    `)

    res.json(result.rows)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error obteniendo roles'
    })

  }

})

/* =========================
   CREAR USUARIO
========================= */

router.post('/', async (req, res) => {

  try {

    const {
      nombre,
      correo,
      password,
      id_rol
    } = req.body

    // VALIDACIONES
    if (
      !nombre ||
      !correo ||
      !password ||
      !id_rol
    ) {

      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      })

    }

    // VERIFICAR SI YA EXISTE
    const usuarioExiste = await pool.query(`
      SELECT *
      FROM usuarios
      WHERE correo = $1
    `, [correo])

    if (usuarioExiste.rows.length > 0) {

      return res.status(400).json({
        error: 'El correo ya está registrado'
      })

    }
    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/

if (!passwordRegex.test(password)) {

  return res.status(400).json({
    error:
      'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial'
  })

}

    // HASH PASSWORD
    const password_hash =
      await bcrypt.hash(password, 10)

    // INSERT
    const result = await pool.query(`
      INSERT INTO usuarios(
        nombre,
        correo,
        password_hash,
        id_rol,
        estado,
        fecha_creacion
      )

      VALUES(
        $1,
        $2,
        $3,
        $4,
        true,
        NOW()
      )

      RETURNING
        id_usuario,
        nombre,
        correo,
        id_rol
    `,
    [
      nombre,
      correo,
      password_hash,
      id_rol
    ])

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: result.rows[0]
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error creando usuario'
    })

  }

})
/* =========================
   CASOS POR USUARIO
========================= */

router.get('/:id/casos', async (req, res) => {

  try {

    const { id } = req.params

    const result = await pool.query(`
      SELECT
        c.id_caso,
  c.numero_radicado,
  c.descripcion_hechos,
  e.nombre_estado,
  p.nombre_prioridad,
  u.nombre AS usuario_asignado

      FROM casos c

      JOIN catalogo_estados_caso e
        ON c.id_estado = e.id_estado

      JOIN catalogo_prioridades p
        ON c.id_prioridad = p.id_prioridad

      JOIN usuarios u
  ON c.id_usuario_asignado = u.id_usuario

      WHERE c.id_usuario_asignado = $1

      ORDER BY c.id_caso DESC
    `, [id])

    res.json(result.rows)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error obteniendo casos'
    })

  }

})

module.exports = router