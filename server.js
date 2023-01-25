require ('dotenv').config()
require('express-async-errors') //Error handling dependancy
const express = require ('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose')
const dbConnection = require('./config/dbConnect')

//Set port variable
const PORT = process.env.PORT||3500

//Set mongoose strict mode (avoids depreciation error)
mongoose.set('strictQuery',true)
//Connect to DB
dbConnection()

//Middleware to allow app to parse json
app.use(express.json());

//Set location of public static assets
app.use('/', express.static(path.join(__dirname,'public')));

//Set routes 
app.use("/", require("./routes/root"))
app.use("/blogs", require("./routes/blogRoutes"))

/*
//Handle any requests that do not follow any of the previous routes
app.all('*', (req,res)=>{ 
    res.status(404)
    if (req.accepts('html')) {
        //If request is for html
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')){
        //If request is for json
        res.json({message:'404 Not Found'})
    } else {
        //if request is for anything else (returns text as it is universal)
        res.type('txt').send('404 Not Found')
    }
})
*/

//Listen on designated port
mongoose.connection.once('open', ()=>{   //check connection to mongoDB is successful
    console.log("Connected to MongoDB successfully")
    app.listen(PORT, ()=> console.log("Blog server running on port " + PORT))
})
