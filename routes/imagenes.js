const express = require('express')
const fs = require('fs')
const path = require('path')
const { verificarTokenImg } = require('../middleware/auth')
let app = express()

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img

    let pathImgGuardada = path.resolve(__dirname, `../uploads/${tipo}/${img}`)
    if (fs.existsSync(pathImgGuardada)) {
        res.sendFile(pathImgGuardada)
    } else {
        let no_img = path.resolve(__dirname, '../server/assets/no-image.jpg')
        res.sendFile(no_img)
    }


})



module.exports = app