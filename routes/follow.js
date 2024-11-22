const express = require('express');
const route = express.Router();
const followController = require('../controllers/follow');
const check = require('../middleware/auth');


// Definir las rutas
route.get('/followTest', followController.followTest);
route.post('/save', check.auth, followController.save); //http://localhost:3000/api/follow/save
route.delete('/unfollowing/:id', check.auth, followController.unfollowing);
route.get('/following/:id?/:page?', check.auth, followController.following);






// Exportar router
module.exports = route;
