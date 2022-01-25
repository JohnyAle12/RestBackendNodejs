const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidate, validateJWT, isAdminRol } = require('../middlewares');
const { index, get, save, update, remove } = require('../controllers/category.controller');
const { categoryExistById  } = require('../helpers/validators_db');

const router = Router();

//Obtener todas las categorias - publico - paginados - total - populate
router.get('/', index);

//Obtener una las categoria por id - publico - populate
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId().custom(categoryExistById),
    fieldsValidate
], get);

//Crear un categoria - privado
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldsValidate
], save);

//Actualizar una categoria por id - privado
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId().custom(categoryExistById),
    fieldsValidate
], update);

//Eliminar una categoria - privado - solo admin - softdelete
router.delete('/:id', [
    validateJWT,
    isAdminRol,
    check('id', 'No es un id valido').isMongoId().custom(categoryExistById),
    fieldsValidate
], remove);



module.exports = router; 