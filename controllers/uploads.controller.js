
const { response } = require('express');
const path = require('path');
const fs = require('fs');

const { uploadFiles } = require('../helpers');
const Product = require('../models/product');
const User = require('../models/user');

const saveFile = async (req, res = response) => {

    try {
        const result = await uploadFiles(req.files, ['jpg', 'png'], 'others');
        res.json({
            result
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
    
}

const updateImage = async(req, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: 'No existe un usuario registrado',
                    id
                })
            }
        break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: 'No existe un producto registrado'
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'no esta implementada esta colleccion'
            });
    }

    //Limpieza de imagen si existe en el filesystem
    if ( model.image_url ) {
        const imagePath = path.join( __dirname, '../storage', collection, model.image_url);
        if( fs.existsSync(imagePath) ){
            fs.unlinkSync(imagePath);
        }
    }

    try {
        const nameImage = await uploadFiles(req.files, ['jpg', 'png'], collection);
        model.image_url = nameImage

        await model.save();

        res.json({
            model
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

const showImage = async(req, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: 'No existe un usuario registrado',
                    id
                })
            }
        break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: 'No existe un producto registrado'
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'no esta implementada esta colleccion'
            });
    }

    //Validacion de imagen si existe en el filesystem
    if ( model.image_url ) {
        const imagePath = path.join( __dirname, '../storage', collection, model.image_url);
        if( fs.existsSync(imagePath) ){
            return res.sendFile(imagePath);
        }
    }

    const noImagePath = path.join( __dirname, '../public/assets', 'no-image.jpeg');
    res.sendFile(noImagePath);
}

module.exports = { saveFile, updateImage, showImage }