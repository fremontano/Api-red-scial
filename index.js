// dependencia

const { connection } = require('./database/connection')
const express = require('express');
const cors = require('cors');
require('dotenv').config();



// mensaje de bienvenida 
console.log('Bienvenidos, API node rest social');

// coneccion a la base de datos
connection();

// crear servidor de node
const app = express();
const PORT = process.env.PORT || 3000;

// configurar cors
app.use(cors());

// convertir los datos del body a objetos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cargar configuración de rutas
const userRoutes = require('./routes/user');
const followRoutes = require('./routes/follow');
const publicationRoutes = require('./routes/publication');

// Prefijo para las rutas
app.use('/api/user', userRoutes); //http://localhost:3000/api/user/accion
app.use('/api/publication', publicationRoutes); //http://localhost:3000/api/publication/accion
app.use('/api/follow', followRoutes); //http://localhost:3000/api/follow/accion



// poner al servidor escuchar peticio http 
app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});