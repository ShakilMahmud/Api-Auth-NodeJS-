const router = require('express').Router();
const User = require('../model/User');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { registerValidation, loginValidation} = require('../validation')


router.post('/register', async (req, res) => {
    //make validation
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // checking if email allready esist
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email Already Exists')

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassWord = await bcrypt.hash(req.body.password, salt)

    //create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassWord
    });
    try{
         await user.save();
        res.send({'user': user._id});
    }catch(err){
        res.status(400).send(err);
    }
})

// Login 
router.post('/login', async (req, res) => {
    //make validation
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // checking email
    const userInfo = await User.findOne({email: req.body.email})
    if(!userInfo) return res.status(400).send('Email or Password not match')

    //checking password
    const validPass = await bcrypt.compare(req.body.password, userInfo.password)
    if(!validPass) return res.status(400).send('Email or Password not match')

    // token
    const token = jwt.sign({_id: User._id},process.env.SECRET,{ expiresIn: "1h" })
    res.header('auth-token', token).send(token)
})

module.exports = router;