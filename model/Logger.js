//schema or temmplate or model of the request body
const mongoose = require('mongoose');
const LoggerSchema = new mongoose.Schema({
    emailaddress:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    }
});

const Logger = mongoose.model('NetFlix_User',LoggerSchema);
module.exports = Logger;