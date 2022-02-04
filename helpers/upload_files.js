const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFiles = ( files, validExt = ['jpg', 'png', 'pdf'], folder = '' ) => {

    return new Promise( (resolve, reject) => {

        const { file } = files;
        const nameCutted = file.name.split('.');
        const ext = nameCutted[ nameCutted.length - 1 ];

        if ( !validExt.includes(ext) ) {
            return reject('La extension del archivo no es valida');
        }
        
        const tmpName = uuidv4() + '.' + ext;
        const uploadPath = path.join( __dirname , '../storage/' , folder, tmpName);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }

            resolve(tmpName);
        });
    });

    
}

module.exports = { uploadFiles }