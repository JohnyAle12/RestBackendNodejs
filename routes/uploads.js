const { Router } = require('express');
const { check } = require('express-validator');

const { saveFile, updateImage } = require('../controllers/uploads.controller');
const { collectionValidate } = require('../helpers');
const { fieldsValidate, isFileExist } = require('../middlewares');

const router = Router();

router.post('/', isFileExist, saveFile);

router.put('/:collection/:id', [
    isFileExist,
    check('id', 'El id debe ser valido').isMongoId(),
    check('collection').custom( col => collectionValidate( col, ['users', 'products'])),
    fieldsValidate
], updateImage);


module.exports = router;