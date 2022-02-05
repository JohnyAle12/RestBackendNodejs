
const { response } = require('express');
const path = require('path');
const fs = require('fs');

const { uploadFilesToLocal, uploadFilesToCloudinary } = require('../helpers');
const Product = require('../models/product');
const User = require('../models/user');

const saveFile = async (req, res = response) => {

    try {
        const result = await uploadFilesToLocal(req.files, ['jpg', 'png'], 'others');
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

    try {
        const secure_url = await uploadFilesToCloudinary(req.files, ['jpg', 'png'], model.image_url);
        model.image_url = secure_url;
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
    
    //Validacion de imagen es de un servicio externo
    if ( model.image_url.includes("http://") || model.image_url.includes('https://') ) {
        return res.json({
            url: model.image_url
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