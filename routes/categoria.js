const express = require('express')
const Categoria = require('../models/categoriaModel')
const _ = require('underscore')
const { verificarToken, verificarADMIN_ROLE } = require('../middleware/auth')
const app = express()

//traer todas las categorias
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, CatID) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                categoria: CatID
            })

        })


})

//Mostrar una categoria por ID
app.get('/categoria/:id', verificarToken, (req, res) => {
    let categoriaId = req.params.id

    Categoria.findById({ _id: categoriaId }, (err, CatID) => {
        if (!CatID) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria con ese ID'
                }
            })
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: CatID
        })
    })

})

//Crear nueva Categoria
app.post('/categoria', [verificarToken, verificarADMIN_ROLE], (req, res) => {
    let body = req.body
    let usuarioID = req.usuario._id
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioID
    })

    categoria.save((err, CatDocument) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error del documento'
                }
            })
        }

        if (!CatDocument) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'la categoia presenta un error'
                }
            })
        }

        res.json({
            ok: true,
            categoria: CatDocument
        })
    })
})

//Actualizar Categoria por ID
app.put('/categoria/:id', [verificarToken, verificarADMIN_ROLE], (req, res) => {
    let id = req.params.id

    let body = _.pick(req.body, ['descripcion'])

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, CatUpdated) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: CatUpdated
        })
    })
})

//Borrar Categoria
app.delete('/categoria/:id', [verificarToken, verificarADMIN_ROLE], (req, res) => {
    let id = req.params.id

    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndRemove(id, (err, CategoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!CategoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    massage: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: CategoriaBorrada
        })
    })
})

module.exports = app