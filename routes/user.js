const { Router } = require('express');
const { check } = require('express-validator');

const {
    fieldsValidate,
    validateJWT,
    isAdminRol,
    hasRole,
} = require('../middlewares');

const { userPost, userGet, userPut, userPatch, userDetele } = require('../controllers/user.controller');
const { validateRole, emailExist, userExistById  } = require('../helpers/validators_db');
const router = Router();

// Ruta de ejemplo
router.get('/example',  (req, res) => {
    //res.send('Hello World');
    // res.json({
    //     status: 200,
    //     msg: 'Hello World'
    // });

    res.status(403).json({
        status: 200,
        msg: 'Hello World GET method'
    });
});

router.get('/', userGet);

//Los Middleware se pueden enviar como segundo parametro, si no exise se valida este como  el controlador
router.post('/', [
    check('name', 'Es necesario un nombre').not().isEmpty(),
    check('email', 'El correo no es valido').isEmail().custom(emailExist),
    check('password', 'Es necesario una contraseña mínimo 6 letras').isLength({ min:6 }),
    //helper check personalizado
    check('role').custom(validateRole), // (role) => validateRole(role) podemos reemplazarlo por validateRole
    //middleware personalizado
    fieldsValidate
], userPost);

router.put('/:id', [
    validateJWT,
    isAdminRol,
    check('id', 'No es un id valido').isMongoId().custom(userExistById),
    fieldsValidate
], userPut);

router.delete('/:id', [
    validateJWT,
    hasRole('customer','user'),
    check('id', 'No es un id valido').isMongoId().custom(userExistById),
    fieldsValidate
], userDetele);

router.patch('/', userPatch);


module.exports = router;