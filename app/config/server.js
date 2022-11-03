require('dotenv').config()
const express = require("express")
const http = require("http")
//Debug
const morgan = require("morgan");
const { AllRoutes } = require('../api/root/router/router');
const debug = require("debug")(process.env.DEBUG)
const winston = require("../plugin/winston");





module.exports = class Application {
    #app = express();
    constructor(){
        this.configApplication();
        this.createServer();
        this.createRoutes()

    }
    configApplication(){
        //* Logging
        if (process.env.NODE_ENV === "development") {
            debug("Morgan Enabled");
            this.#app.use(morgan("combined", { stream: winston.stream }));
            
        }
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended : true}));
    }
    createServer(){
        const PORT = process.env.PORT || 3001;
        http.createServer(this.#app).listen(PORT , ()=> {
            console.log(
                `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
            );
        })
        debug("Run server")
    }
    createRoutes(){
        this.#app.use(AllRoutes)
    }
}

// const runServer = app.listen(PORT , ()=> {
//     console.log(
//         `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
//     );
// })








// module.exports = class Application {
//     #app = express()
//     #DB_URL;
//     #PORT;
//     constructor(PORT , DB_URL){
//         this.#PORT = PORT;
//         this.#DB_URL = DB_URL;
//         this
//     }
// }

