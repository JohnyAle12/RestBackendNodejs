const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const collections = [
    'users',
    'categories',
    'products',
    'roles'
];

const userSearch = async(criterial = '', res = response) => {
    const isMongoId = ObjectId.isValid(criterial);
    //Expresion regular para que sea insensible a mayuscula y minuscula 
    const regex = new RegExp(criterial, 'i');
    const query = {
        $or: [{ name:regex }, { email:regex }],
        $and: [{ state:true }]
    };

    if(isMongoId){
        const users = await User.findById(criterial);
        return res.json({
            total: (users) ? 1 : 0,
            results: (users) ? [users] : [],
        });
    }

    const [ total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.json({
        total,
        results: users,
    });
}

const productSearch = async(criterial = '', res = response) => {
    const isMongoId = ObjectId.isValid(criterial);
    //Expresion regular para que sea insensible a mayuscula y minuscula 
    const regex = new RegExp(criterial, 'i');
    const query = {
        $and: [{ name:regex }, { state:true }, { available: true }]
    };

    if(isMongoId){
        const products = await Product.findById(criterial);
        return res.json({
            total: (products) ? 1 : 0,
            results: (products) ? [products] : [],
        });
    }

    const [ total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('category', 'name')
            .populate('created_by', 'name')
    ]);

    res.json({
        total,
        results: products,
    });
}

const categorySearch = async(criterial = '', res = response) => {
    const isMongoId = ObjectId.isValid(criterial);
    //Expresion regular para que sea insensible a mayuscula y minuscula 
    const regex = new RegExp(criterial, 'i');
    const query = {
        $and: [{ name:regex }, { state:true }]
    };

    if(isMongoId){
        const categories = await Category.findById(criterial);
        return res.json({
            total: (categories) ? 1 : 0,
            results: (categories) ? [categories] : [],
        });
    }

    const [ total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);

    res.json({
        total,
        results: categories,
    });
} 

const search = async(req, res = response) => {
    
    const { collection, criterial } = req.params;

    if( !collections.includes( collection ) ){
        res.status(400).json({
            msg: "La colección no esta permitida para la busqueda",
        });
    }

    switch (collection) {
        case 'users':
            userSearch(criterial, res);
        break;
        case 'categories':
            categorySearch(criterial, res);
        break;
        case 'products':
            productSearch(criterial, res);
        break;
    
        default:
            res.status(500).json({
                msg: "La colección para la busqueda no se ha imlpementado",
            });
        break;
    }

}

module.exports = { search }