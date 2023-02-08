const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv")
const postRoute = require('./routes/posts')

//import routes
const authRoute = require('./routes/auth');


dotenv.config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECT,(err) => {
    if(err){
        console.log(err)
    }else{
        console.log("DB Connected!")
    }
})

//Middleware
app.use(express.json());
///Route Middleware
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)



app.listen(3000, () => console.log('server is running'))