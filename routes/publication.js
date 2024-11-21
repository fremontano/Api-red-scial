const express = require('express');
const route = express.Router();
const publicationController = require('../controllers/publication');

// Definir las rutas
route.get('/publication', publicationController.publication);






// Exportar router
module.exports = route;
