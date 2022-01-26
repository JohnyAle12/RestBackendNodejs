const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidate, validateJWT, isAdminRol } = require('../middlewares');
const { index, get, save, update, remove } = require('../controllers/product.cotroller');
const { productExistById  } = require('../helpers/validators_db');

const router = Router();

//Obtener todas los productos - publico - paginados - total - populate
router.get('/', index);

//Obtener un producto por id - publico - populate
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId().custom(productExistById),
    fieldsValidate
], get);

//Crear un producto - privado
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').not().isEmpty().isMongoId(),
    fieldsValidate
], save);

//Actualizar un producto por id - privado
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').isMongoId(),
    check('id', 'No es un id valido').isMongoId().custom(productExistById),
    fieldsValidate
], update);

//Eliminar una categoria - privado - solo admin - softdelete
router.delete('/:id', [
    validateJWT,
    isAdminRol,
    check('id', 'No es un id valido').isMongoId().custom(productExistById),
    fieldsValidate
], remove);



module.exports = router; 