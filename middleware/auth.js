
// Middleware de autenticación con JWT
// Importar dependencias 
const jwt = require('jwt-simple');
const moment = require('moment');


// importar calve secreta 
const libjwt = require('../services/jwt');
const secret = libjwt.secret;

// Funcion de autenticacion 
exports.auth = (req, res, next) => {


    //comprobar si llega la cavezera auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'error',
            messages: 'La autorizacion no tiene la cavezera de autenticacion'
        })
    }

    // Limpia el token eliminando comillas y símbolos no deseados
    let token = req.headers.authorization.replace(/['"]+/g, '');


    try {

        let payload = jwt.decode(token, secret);

        //comprobar expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: 'error',
                messages: 'El token ha expirado.'
            })
        }
        //agregar datos al usuario o request
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: 'error',
            messages: 'Token invalido'
        })
    }


    // pasar a la siguiente accion
    next();

}
