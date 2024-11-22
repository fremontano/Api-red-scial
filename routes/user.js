const express = require('express');
const route = express.Router();
const userController = require('../controllers/user');
const check = require('../middleware/auth');
// Subir imagenes por el usuario 
const multer = require('multer');


// Configuracion de subida de imagenes 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars')
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar' + Date.now() + '-' + file.originalname);
    }
});

// pasar el objeto 
const upload = multer({ storage });


// Definir las rutas
route.get('/test', check.auth, userController.test);
route.post('/register', userController.register);//guardar informacion
route.post('/login', userController.login);//login 
route.get('/profile/:id', check.auth, userController.profile);//perfil, con autenticacion 
route.get('/list/:page?', userController.list)//lista de usuario,  http://localhost:3000/api/user/list/2
route.put('/update/:id', check.auth, userController.update);//validamos los datos mediante el token y no por la url

route.post('/upload', [check.auth, upload.single("file0")], userController.upload);//http://localhost:3000/api/user/upload
route.get('/avatar/:file', check.auth, userController.avatar);


// Exportar router
module.exports = route;

