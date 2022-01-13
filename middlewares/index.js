
// importamos todas las funciones y las exportamos sin desestructurar

const userValidate = require('../middlewares/user_validate');
const validateJWT = require('../middlewares/jwt_validate');
const rolesValidate = require('../middlewares/roles_validate');

module.exports = {
    ...userValidate,
    ...validateJWT,
    ...rolesValidate
};