const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
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
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoria es obligatorio']
    },
    image_url: { type: String },
    description: { type: String },
    available: {
        type: Boolean,
        default: true,
    }
});

ProductSchema.methods.toJSON = function(){
    const { __v, state, ...product } = this.toObject();
    return product;
}


module.exports = model('Product', ProductSchema);