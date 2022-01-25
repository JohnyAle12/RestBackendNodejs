const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidate } = require('../middlewares/user_validate');
const { login, loginGoogle } = require('../controllers/auth.controlller');
const { emailExist  } = require('../helpers/validators_db');

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldsValidate
], login);

router.post('/google', [
    check('id_token', 'El token de Google es obligatorio').not().isEmpty(),
    fieldsValidate
], loginGoogle);

module.exports = router; 