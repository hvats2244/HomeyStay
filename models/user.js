const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");//ya automatic username or password  ko schema m add kra dega.

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportLocalMongoose); //ya hi username,password, hashing ,salting sabko add krna ka kam krta h.

module.exports = mongoose.model('User',userSchema);