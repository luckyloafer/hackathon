const express = require('express');
const router = express.Router();
const multer = require('multer');
const moment = require('moment');
const imgData = require('../data.json');

//img storage

const imgconfig = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, "./uploads")
    },
    filename:(req, file, callback)=>{
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})

//img filter

const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true);
    }
    else{
        callback(new Error("only image is allowed"))
    }
}

const upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})






router.get('/imgData',async(req,res)=>{

    try {
        
        res.status(201).json({status:201,imgData});

    } catch (error) {
        res.status(401).json({status:401 ,error})
    }
    
})

module.exports = router;
