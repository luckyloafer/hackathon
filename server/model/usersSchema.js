const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    phNumber:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    imgpath:{
        type:String,
        required:true
    },
    date:{
        type:Date
    },
    email:{
        type:String,
        required:true
    }
});

//create model

const users = new mongoose.model("users",userSchema);

module.exports = users;