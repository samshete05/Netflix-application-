const mongoose = require('mongoose');
const SignupSchema = new mongoose.Schema({
    emailaddress:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    useraddress:{
        type:String,
        required:true
       

    },
    usercity:{
        type:String,
        required:true
       

    },
    userpincode:{
        type:String,
        required:true
    },
    userstate:{
        type:String,
        required:true
    

    },
  
});

const SignupModel = mongoose.model('netflix_users',SignupSchema);
module.exports = SignupModel;