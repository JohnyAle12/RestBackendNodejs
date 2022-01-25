const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario de acceso es obligatorio']
    }
});

CategorySchema.methods.toJSON = function(){
    const { name, created_by } = this.toObject();
    return { name, created_by };
}


module.exports = model('Category', CategorySchema);