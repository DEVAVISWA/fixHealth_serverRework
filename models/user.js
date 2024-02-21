const { default: mongoose } = require("mongoose");

const UserSchema= new mongoose.Schema({
    name: {
        type:String,
        // required:true,
    },
    email: {
        type:String,
        // required:true,
    },
    passwordHash: {
        type: String,
        // required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    user_type:{
        enum:["patient","sales","physio"],
        type: String,
        default: "patient"
    }
})

const User= mongoose.model('User', UserSchema, 'users');

module.exports= User;