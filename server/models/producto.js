const mongoose = require ('mongoose');
let Schema = mongoose.Schema;




let productoSchema = new Schema({
    accion:{
        type: String,
        required:[false, 'La accion es requerida'],
        default: 'Add'
    },
    titulo:{
        type: String,
        required: [false, 'El título es necesario']
    },
    precio:{
        type: String,
        required: [false, 'El precio es requirido']
    },
    categoria:{
        type: String,
        required: [true, 'La categoria es requerida']
    },
    marca:{
       type: String,
       required: [false, 'El precio es requirido']
     },
    caracteristicas:{
        type: String,
        required: [false, 'La descripción es necesaria']
    },
    imagenes:{
        type: String,
        required: false
    }

});




module.exports = mongoose.model('Producto', productoSchema);