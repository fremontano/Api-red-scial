const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = mongoose;

// Definir el esquema de Usuario
const UserSchema = new Schema({
    name: {
        type: String,
        required: true, // Campo obligatorio
        trim: true,     // Elimina espacios al inicio y al final
    },
    surname: {
        type: String,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    biography: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,    // Garantiza que no haya emails duplicados
        lowercase: true, // Convierte a minusculas automáticamente
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,    // Longitud minima para mayor seguridad
    },
    role: {
        type: String,
        enum: ['role_user', 'role_admin'], // Solo permite estos valores
        default: 'role_user',
    },
    image: {
        type: String,
        default: 'default.png'
    },
    createdAt: {
        type: Date,
        default: Date.now, // Fecha de creación automatica
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Actualizado cada vez que el documento cambia
    },
}, {
    timestamps: true, // Agrega automáticamente `createdAt` y `updatedAt`
});


//Coleccion para paginacion de usuario
UserSchema.plugin(mongoosePaginate);

// Crear el modelo
const User = mongoose.model('User', UserSchema, 'users');//'users' nuestras colecciones que se llamaran  en nuestra base de datos

// Exportar el modelo, capa de interacion entre el modelo y la base de datos
module.exports = User;
