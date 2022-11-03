const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const { UserModel } = require("../../users/user/model")
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constans")


//make random number for otp 
function RandomOtpGenerator(){
    return Math.floor((Math.random() * 90000) + 10000)
}

//make access token for auth 
function SignAccessToken(userId){
    return new Promise(async (resolve , reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expiresIn : "24h"
        };
        JWT.sign(payload , ACCESS_TOKEN_SECRET_KEY , options , (err , token) => {
            if(err) reject(createError.InternalServerError("خطای سروری"))
            resolve(token)
        })
    })
}

//make refresh token for auth
function SignRefreshToken(userId){
    return new Promise(async (resolve , reject)=> {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expiresIn: "24h"
        };
        JWT.sign(payload , REFRESH_TOKEN_SECRET_KEY , options , async(err , token)=>{
            if (err) reject(createError.InternalServerError("خطای سروری"));
            resolve(token)
        })

    })
}


module.exports = {
    RandomOtpGenerator,
    SignAccessToken,
    SignRefreshToken
}