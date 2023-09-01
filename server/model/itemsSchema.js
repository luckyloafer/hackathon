const mongoose  = require('mongoose');

const itemsSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    price:{
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
    imgpath:{
        type:String,
        required:true
    },
    date:{
        type:Date
    },
});

const items = new mongoose.model("items",itemsSchema);

module.exports = items;