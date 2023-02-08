const router = require('express').Router();
const verify = require('./varifyToken')
const User = require('../model/User');

router.get('/',verify, (req, res) => {
    const user = req.user
    console.log(user)
    if(!user) return res.status(401).send("Unauthorized access to make this request.");
    User.find({}, (err, userDetails) => {
        if (err) return res.status(400).send(err);
        res.send(userDetails);
    });
});


module.exports = router