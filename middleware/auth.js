const jwt = require('jsonwebtoken')

// VERIFICAR TOKEN

let verificarToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}


let verificarADMIN_ROLE = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos necesarios'
            }
        })
    }

    next()

}

let verificarTokenImg = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

module.exports = {
    verificarToken,
    verificarADMIN_ROLE,
    verificarTokenImg
}