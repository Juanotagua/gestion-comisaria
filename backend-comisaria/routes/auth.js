const router = require('express').Router()
const pool = require('../db/conexion')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

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
/* =========================
   EMAIL
========================= */

const transporter = nodemailer.createTransport({

  host: 'smtp.gmail.com',

  port: 465,

  secure: true,

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS

  }

})

/* =========================
   FORGOT PASSWORD
========================= */

router.post(
  '/forgot-password',
  async (req, res) => {

    try {

      const { correo } = req.body

      const resultado =
        await pool.query(`
          SELECT *
          FROM usuarios
          WHERE correo = $1
        `, [correo])

      if (
        resultado.rows.length === 0
      ) {

        return res.status(404).json({
          error:
            'Correo no encontrado'
        })

      }

      const token = crypto
        .randomBytes(32)
        .toString('hex')

      const expiracion =
        new Date(
          Date.now() + 3600000
        )

      await pool.query(`
        UPDATE usuarios
        SET
          reset_token = $1,
          reset_token_expira = $2
        WHERE correo = $3
      `, [
        token,
        expiracion,
        correo
      ])

      const link =
`http://localhost:5173/reset-password/${token}`

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to: correo,

        subject:
          'Recuperación de contraseña',

        html: `
          <h2>
            Recuperación de contraseña
          </h2>

          <p>
            Haz clic en el enlace:
          </p>

          <a href="${link}">
            Restablecer contraseña
          </a>
        `

      })

      res.json({
        mensaje:
          'Correo enviado correctamente'
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error:
          'Error recuperando contraseña'
      })

    }

})

/* =========================
   RESET PASSWORD
========================= */

router.post(
  '/reset-password/:token',

  async (req, res) => {

    try {

      const { token } = req.params

      const { password } = req.body

      const resultado =
        await pool.query(`
          SELECT *
          FROM usuarios
          WHERE reset_token = $1
        `, [token])

      if (
        resultado.rows.length === 0
      ) {

        return res.status(400).json({
          error: 'Token inválido'
        })

      }

      const usuario =
        resultado.rows[0]

      if (
        new Date(
          usuario.reset_token_expira
        ) < new Date()
      ) {

        return res.status(400).json({
          error: 'Token expirado'
        })

      }

      const hash =
        await bcrypt.hash(password, 10)

      await pool.query(`
        UPDATE usuarios
        SET
          password_hash = $1,
          reset_token = NULL,
          reset_token_expira = NULL
        WHERE id_usuario = $2
      `, [
        hash,
        usuario.id_usuario
      ])

      res.json({
        mensaje:
          'Contraseña actualizada'
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        error:
          'Error cambiando contraseña'
      })

    }

})

module.exports = router