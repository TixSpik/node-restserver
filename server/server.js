const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path')

// parse application/x-www-form-urlencoded
require('../config/config')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(require('../routes/index'))

//habilitar Sign In
app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE!!');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto ', process.env.PORT)
})