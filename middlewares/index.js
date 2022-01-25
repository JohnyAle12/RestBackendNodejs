
// importamos todas las funciones y las exportamos sin desestructurar

const fieldsValidate = require('../middlewares/user_validate');
const validateJWT = require('../middlewares/jwt_validate');
const rolesValidate = require('../middlewares/roles_validate');

module.exports = {
    ...fieldsValidate,
    ...validateJWT,
    ...rolesValidate
};