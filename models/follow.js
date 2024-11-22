const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// Definir el esquema de Usuario
const FollowSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    followed: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    create_at: {
        type: Date,
        default: Date.now,
    }
});



// Crear el modelo
const Follow = mongoose.model('Follow', FollowSchema, 'follows');
module.exports = Follow;




// Notas
// type: Schema.ObjectId: Este campo almacena un identificador unico, ObjectId de un usuario.
// ref: 'User': Es una referencia al modelo User. Permite establecer una relación entre el documento Follow y un documento en la colección users.
// default: Date.now: Asigna automáticamente la fecha y hora actual si no se proporciona un valor.
// Relación eficiente: Al usar referencias ObjectId, se pueden enlazar documentos sin duplicar datos