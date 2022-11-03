const { UserAuthController } = require("../controller/auth.controller");

const router = require ("express").Router();

router.post("/register" , UserAuthController.getOtp)
router.post("/login" , UserAuthController.checkOtp)

module.exports = {
    UserAuthRoutes : router
}
