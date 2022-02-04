
const generateJWT = require('./generate_jwt');
const googleVerify = require('./google_verify');
const dbValidators = require('./validators_db');
const uploadFiles = require('./upload_files');

module.exports = {
    ...generateJWT,
    ...googleVerify,
    ...dbValidators,
    ...uploadFiles
}