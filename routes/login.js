const express = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuarioModel')
var jwt = require('jsonwebtoken');
const app = express()

app.post('/login', (req, res) => {


    let body = req.body


    if (!body.password || !body.email) {
        return res.json({
            ok: false,
            err: {
                message: 'no hay contraseña o email'
            }
        })
    }
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(USUARIO) no encontrado'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Contraseña) incorrecta'
                }
            })
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })


})


module.exports = app