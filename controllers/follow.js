// Importar modelo 
const Follow = require('../models/follow');
const User = require('../models/user');

//Librerias

//Acciones
const followTest = (req, res) => {
    return res.status(200).send({
        message: 'Test follow'
    });
};


//Accion de guardar un follow, seguir un usuario
const save = async (req, res) => {
    try {
        // Obtener datos del body 
        const params = req.body;

        // Obtener id del usuario identificado 
        const identified = req.user;

        // Verificar si ya existe una relacion de follow entre el usuario identificado y el usuario a seguir
        const existingFollow = await Follow.findOne({
            user: identified.id,
            followed: params.followed
        });

        // Si ya existe un follow, devolver un mensaje de error
        if (existingFollow) {
            return res.status(400).send({
                status: 'error',
                message: 'Ya estás siguiendo a este usuario'
            });
        }

        // Crear objeto con modelo a seguir usuario
        const userToFollow = new Follow({
            user: identified.id,
            followed: params.followed
        });

        // Guardar objeto en la base de datos 
        const followStorage = await userToFollow.save();

        return res.status(200).send({
            message: 'Has seguido al usuario',
            user: req.user,
            followStorage
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al seguir usuario',
            error
        });
    }
};



//Accion de borrar un follow, dejar de seguir usario
const unfollowing = async (req, res) => {

    try {
        // Usuario identificado
        const identifiedUser = req.user.id;
        // Usuario a dejar de seguir
        const followeId = req.params.id;

        //si esta sigue usuario
        const follow = await Follow.findOne({
            'user': identifiedUser,
            'followed': followeId
        })

        if (!follow) {
            return res.status(404).send({
                message: "No estás siguiendo a este usuario"
            });
        }

        // Encontrar la coincidencia y eliminar 
        const result = await Follow.deleteOne({
            'user': identifiedUser,
            'followed': followeId
        });

        if (result.deletedCount === 0) {
            return res.status(500).send({
                message: "No se pudo eliminar el follow"
            });
        }

        return res.status(200).send({
            message: "Has dejado de seguir al usuario",
            result
        });

    } catch (error) {
        return res.status(500).send({
            message: "Error al dejar de seguir al usuario",
            error
        });
    }

}


//Accion listado de usarios que estoy siguiendo
const following = async (req, res) => {

    try {
        // Obtener el id del usuario identificado
        const identifiedUser = req.user.id;
        // Comprobar si llega el id por el parametro URL
        const followedId = req.params.id;

        if (!followedId) {
            return res.status(400).send({
                status: 'error',
                message: 'No se ha proporcionado el ID del usuario a seguir'
            });
        }

        // Establecer la cantidad de usuarios por pagina
        const limit = 5;
        const page = req.query.page || 1;


        // Consultar la base de datos para obtener los usuarios que sigue
        const follows = await Follow.find({ user: identifiedUser })
            .limit(limit)
            .skip((page - 1) * limit)
            .populate('followed', 'user');


        return res.status(200).send({
            message: 'Usuarios que sigues',
            follows
        });

    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al listar usuarios que sigues',
            error
        });
    }

    // Obtener arrays de usuarios a seguir y los que me siguen 





    return res.status(200).send({
        message: 'Accion usuario a seguir'
    });
}


//Accion listado de usuarios que me siguen








// Exportar acciones
module.exports = {
    followTest,
    save,
    unfollowing,
    following
};
