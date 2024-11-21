const express = require('express');
const route = express.Router();
const followController = require('../controllers/follow');

// Definir las rutas
route.get('/follow', followController.follow);






// Exportar router
module.exports = route;
