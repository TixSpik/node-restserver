const express = require('express')
const app = express()

app.use(require('../routes/usuario'))
app.use(require('../routes/login'))
app.use(require('../routes/categoria'))
app.use(require('../routes/producto'))
app.use(require('../routes/uploads'))
app.use(require('../routes/imagenes'))

module.exports = app