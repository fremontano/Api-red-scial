
const mongoose = require('mongoose');
require('dotenv').config();



const connection = async () => {



    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conetado a la base de dato correctamente');


    } catch (error) {
        console.log('Error al conectar a la base de datos ', error);
    }
}


module.exports = {
    connection
}