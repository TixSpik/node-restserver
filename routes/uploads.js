const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const Usuario = require('../models/usuarioModel')
const Producto = require('../models/productoModel')
const fs = require('fs')
const path = require('path')

app.use(fileUpload());

app.put('/uploads/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos seleccionados'
            }
        })
    }

    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Asegurate que los tipos sean validos: ' + tiposValidos.join(', '),
                tipo: tipo
            }
        })
    }

    let sampleFile = req.files.archivo;
    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg']
    let nombreCortado = sampleFile.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Asegurate que las extensiones sean validas: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //renombrar Archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        // console.log(req)
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });



        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        }

    });

})

const imagenUsuario = (id, res, archivo) => {
    Usuario.findById(id, (err, UsuarioBD) => {
        if (err) {
            borrarArchivo(archivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!UsuarioBD) {
            borrarArchivo(archivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe en la base de datos'
                }
            })
        }

        borrarArchivo(UsuarioBD.img, 'usuarios')

        UsuarioBD.img = archivo

        UsuarioBD.save((err, UsuarioDoc) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: UsuarioDoc,
                img: archivo
            })
        })
    })
}

const imagenProducto = (id, res, archivo) => {
    Producto.findById(id, (err, ProductoBD) => {
        if (err) {
            borrarArchivo(archivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!ProductoBD) {
            borrarArchivo(archivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe en la base de datos'
                }
            })
        }

        borrarArchivo(ProductoBD.img, 'productos')

        ProductoBD.img = archivo

        ProductoBD.save((err, ProductoDoc) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: ProductoDoc,
                img: archivo
            })
        })
    })
}

const borrarArchivo = (nombreImg, tipo) => {
    let pathImg = path.resolve(__dirname, `../uploads/${tipo}/${nombreImg}`)

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}

module.exports = app