//Middleware to protect endpoints from unauthorised requests

const jwt = require('jsonwebtoken')

const verifyJWT = (req,res,next) => {

    //Check auth header exists and and that it starts with "Bearer "
    const authHeader = req.headers.authorization || req.headers.Authorization //as there is no standard for upper or lower case on Authorization it looks for both
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    //Get token by splitting the auth header string, we want value after the space in bearer 
    const token = authHeader.split(' ')[1]

    //Verify the token with jwt
    jwt.verify(
        token, //pass in the token
        process.env.ACCESS_TOKEN_SECRET, //verify it with the token secret from .env
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.UserInfo.username //set the req user to the username from the token
            req.role = decoded.UserInfo.role //set the req role to the role from the token
            next() //calls next middleware or controller
        }
    )

}

module.exports = verifyJWT