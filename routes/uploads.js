const { Router } = require('express');
const { check } = require('express-validator');

const { saveFile, updateImage, showImage } = require('../controllers/uploads.controller');
const { collectionValidate } = require('../helpers');
const { fieldsValidate, isFileExist } = require('../middlewares');

const router = Router();

const validCollections = ['users', 'products'];

router.post('/', isFileExist, saveFile);

router.put('/:collection/:id', [
    isFileExist,
    check('id', 'El id debe ser valido').isMongoId(),
    check('collection').custom( col => collectionValidate( col, validCollections)),
    fieldsValidate
], updateImage);

router.get('/:collection/:id', [
    check('id', 'El id debe ser valido').isMongoId(),
    check('collection').custom( col => collectionValidate( col, validCollections)),
    fieldsValidate
], showImage);


module.exports = router;