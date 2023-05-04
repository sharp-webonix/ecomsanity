const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = 'Anshulisagood$oy';

//Route 1) create a User using : POST '/api/auth/createuser'. Doesn't require Auth
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password at least 5 character').isLength({ min: 5 })
], async (req, res) => {
  let success= false;

  // if there are errors, return bad reuest and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  //check whether the user with same email exists already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "Sorry a user with this email already exists" });
    }
    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash( req.body.password,salt);
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
      phone: req.body.phone
    });


    console.log(user)
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success=true;
     res.json({success, authtoken});
  
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

});

//Route 2) Authenticate a user using POST '/api/auth/login' - no login required

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password can not be blank').exists()
], async (req, res) => {
   let success= false;
  // if there are errors, return bad reuest and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(401).json({success, error:"Please try to login with correct credentials"});
    }
    const passworddccompare = await bcrypt.compare(password,user.password);
    if(!passworddccompare){
      return res.status(401).json({success, error:"Please try to login with correct credentials"});
    }
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success = true;
     res.json({success,authtoken});
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

});

//Route 3) Get loggedin user detail using POST "/api/auth/getuser"  - Login required

router.post('/getuser',fetchUser,async (req, res) => {
   
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

}); 

module.exports = router;