require('dotenv').config()
//Database
const connectDB = require("./app/config/database")
//Server
const Application = require ("./app/config/server")

connectDB()
new Application()
