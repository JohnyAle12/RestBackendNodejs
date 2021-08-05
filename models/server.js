
const express = require('express');
var cors = require('cors');

class Server{
    constructor(){
        this.port = process.env.PORT;
        this.app = express();

        //Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    middlewares(){
        //Cors
        this.app.use(cors());

        //Lectura y parseo del body en solicitudes http
        this.app.use(express.json());

        //exponer directorio publico
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