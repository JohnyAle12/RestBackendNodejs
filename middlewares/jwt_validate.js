const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('Authorization');

    if(!token){
        return res.status(401).json({
            'msg': 'Acceso denegado por falta de credenciales'
        }); 
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_PUBLIC_KEY);

        //Usuario autenticado
        const authUser = await User.findById(uid);

        //verifica que el usuario exista
        if(!authUser){
            return res.status(401).json({
                'msg': 'Acceso denegado usuario no existe'
            });
        }

        //verifica que el estado del usuario autenticado sea true
        if(!authUser.state){
            return res.status(401).json({
                'msg': 'Acceso denegado usuario no activo'
            });
        }

        req.authUser = authUser;
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            'msg': 'Acceso denegado token no valido'
        });
    }
}


module.exports = { validateJWT };