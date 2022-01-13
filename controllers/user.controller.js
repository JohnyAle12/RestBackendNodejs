const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const userGet = async(req, res = response) => {
    let { limit = 5, since = 0 } = req.query;
    const query = { state:true };
    
    limit = Number(limit);
    since = Number(since);

    if(Number.isInteger(limit) && Number.isInteger(since)) {
        // const users = await User.find(query)
        //     .skip(since)
        //     .limit(limit);
        
        // const total = await User.countDocuments(query);

        // Este bloque me permite ejecutar varias promesas simultaneamente, y obtener sus resultados
        // desestructurando el array de resultados que devuelve, en el caso anterior tarda mas la petición
        const [ total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(since)
                .limit(limit)
        ]);

        return res.json({
            msg: 'List of users',
            total,
            users
        });
    }

    res.status(400).json({
        msg: 'El valor del paginador y del limite deben ser numeros',
    });
}

const userPost = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Guarda el documento
    await user.save();

    res.json({
        msg: 'User save success',
        user
    });
}

const userPut = async(req, res = response) => {
    const id = req.params.id;
    const { _id,  password, google, ...params } = req.body;

    if(password){
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        params.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, params);

    res.json({
        msg: 'User update success',
        params
    });
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'Hello World PATCH method FROM  COntroler'
    });
}

const userDetele = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    const authUser = req.authUser;

    //Eliminación permanente del registro
    //const user = await User.findByIdAndDelete(id);

    //Eliminación suave del registro
    const user = await User.findByIdAndUpdate(id, { state:false });

    res.json({
        msg: 'Hello World DELETE method FROM  COntroler',
        id,
        uid,
        user,
        authUser
    });
}


module.exports = { userGet, userPost, userPut, userPatch, userDetele }