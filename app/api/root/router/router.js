const router = require("express").Router()

// import all routes
const { UserAuthRoutes } = require("../../users/auth/router/router")



// use all  routes
router.use("/user" , UserAuthRoutes)

module.exports = {
    AllRoutes : router
}