const {format} = require('date-fns');
const {v4: uuid} = require('uuid'); //creates unique id for each log item
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

//Helper function to create log format
const logEvents = async(message,logFileName)=>{
    const dateTime = `${format(new Date(), 'dd/MM/yyy\tHH:mm:ss')}`
    const logItem = `${dateTime}\t id: ${uuid()}\t${message}\n` 

    try {
        if (!fs.existsSync(path.join(__dirname,'..', 'logs'))){ //Checks if log dir exists
            await fsPromises.mkdir(path.join(__dirname,'..', 'logs')) //if not create log dir
        }
        await fsPromises.appendFile(path.join(__dirname,'..', 'logs',logFileName), logItem) //create and append log file with 

        } catch (err){
        console.log(err)
    }
}

const logger = (req,res,next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log') //Calls the above function  \t creates a tab
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = {logEvents, logger};