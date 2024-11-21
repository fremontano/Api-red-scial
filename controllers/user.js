// Importar dependencias y modulos
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('../services/jwt');
const fs = require('fs'); // para las imaganes
const path = require('path'); // acceso a una libreia de objeto



// Método de prueba
const test = (req, res) => {

    return res.status(200).send({
        status: 'succes',
        messages: 'TEST USUARIO',
        user: req.user
    })

}





// Metodo para registrar usuarios
const register = async (req, res) => {
    // Recoger datos de la petición
    const { name, surname, nickname, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!name || !surname || !nickname || !email || !password) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios.',
        });
    }

    // Verificar si el usuario ya existe email o nickname
    try {
        const existingUsers = await User.find({
            $or: [
                { email: email.toLowerCase() },
                { nickname: nickname.toLowerCase() }
            ]
        });

        if (existingUsers.length > 0) {
            return res.status(400).json({
                status: 'success',
                message: 'El usuario ya existe.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al verificar usuarios existentes.',
        });
    }

    // Cifrar la contraseña
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear un nuevo usuario con la contraseña cifrada
        const newUser = new User({
            name,
            surname,
            nickname,
            email: email.toLowerCase(),
            password: hashedPassword //asignamos el valor de la contraseña ya cifrada
        });

        // Guardar usuario en la base de datos
        await newUser.save();

        // Devolver respuesta exitosa
        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado con éxito.',
            user: newUser,
        });
    } catch (hashError) {
        console.error(hashError);
        return res.status(500).json({
            status: 'error',
            message: 'Error al cifrar la contraseña o guardar el usuario.',
        });
    }
};



const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: 'error', message: 'Email y contraseña son requeridos' });
    }

    try {

        //verificvar el email del usuario
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ status: 'error', message: 'No se encontró el usuario en la base de datos' });
        }

        //verificar contraseña
        let paswwordIsValid = bcrypt.compareSync(password, user.password);
        if (!paswwordIsValid) {
            return res.status(400).send({ status: 'error', message: 'Contraseña o usuario incorrecta' });

        }

        //devolver el token
        const token = jwt.crearTokens(user);


        // Si el usuario es encontrado, devolver sus datos
        return res.status(200).send({
            status: 'success',
            message: 'Usuario encontrado',
            user: {
                id: user._id,
                name: user.name,
                nickname: user.nickname
            },
            token
        })

    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).send({ status: 'error', message: 'Error en la consulta de la base de datos' });
    }

};


//Datos del perfil
const profile = async (req, res) => {

    try {
        // Recibir los parametros por la url 
        const id = req.params.id;

        // Consulatra para obtnere los datos del usuario
        const userProfile = await User.findById(id).select('-password -role');

        if (!userProfile) {
            return res.status(404).send({
                status: 'error',
                messages: 'El usuario no existe o es incorrecto'
            });
        }

        //Devolver el resultado
        return res.status(200).json({
            status: 'succes',
            user: userProfile
        })

    } catch (error) {
        // Manejo de errores
        return res.status(500).send({
            status: 'error',
            message: 'Error en el servidor',
        });
    }
}


//Lista de usuarios
const list = async (req, res) => {
    try {
        // Extraer y validar  pagina por parametro, parsearla a numero entero
        let page = parseInt(req.params.page) || 1;
        if (page < 1) {
            return res.status(400).send({ message: 'Parámetro de página no válido. Debe ser un número enter' });
        }

        // Establecer elementos por pagina
        const itemsPerPage = 5;

        // Calcular el total de usuarios
        const totalUsers = await User.countDocuments({});

        // Calcular el total de paginas y redonde hacia arriba
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        // validar si excede el total de paginas
        if (page > totalPages) {
            return res.status(404).send({ message: 'La página solicitada no es valida' });
        }

        // Calcular el desplazamienta para las paginas
        const offset = (page - 1) * itemsPerPage;

        // Obtener usuarios para la pagina actual
        const users = await User.find()
            .sort('_id')
            .skip(offset)
            .limit(itemsPerPage);

        // Devolver respuesta exitosa
        return res.status(200).send({
            status: 'success',
            users,
            page,
            itemsPerPage,
            total: totalUsers,
            pages: totalPages,
        });
    } catch (error) {
        console.error('Error al recuperar usuarios', error);
        return res.status(500).send({ message: 'Error en la consulta' });
    }
};


// Actualizar Usuario 
const update = async (req, res) => {


    try {
        const usuario = await User.findOneAndUpdate({ _id: req.params.id },
            req.body, {
            new: true
        });
        res.json(usuario);

    } catch (error) {
        // Manejo de errores
        return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar cliente',
        });
    }
};


// Suboir archivo
const upload = async (req, res) => {
    if (!req.file) {
        return res.status(404).send({
            status: 'Error',
            message: 'No se ha incluido un archivo de imagen en la petición'
        });
    }

    // Extraer la extensión del archivo
    const image = req.file.originalname;
    const imageSplit = image.split('.');
    const extension = imageSplit[1].toLowerCase();

    // Comprobar si la extensión es válida (solo imágenes permitidas)
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'avi'];
    if (!allowedExtensions.includes(extension)) {
        await fs.promises.unlink(req.file.path); // Eliminar el archivo subido si la extensión es inválida
        return res.status(400).json({ status: 'Error', message: 'Extensión del archivo no válida' });
    }

    // Actualizar el usuario con el nombre del archivo de la imagen
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id }, // Asegúrate de usar _id si estás usando MongoDB
            { image: req.file.filename },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ status: 'Error', message: 'Error al subir la imagen' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Imagen subida correctamente',
            user: updatedUser, // Devolver el usuario actualizado
            file: req.file // Devolver el archivo subido
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al subir la imagen' });
    }
};


//Avatar
const avatar = (req, res) => {
    // Sacar el parámetro
    const file = req.params.file;

    // Construir la ruta del archivo
    const filePath = path.join('uploads', 'avatars', file);

    // Comprobar si se encuentra la imagen
    //stats, es un metodo en la libreria para comprovar si un archivo existe
    fs.stat(filePath, (error, stats) => {
        if (error || !stats) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encuentra la imagen en el directorio'
            });
        }
        // Devolver el archivo
        return res.sendFile(path.resolve(filePath));
    });
};








// Exportar metodos
module.exports = {
    test,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
};



//notas
// exec() con callback: Está en desuso y no es compatible con la versión más reciente de Mongoose,
//async/await: Usar await en una función marcada como async permite que el código espere de forma natural la resolución de la promesa que devuelve findOne(), evitando así el error relacionado con los callbacks en Mongoose.