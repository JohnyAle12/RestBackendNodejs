
const express = require('express');
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
    }

    routes(){
        this.app.use(this.pathRoute.auth, require('../routes/auth'));
        this.app.use(this.pathRoute.categories, require('../routes/category'));
        this.app.use(this.pathRoute.users, require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on the port ' + this.port);
        })
    }
}

module.exports = Server;