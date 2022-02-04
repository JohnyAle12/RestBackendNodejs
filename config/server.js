
const express = require('express');
const fileUpload = require('express-fileupload');
var cors = require('cors');

const { routes } = require('../config/route');
const { dbConection } = require('../database/config');

class Server{
    constructor(){
        this.port = process.env.PORT;
        this.app = express();
        this.pathRoute = routes;

        //Conectar a base de datos
        this.conectDB();
        //Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    async conectDB(){
        await dbConection();
    }

    middlewares(){
        //Cors
        this.app.use(cors());

        //Lectura y parseo del body en solicitudes http
        this.app.use(express.json());

        //exponer directorio publico y tener acceso al html
        this.app.use( express.static('public') );

        // carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            createParentPath: true,
            tempFileDir : '/tmp/'
        }));
    }

    routes(){
        this.app.use(this.pathRoute.auth, require('../routes/auth'));
        this.app.use(this.pathRoute.categories, require('../routes/category'));
        this.app.use(this.pathRoute.products, require('../routes/product'));
        this.app.use(this.pathRoute.search, require('../routes/search'));
        this.app.use(this.pathRoute.users, require('../routes/user'));
        this.app.use(this.pathRoute.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on the port ' + this.port);
        })
    }
}

module.exports = Server;