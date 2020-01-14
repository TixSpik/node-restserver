const express = require('express')
const Producto = require('../models/productoModel')
const _ = require('underscore')
const { verificarToken, verificarADMIN_ROLE } = require('../middleware/auth')
const app = express()

//traer todas las productos

app.get('/producto', verificarToken, (req, res) => {

    Producto.find({})
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email role')
        .exec((err, ProdDoc) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                producto: ProdDoc
            })

        })

})

//Mostrar un producto por ID
app.get('/producto/:id', verificarToken, (req, res) => {
    let productoID = req.params.id


    Producto.find({ _id: productoID })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email role')
        .exec((err, ProdDoc) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!ProdDoc) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto con ese ID'
                    }
                })
            }

            return res.json({
                ok: true,
                producto: ProdDoc
            })

        })

})

//Crear nuevo Producto

app.post('/producto', [verificarToken, verificarADMIN_ROLE], (req, res) => {
    let body = req.body
    let usuarioID = req.usuario._id
    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: usuarioID,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria
    })

    producto.save((err, ProdDoc) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: ProdDoc
        })
    })
})

//Actualizar Categoria por ID
app.put('/producto/:id', [verificarToken, verificarADMIN_ROLE], (req, res) => {
    let id = req.params.id
    //los campos del producto que puedo actualizar
    let body = _.pick(req.body, ['nombre', 'descripcion', 'usuario', 'precioUni', 'disponible', 'categoria'])

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, ProdDuc) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: ProdDuc
        })
    })
})

//Borrar Producto
app.delete('/producto/:id', [verificarToken, verificarADMIN_ROLE], (req, res) => {
    let id = req.params.id

    let body = _.pick(req.body, ['descripcion', 'nombre']);

    Producto.findByIdAndRemove(id, (err, ProductoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!ProductoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    massage: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: ProductoBorrado
        })
    })
})

//busqueda 
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino
    let regEx = new RegExp(termino, 'i')

    Producto.find({ nombre: regEx })
        .populate('categoria', 'descripcion')
        .exec((err, productoDescripcion) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (productoDescripcion.length === 0) {
                return res.json({
                    ok: false,
                    producto: {
                        message: 'No hay productos con ese termino'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDescripcion
            })

        })
})


module.exports = app