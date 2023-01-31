
const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {//First option in the or is only items in our allowedOrigins array, second option is no origin (eg postman)            
            callback(null, true) //first variable it if we have error so we set to null as this is only triggered if we are successful, second tells cors if the request should be allowed
        } else {
             callback(new Error('Not allowed by CORS')) //if the request failts the CORS check then reply with an error message
        }
    },
    credentials: true, //set access control allowed credenitials header 
    optionsSuccessStatus: 200 //Provides a status code to use for successful OPTIONS requests
}

module.exports = corsOptions