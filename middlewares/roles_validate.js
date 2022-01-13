const { response, request } = require('express');

const isAdminRol = (req = request, res = response, next) => {

    if(!req.authUser){
        return res.status(500).json({
            'msg': 'Se quiere verificar rol de usuario sin validación de token'
        });
    }

    const { role, name } = req.authUser;

    if(role != 'admin'){
        return res.status(401).json({
            'msg': 'El usuario ' + name + ' no tiene rol de Administrador'
        });
    }

    next();
};

const hasRole = ( ...roles ) => {
    return (req = request, res = response, next) => {

        if(!req.authUser){
            return res.status(500).json({
                'msg': 'Se quiere verificar rol de usuario sin validación de token'
            });
        }

        if(!roles.includes(req.authUser.role)){
            return res.status(401).json({
                'msg': 'El usuario no tiene un rol autorizado para esta acción'
            });
        }

        next();
    }
}

module.exports = { isAdminRol, hasRole }; 