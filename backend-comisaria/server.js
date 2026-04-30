const express = require('express')
const cors = require('cors')

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/casos', require('./routes/casos'))
app.use('/api/dashboard', require('./routes/dashboard')) 
app.use('/api/seguimiento', require('./routes/seguimiento'))

// servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})