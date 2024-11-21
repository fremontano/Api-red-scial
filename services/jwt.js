// Importar dependencias 
const jwt = require('jwt-simple');
const moment = require('moment');
require('dotenv').config();

// Clave secreta 
const secret = process.env.SECRET_KEY;

// Crear funcion para generar tokens
const crearTokens = (user) => {

    const payload = {

        id: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(25, 'days').unix() //fecha de expiracion
    }

    // Devolver jwt codificado 
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    crearTokens
}







//¿Qué es un middleware?
// Un middleware en Node.js(yExpress.js )función que se ejecuta antes de que una solicitud alcance la acción del controlador

// El middleware actúa como una capa intermedia entre la solicitud del cliente y la respuesta
// Intercepción de middleware
// Validar datos.
// Comprobar si el usuario está autenticado.
// Registrador de información de la solicitud.
// Añadir propiedades o datos adicionales al objeto 