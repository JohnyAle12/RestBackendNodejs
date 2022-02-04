const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const validateRole = async(role = '') => {
    const exist = await Role.findOne({ name:role });
    if(!exist){
        throw new Error('El rol no es valido en la base de datos');
    }
}

const emailExist = async(email = '') => {
    const exist = await User.findOne({ email });
    if(exist){
        throw new Error('El correo ya esta registrado');
    }
}

const userExistById = async(id = '') => {
    const exist = await User.findById(id);
    if(!exist){
        throw new Error('No existe un usuario registrado');
    }
}

const categoryExistById = async(id = '') => {
    const exist = await Category.findById(id);
    if(!exist){
        throw new Error('No existe una categoria registrada');
    }
}

const productExistById = async(id = '') => {
    const exist = await Product.findById(id);
    if(!exist){
        throw new Error('No existe un producto registrado');
    }
}   

const collectionValidate = async(collection, collections = []) => {
    if(!collections.includes(collection)){
        throw new Error('La collección no es permitida');
    }
    return true;
}


module.exports = { validateRole, emailExist, userExistById, categoryExistById, productExistById, collectionValidate};