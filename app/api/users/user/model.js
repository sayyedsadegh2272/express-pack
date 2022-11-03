const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name : {type : String},
    last_name: {type : String},
    username: {type : String , lowercase : true},
    mobile : {type : String , required : true , unique : true},
    email : {type : String , lowercase : true},
    password : {type : String},
    avatar : {type : String},
    job : {type : Object},
    skills : {type : Object},
    education : {type : Object},
    discipline : {type : String},
    university : {type : String},
    university_image : {type : [String]},
    custom_branding : {type : Object},
    otp : {type : Object , default : {
        code : 0 ,
        expiresIn : 0
    }},
    birthday:{type : String},
    Role : {type : String , default : "USER"},
},{
    timestamps : true,
    toJSON : {
        virtuals: true
    }
});
UserSchema.index({first_name: "text", last_name: "text", username: "text", mobile: "text", email: "text"})
module.exports = {
    UserModel : mongoose.model("user", UserSchema)
}