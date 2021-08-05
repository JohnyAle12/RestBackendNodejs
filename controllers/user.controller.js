const { response } = require('express');

const userGet = (req, res = response) => {
    const params = req.query;
    res.json({
        msg: 'Hello World GET method FROM  COntroler',
        params
    });
}

const userPost = (req, res = response) => {
    const { name, age } = req.body;
    res.json({
        msg: 'Hello World POST method FROM  COntroler',
        name,
        age
    });
}

const userPut = (req, res = response) => {
    const id = req.params.id;
    res.json({
        id,
        msg: 'Hello World PUT method FROM  COntroler'
    });
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'Hello World PATCH method FROM  COntroler'
    });
}

const userDetele = (req, res = response) => {
    res.json({
        msg: 'Hello World DELETE method FROM  COntroler'
    });
}


module.exports = { userGet, userPost, userPut, userPatch, userDetele }