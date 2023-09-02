require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const moment = require('moment');
const imgData = require('../data.json');
const users = require('../model/usersSchema');
const items = require('../model/itemsSchema');
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const crypto = require('crypto');
const cache = new NodeCache();
const jwt  = require('jsonwebtoken');
const secret=process.env.SECRET;

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
    const token = jwt.sign({ userId: userfound._id,name:userfound.fullName}, secret);
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

    const getItem = await items.find({state:req.params.state});
    res.status(201).json({ status: 201, getItem });

  } catch (error) {
    res.status(401).json({ status: 401, error })
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
      date: date
    });

    const finaldata =  await itemData.save();
    res.status(201).json({ status: 201, finaldata });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, error });
  }
})




module.exports = router;
