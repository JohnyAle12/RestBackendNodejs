const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFilesToLocal = ( files, validExt = ['jpg', 'png', 'pdf'], folder = '', actualFile = false ) => {

    return new Promise( (resolve, reject) => {

        const { file } = files;
        const nameCutted = file.name.split('.');
        const ext = nameCutted[ nameCutted.length - 1 ];

        if ( !validExt.includes(ext) ) {
            return reject('La extension del archivo no es valida');
        }

        //Limpieza de imagen si existe en el filesystem
        if ( actualFile ) {
            const imagePath = path.join( __dirname, '../storage', collection, actualFile);
            if( fs.existsSync(imagePath) ){
                fs.unlinkSync(imagePath);
            }
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

const uploadFilesToCloudinary = ( files, validExt = ['jpg', 'png'], actualFile = false) => {

    return new Promise( async(resolve, reject) => {

        const { file } = files;
        const { tempFilePath } = file;
        const nameCutted = file.name.split('.');
        const ext = nameCutted[ nameCutted.length - 1 ];

        if ( !validExt.includes(ext) ) {
            return reject('La extension del archivo no es valida');
        }

        try {
            
            if ( actualFile ) {
                const cloudinaryNameFile = actualFile.split('/');
                const nameFile = cloudinaryNameFile[ cloudinaryNameFile.length -1 ];
                const [ publicId ] = nameFile.split('.');
                await cloudinary.uploader.destroy( publicId );
            }

            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
            resolve(secure_url);
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = { uploadFilesToLocal, uploadFilesToCloudinary }