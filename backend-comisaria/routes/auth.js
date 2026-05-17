const router = require('express').Router()
const pool = require('../db/conexion')
const bcrypt = require('bcrypt')

router.post('/login', async (req, res) => {

  try {

    const { correo, password } = req.body

    const resultado = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.password_hash,
        u.id_rol,
        r.nombre_rol

      FROM usuarios u

      JOIN catalogo_roles_usuario r 
        ON u.id_rol = r.id_rol

      WHERE u.correo = $1
    `, [correo])

    if (resultado.rows.length === 0) {

      return res.status(401).json({
        error: 'Usuario no existe'
      })

    }

    const usuario = resultado.rows[0]
console.log(password)
console.log(usuario.password_hash)

const passwordCorrecta =
  await bcrypt.compare(
    password,
    usuario.password_hash
  )

console.log(passwordCorrecta)
   

    if (!passwordCorrecta) {

      return res.status(401).json({
        error: 'Contraseña incorrecta'
      })

    }

    // 🔥 NO ENVIAR HASH
    delete usuario.password_hash

    res.json({
      mensaje: 'Login correcto',
      usuario
    })

  } catch (error) {

    console.error(
      '🔥 ERROR LOGIN:',
      error
    )

    res.status(500).json({
      error: error.message
    })

  }

})

module.exports = router