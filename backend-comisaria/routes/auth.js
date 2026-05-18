const router = require('express').Router()
const pool = require('../db/conexion')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const { Resend } = require('resend')

const resend = new Resend(
  process.env.RESEND_API_KEY
)

/* =========================
   LOGIN
========================= */

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

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password_hash
      )

    if (!passwordCorrecta) {

      return res.status(401).json({
        error: 'Contraseña incorrecta'
      })

    }

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

      const usuario =
        resultado.rows[0]

      const token = crypto
        .randomBytes(32)
        .toString('hex')

      const expiracion =
        new Date(
          Date.now() + 1000 * 60 * 30
        )

      await pool.query(`

        UPDATE usuarios

        SET
          reset_token = $1,
          reset_token_expira = $2

        WHERE id_usuario = $3

      `, [
        token,
        expiracion,
        usuario.id_usuario
      ])

      const link =
`${process.env.FRONTEND_URL}/reset-password/${token}`

      const data =
  await resend.emails.send({

        from:
          'Comisaría <onboarding@resend.dev>',

        to: correo,

        subject:
          'Recuperación de contraseña',

        html: `

          <div style="
            font-family: Arial;
            padding: 30px;
          ">

            <h2>
              Recuperación de contraseña
            </h2>

            <p>
              Haz clic en el botón:
            </p>

            <a
              href="${link}"

              style="
                background:#8B1E2D;
                color:white;
                padding:14px 22px;
                border-radius:10px;
                text-decoration:none;
                display:inline-block;
                margin-top:15px;
              "
            >
              Restablecer contraseña
            </a>

            <p style="
              margin-top:25px;
              color:#64748B;
            ">
              Este enlace expira en 30 minutos.
            </p>

          </div>

        `

      })
      console.log(' RESPUESTA RESEND:')
console.log(data)

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