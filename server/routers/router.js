const express = require('express');
const router = express.Router();
const imgData = require('../data.json')
router.get('/imgData',async(req,res)=>{

    try {
        
        res.status(201).json({status:201,imgData});

    } catch (error) {
        res.status(401).json({status:401 ,error})
    }
    
})

module.exports = router;
