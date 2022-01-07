
const express = require('express');
var cors = require('cors');

const { dbConection } = require('../database/config');

class Server{
    constructor(){
        this.port = process.env.PORT;
        this.app = express();

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
        this.app.use('/api/users', require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on the port ' + this.port);
        })
    }
}

module.exports = Server;