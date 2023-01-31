require ('dotenv').config()
require('express-async-errors') //Error handling dependancy
const express = require ('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose')
const dbConnection = require('./config/dbConnect')
const {logger} = require('./middleware/logger')
const {logEvents} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require ('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')

//Set port variable
const PORT = process.env.PORT||3500

//Cors
app.use(cors(corsOptions))

//Set mongoose strict mode (avoids depreciation error)
mongoose.set('strictQuery',true)
//Connect to DB
dbConnection()

//Middleware to allow app to parse json
app.use(express.json());

//Cookie Parser
app.use(cookieParser())

//Logger middleware
app.use(logger)

//Set location of public static assets
app.use('/', express.static(path.join(__dirname,'public')));

//Set routes 
app.use("/", require("./routes/root"))
app.use("/blogs", require("./routes/blogRoutes"))
app.use("/users", require("./routes/userRoutes"))


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

//Error handler middleware
app.use(errorHandler)

//Listen on designated port
mongoose.connection.once('open', ()=>{   //check connection to mongoDB is successful
    console.log("Connected to MongoDB successfully")
    app.listen(PORT, ()=> console.log("Blog server running on port " + PORT))
})

//Listen for mongoDB errors and then log them using logger function
mongoose.connection.on('error',err =>{
    console.log(err);
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`, mongoErrLog.log);
})