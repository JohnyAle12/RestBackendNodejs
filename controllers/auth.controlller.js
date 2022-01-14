const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate_jwt');
const { googleVerify } = require('../helpers/google_verify');

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        //verificar si el usuario existe
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                'msg': 'El usuario no se encuentra registrado'
            });
        }

        //verificamos que el usuario este activo
        if(!user.state){
            return res.status(400).json({
                'msg': 'El usuario no se encuentra activo'
            });
        }

        //verificar contraseña
        const passwordValid = bcryptjs.compareSync(password, user.password);
        if(!passwordValid){
            return res.status(400).json({
                'msg': 'La contraseña no es correcta'
            });
        }

        //generar un JWT
        const token = await generateJWT(user.id);

        res.json({
            msg: 'Login ok',
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal :('            
        });
    }

}

const loginGoogle = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, picture, email } = await googleVerify(id_token);

        //Verificar si el usuario ya existe en la base de datos
        let user = await User.findOne({ email });

        if(!user){
            //se crea el usuario
            const data = {
                name,
                email,
                password: 'xxx',
                role: 'user',
                google: true
            };

            user = new User(data);
            await user.save();
        }

        //verificamos que el usuario este activo
        if(!user.state){
            return res.status(400).json({
                'msg': 'El usuario no se encuentra activo'
            });
        }

        //generar un JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Algo salio mal :(',
            error
        });
    }


    

};

module.exports = { login, loginGoogle };