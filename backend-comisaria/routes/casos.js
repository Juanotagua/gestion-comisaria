const router = require('express').Router()
const PDFDocument = require('pdfkit')
const pool = require('../db/conexion')

/* ==============================
    GENERAR PDF
============================== */

router.get('/:id/pdf', async (req, res) => {

  try {

    const { id } = req.params

    //  OBTENER CASO
    const casoResult = await pool.query(`

      SELECT
        c.numero_radicado,
        c.descripcion_hechos,
        e.nombre_estado,
        p.nombre_prioridad,
        u.nombre AS funcionario

      FROM casos c

      JOIN catalogo_estados_caso e
        ON c.id_estado = e.id_estado

      JOIN catalogo_prioridades p
        ON c.id_prioridad = p.id_prioridad

      LEFT JOIN usuarios u
        ON c.id_usuario_asignado = u.id_usuario

      WHERE c.id_caso = $1

    `, [id])

    if (casoResult.rows.length === 0) {

      return res.status(404).json({
        error: 'Caso no encontrado'
      })

    }

    const caso = casoResult.rows[0]

    //  OBTENER SEGUIMIENTO
    const seguimientoResult = await pool.query(`

      SELECT
        s.descripcion,
        s.fecha_registro,
        u.nombre,
        a.nombre_accion

      FROM seguimiento s

      LEFT JOIN usuarios u
        ON s.id_usuario = u.id_usuario

      LEFT JOIN catalogo_acciones a
        ON s.id_accion = a.id_accion

      WHERE s.id_caso = $1

      ORDER BY s.fecha_registro DESC

    `, [id])

    //  PDF
    const doc = new PDFDocument({
      margin: 50
    })

    // HEADERS
    res.setHeader(
      'Content-Type',
      'application/pdf'
    )

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=informe-caso-${id}.pdf`
    )

    doc.pipe(res)

    //  TÍTULO
    doc
      .fontSize(22)
      .text(
        'COMISARÍA DE FAMILIA',
        {
          align: 'center'
        }
      )

    doc.moveDown()

    doc
      .fontSize(18)
      .text(
        'INFORME DE SEGUIMIENTO',
        {
          align: 'center'
        }
      )

    doc.moveDown(2)

    //  DATOS CASO
    doc
      .fontSize(14)
      .text(
        `Radicado: ${caso.numero_radicado}`
      )

    doc.text(
      `Estado: ${caso.nombre_estado}`
    )

    doc.text(
      `Prioridad: ${caso.nombre_prioridad}`
    )

    doc.text(
      `Funcionario asignado: ${
        caso.funcionario || 'Sin asignar'
      }`
    )

    doc.moveDown()

    doc.text(
      `Descripción: ${caso.descripcion_hechos}`
    )

    doc.moveDown(2)

    //  HISTORIAL
    doc
      .fontSize(16)
      .text('Historial de seguimiento')

    doc.moveDown()

    seguimientoResult.rows.forEach((s) => {

      doc
        .fontSize(12)
        .text(
          `${new Date(
            s.fecha_registro
          ).toLocaleString()}`
        )

      doc.text(
        `Funcionario: ${s.nombre}`
      )

      doc.text(
        `Acción: ${s.nombre_accion}`
      )

      doc.text(
        `Descripción: ${s.descripcion}`
      )

      doc.moveDown()

      doc.moveTo(
        50,
        doc.y
      )
      .lineTo(
        550,
        doc.y
      )
      .stroke()

      doc.moveDown()

    })

    doc.end()

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error generando PDF'
    })

  }

})
/* ==============================
   🔹 GET CASOS
============================== */
router.get('/', async (req, res) => {

  try {

    const { id_usuario, rol } = req.query

    if (!id_usuario || !rol) {
      return res.status(400).json({
        error: 'Faltan parámetros'
      })
    }

    let query = `
      SELECT 
  c.id_caso,
  c.numero_radicado,
  c.id_estado,
  e.nombre_estado,
  p.nombre_prioridad,
  c.descripcion_hechos,

  u.nombre AS usuario_asignado

FROM casos c

JOIN catalogo_estados_caso e
  ON c.id_estado = e.id_estado

JOIN catalogo_prioridades p
  ON c.id_prioridad = p.id_prioridad

LEFT JOIN usuarios u
  ON c.id_usuario_asignado = u.id_usuario
    `

    let values = []

    const rolUpper = rol.toUpperCase()

    // 🔐 CONTROL DE ACCESO
    if (
      rolUpper !== 'COMISARIO' &&
      rolUpper !== 'AUXILIAR'
    ) {

      query += `
        WHERE c.id_usuario_asignado = $1
      `

      values.push(id_usuario)

    }

    query += `
      ORDER BY c.id_caso DESC
    `

    const result = await pool.query(
      query,
      values
    )

    res.json(result.rows)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error al obtener casos'
    })

  }

})


/* ============================== 
   🔹 CREAR CASO
============================== */
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

    // 🔐 VALIDACIONES
    if (
      !numero_radicado ||
      !id_tipo_proceso ||
      !id_estado ||
      !id_prioridad ||
      !descripcion_hechos ||
      !id_usuario_creador
    ) {

      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      })

    }

    // 🔥 AÑO ACTUAL
    const year = new Date().getFullYear()

    // 🔥 RADICADO FINAL
    const radicadoFinal =
      `RAD-${numero_radicado}-${year}`

    // 🔍 VALIDAR DUPLICADOS
    const existeRadicado = await pool.query(
      `
      SELECT *
      FROM casos
      WHERE numero_radicado = $1
      `,
      [radicadoFinal]
    )

    if (existeRadicado.rows.length > 0) {

      return res.status(400).json({
        error: 'El número de radicado ya existe'
      })

    }

    // 🔥 INSERT CASO
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

      VALUES(
        $1,$2,$3,$4,$5,$6,$7
      )

      RETURNING *;
    `,
    [
      radicadoFinal,
      id_tipo_proceso,
      id_estado,
      id_prioridad,
      descripcion_hechos,
      fecha_apertura,
      id_usuario_creador
    ])

    // 🔥 CASO CREADO
    const nuevoCaso = result.rows[0]

    // =========================================
    // 🔥 SEGUIMIENTO AUTOMÁTICO
    // =========================================

    await pool.query(`

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

    `,
    [
      nuevoCaso.id_caso,
      id_usuario_creador,
      1,
      'Caso creado automáticamente'
    ])

    // 🔥 RESPUESTA
    res.status(201).json({
      mensaje: 'Caso creado correctamente',
      caso: nuevoCaso
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error creando caso'
    })

  }

})

/* ==============================
   🔹 REASIGNAR CASO
============================== */
router.put('/:id/reasignar', async (req, res) => {

  try {

    const { id } = req.params

    const {
      id_usuario_asignado,
      rol
    } = req.body

    // 🔐 VALIDACIÓN DE ROL
    if (
      !rol ||
      rol.toUpperCase() !== 'COMISARIO'
    ) {

      return res.status(403).json({
        error: 'No autorizado'
      })

    }

    // 🔐 VALIDAR USUARIO
    if (!id_usuario_asignado) {

      return res.status(400).json({
        error: 'Debe seleccionar un usuario'
      })

    }

    // 🔍 VALIDAR CASO
    const casoExiste = await pool.query(
      `
      SELECT *
      FROM casos
      WHERE id_caso = $1
      `,
      [id]
    )

    if (casoExiste.rows.length === 0) {

      return res.status(404).json({
        error: 'El caso no existe'
      })

    }

    // 🔥 OBTENER NOMBRE USUARIO
    const usuarioAsignado = await pool.query(
      `
      SELECT nombre
      FROM usuarios
      WHERE id_usuario = $1
      `,
      [id_usuario_asignado]
    )

    const nombreUsuario =
      usuarioAsignado.rows[0]?.nombre

    // 🔥 UPDATE
    const result = await pool.query(`
      UPDATE casos
      SET id_usuario_asignado = $1
      WHERE id_caso = $2
      RETURNING *;
    `,
    [
      id_usuario_asignado,
      id
    ])

    // =========================================
    //  SEGUIMIENTO AUTOMÁTICO
    // =========================================

    await pool.query(`

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

    `,
    [
      id,
      id_usuario_asignado,
      3,
      `Caso reasignado a ${nombreUsuario}`
    ])

    // 🔥 RESPUESTA
    res.json({
      mensaje: 'Caso reasignado correctamente',
      caso: result.rows[0]
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error reasignando caso'
    })

  }

})


/* ==============================
    ACTUALIZAR ESTADO
============================== */
router.put('/:id/estado', async (req, res) => {

  try {

    const { id } = req.params
    const { id_estado } = req.body

    // 🔐 VALIDACIÓN
    if (
      !id_estado ||
      isNaN(id_estado)
    ) {

      return res.status(400).json({
        error: 'ID de estado inválido'
      })

    }

    // 🔍 VALIDAR ESTADO
    const estadoExiste = await pool.query(
      `
      SELECT *
      FROM catalogo_estados_caso
      WHERE id_estado = $1
      `,
      [id_estado]
    )

    if (estadoExiste.rows.length === 0) {

      return res.status(400).json({
        error: 'El estado no existe'
      })

    }

    // 🔍 VALIDAR CASO
    const casoExiste = await pool.query(
      `
      SELECT *
      FROM casos
      WHERE id_caso = $1
      `,
      [id]
    )

    if (casoExiste.rows.length === 0) {

      return res.status(404).json({
        error: 'El caso no existe'
      })

    }

    // 🔥 NOMBRE DEL ESTADO
    const nombreEstado =
      estadoExiste.rows[0].nombre_estado

    // 🔥 UPDATE
    const result = await pool.query(`
      UPDATE casos
      SET id_estado = $1
      WHERE id_caso = $2
      RETURNING *;
    `,
    [
      Number(id_estado),
      Number(id)
    ])

    // =========================================
    // 🔥 SEGUIMIENTO AUTOMÁTICO
    // =========================================

    await pool.query(`

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

    `,
    [
      id,
      casoExiste.rows[0].id_usuario_creador,
      2,
      `Estado actualizado a "${nombreEstado}"`
    ])

    // 🔥 RESPUESTA
    res.json({
      mensaje: 'Estado actualizado correctamente',
      caso: result.rows[0]
    })

  } catch (error) {

    console.log('🔥 ERROR COMPLETO:')
    console.log(error)

    res.status(500).json({
      error: 'Error actualizando estado',
      detalle: error.message
    })

  }

})


module.exports = router