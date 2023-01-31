const {logEvents} = require('./logger')

const errorHandler = (err, req,res,next)=>{
    logEvents(`${err.name}:${err.message}\t${req.method}\t${req.headers.origin}`,'errLog.log')

    //Console log the full error message
    console.log(err.stack)
    
    const status = res.statusCode ? res.statusCode :500 //server error
    
    //Set the status to when ever the above ternary determines
    res.status(status)
    res.json({message:err.message, isError:true})
}

module.exports = errorHandler