const { response, request } = require('express');

const isFileExist = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'No hay archivos que subir'
        });
    }

    next();
};

module.exports = { isFileExist }; 