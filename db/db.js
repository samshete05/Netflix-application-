const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/NetFlix_Users',{
          
        });
        console.log("Successfully connected to database.");
    }catch(err){
       console.log("Error in connecting to database .",err);
    }
};

module.exports = connectDB;