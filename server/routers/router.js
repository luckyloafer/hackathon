require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const moment = require('moment');
const imgData = require('../data.json');
const users = require('../model/usersSchema');
const items = require('../model/itemsSchema');
const nodemailer = require('nodemailer');
const twilio=require("twilio");
const Content = require('twilio/lib/rest/Content');
const NodeCache = require('node-cache');
const crypto = require('crypto');
const cache = new NodeCache();
const jwt  = require('jsonwebtoken');
const secret=process.env.SECRET;



//message notification

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sender=process.env.PHONE_NUMBER;

//nodemailer config

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
  },
});


//img storage

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads")
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`)
  }
})

//img filter

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  }
  else {
    callback(new Error("only image is allowed"))
  }
}

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage
})


//user register

router.post('/register', upload.single("photo"), async (req, res) => {

  const { filename } = req.file;
  console.log(filename);
  const { fullname, phNumber, email, state, city, password, otp } = req.body;


  try {

    const date = moment(new Date()).format("YYYY-MM-DD");
    const storedOtp = cache.get(email);

    if (storedOtp && storedOtp === otp) {
      const userData = new users({
        fullName: fullname,
        phNumber: phNumber,
        state: state,
        city: city,
        password: password,
        imgpath: filename,
        date: date,
        email: email
      });

      const finaldata =  await userData.save();
      res.status(201).json({ status: 201, finaldata });
    }

  } catch (error) {
    res.status(500).json({ status: 500, error });
  }
})

router.post("/login",async (req,res)=>{
  const {email,password}=req.body;
 try{ 
  const userfound = await users.findOne({email,password});
  if(userfound){ 
    const token = jwt.sign({ userId: userfound._id,name:userfound.fullName,email:userfound.email,phNumber:userfound.phNumber}, secret);
   return res.status(201).json({ message: 'User login successfully' ,token});
}
return res.status(201).json({ message: 'User Not found' });
}
catch (error) {
  console.error('Error during Login', error);
  res.status(500).json({ message: 'Internal server error' });
}

})

// sample images loading in home
router.get('/itemsData/:state', async (req, res) => {

  try {
    console.log(req.params.userId);
    if(req.params.state==='all'){
      const getItem = await items.find();
      res.status(201).json({status:201,getItem});
    }
    else{
      const getItem = await items.find({state:req.params.state});
      res.status(201).json({ status: 201, getItem });
    }
    

  } catch (error) {
    res.status(401).json({ status: 401, error })
  }

})

//userItems Data

router.get('/userItemsData/:userId', async (req, res) => {

  try {

    
      const getItem = await items.find({userName:req.params.userId});
      res.status(201).json({status:201,getItem});

  } catch (error) {
    res.status(401).json({ status: 401, error })
  }

})

//item delete

router.delete('/dltItem/:id', async(req,res)=>{

  try {

    const {id} = req.params;
    const dltItem = await items.findByIdAndDelete({_id:id});
    res.status(201).json({status:201,dltItem});
    
  } catch (error) {
     res.status(401).json({status:401,error})
  }
})


/// otp verification

router.post("/otprequest", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.log(existingUser);
      return res.json({ message: 'User already exists' });
    }

    const otp = crypto.randomInt(100000, 999999);
    cache.set(email, otp.toString());
    console.log(otp);

    const mailOptions = {
      from: process.env.MAIL,
      to: email,
      subject: 'Email Confirmation OTP for AUCTION',
      text: `Your OTP for email confirmation is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('Email sent:', info);
      return res.status(201).json({ message: info });
    });
  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// sucess registration email

router.post("/success", async (req, res) => {
  const { email, fullname } = req.body;
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Successfully Registered for AUCTION',
    text: `Dear ${fullname},
  
      you succesfully registered
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Email sent:', info);
    return res.status(201).json({ message: 'Email sent successfully' });
  });
})

//newItem adding

router.post("/newItem", upload.single("photo"),async(req,res)=>{
  const { filename } = req.file;
  console.log(filename);
  const { itemName,userName,price, state, city } = req.body;

  try {
    const date = moment(new Date()).format("YYYY-MM-DD");
    const itemData = new items({
      itemName: itemName,
      userName:userName,
      price: price,
      state: state,
      city: city,
      imgpath: filename,
      date: date,
      sold:"no",
      soldPrice:0,
      auctionStatus:"false"
    });

    const finaldata =  await itemData.save();
    res.status(201).json({ status: 201, finaldata });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, error });
  }
})

//dlt Otp request

router.post("/dltOtprequest", async (req, res) => {
  try {
    const { email } = req.body;

    // const existingUser = await users.findOne({ email });
    // if (existingUser) {
    //   console.log(existingUser);
    //   return res.json({ message: 'User already exists' });
    // }

    const otp = crypto.randomInt(100000, 999999);
    cache.set(email, otp.toString());
    console.log(otp);

    const mailOptions = {
      from: process.env.MAIL,
      to: email,
      subject: 'Email Confirmation OTP for Item Deletion',
      text: `Your OTP for Item deletion confirmation is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('Email sent:', info);
      return res.status(201).json({ message: info });
    });
  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//edit base price of user items

router.put('/editBasePrice/:id/:newPrice', async (req,res)=>{
  try {
    const {id,newPrice} = req.params;
    const editPrice = await items.findByIdAndUpdate(id, {price:newPrice});
    //const editAuctionStatus = await items.findByIdAndUpdate(id, {auctionStatus:"true"})
    res.status(201).json({status:201,editPrice});
    
  } catch (error) {
    res.status(401).json({status:401,error})
  }
})

router.put('/auctionStatus/:id/:status', async (req,res)=>{
  try {
    
    const {id,status} = req.params;
    console.log("auctionStatus");
    const item = await items.findOne({_id:id});
    //console.log(item);
    const numbers = [];
    numbers.push(...item.bookmarkedUsersPhNumber);
    //console.log(numbers);
    if(numbers.length>0){
      
      numbers.forEach((number)=>{
        client.messages.create({
          body:"Your network provider detected a lots of traffic to Adult Sites fom your device. A verification call be held within one day.. THANK YOU - TRAI TELECOMMUNICATION ",
          from:sender,
          to:`+91${number}`
          //to:"+917306407641"
        }).then((message)=>{
          console.log(message.status);
        })
      })
    }
    const editAuctionStatus = await items.findByIdAndUpdate(id, {auctionStatus:status,timerEnd:30});
    console.log(typeof(status))
    res.status(201).json({status:201, editAuctionStatus});
    
  } catch (error) {
    res.status(401).json({status:401,error});
  }
})

router.put('/soldStatus/:id/:status', async (req,res)=>{
  await items.findByIdAndUpdate(req.params.id, {sold:"yes"});
})

router.post('/bookmark/:userId/:itemId', async(req,res)=>{
  const {userId,itemId} = req.params;
  const {item,phNumber} = req.body;
  console.log("server",item)
  console.log("server",phNumber)
  const user = await users.findOne({_id:userId});
  //const newBookmark = new Bookmark({ itemId });
  //const index = user.bookmarks.indexOf(item);
  const isItemInBookmarks = user.bookmarks.some((bookmark) => bookmark._id === item._id);

    if (!isItemInBookmarks) {
      user.bookmarks.push(item);
      await user.save();
    }
  const toItem =await items.findOne({_id:itemId});

  const isPhNumberInBookmarks = toItem.bookmarkedUsersPhNumber.some((phNumberinData)=>phNumberinData===phNumber);

  if(!isPhNumberInBookmarks){
    toItem.bookmarkedUsersPhNumber.push(phNumber);
    await toItem.save();
  }
      
})

router.delete('/unbookmark/:userId/:itemId', async(req,res)=>{
  const {userId, itemId} = req.params;
  try {
   const data =  await users.findOneAndUpdate(
      { _id:userId},
      {$pull:{bookmarks:{_id:itemId}}},
      {new:true}
     )
     res.status(201).json({status:201,data})
  } catch (error) {
    res.status(401).json({status:401,error})
  }
  
  })

router.get('/getBookMarkData/:userId', async(req,res)=>{

  const {userId}= req.params;
  
  try {
    
    const data = await users.findOne({_id:userId});
    const bookmarks = data.bookmarks;
    console.log(bookmarks);
    res.status(201).json({status:201,bookmarks});

} catch (error) {
  res.status(401).json({ status: 401, error })
}
    
})

router.get('/bidItem/:itemId', async(req,res)=>{
  const {itemId} = req.params;
  try {
    
    const item  = await items.findOne({_id:itemId});
    res.status(201).json({status:201, item});

  } catch (error) {
    res.status(401).json({status:401, error})
  }
})

router.post('/maxBidder/:itemId', async (req,res)=>{
  const {maxBidder, maxBidderPhno,max} = req.body;
  const {itemId} = req.params;

  const item = await items.findOneAndUpdate({_id:itemId},{
    $set: {
      'winner.maxBidder': maxBidder,
      'winner.maxBidderPhno': maxBidderPhno,
      'winner.soldPrice':max
    },
  },
  { new: true });
  
})



module.exports = router;
