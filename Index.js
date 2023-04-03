   const mongoose = require("mongoose");
   require('dotenv').config();
   mongoose.connect(process.env.MONGODBURL);
   
/*   ****** ****   * */


const express = require("express");

const app = express(); 

const path = require('path');

app.use(express.json())

const userRouter = require ('./Router/userRouter');

const Adminrouter = require('./Router/Adminrouter');

app.use(express.static(path.join(__dirname,'Public')))



app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

next();
});

app.use('/admin',Adminrouter)

app.use('/',userRouter)



app.listen(3000,()=>{
    console.log("server started");
});
