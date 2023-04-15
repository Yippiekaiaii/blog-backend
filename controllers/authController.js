const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//login
//POST /auth
const login = async (req,res) => {

        const { username, password } = req.body

        //Require both username and password
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        //Check user exist and status is active
        const foundUser = await User.findOne({ username }).exec()
        if (!foundUser || !foundUser.active) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        //Try to match the password using bcrypt
        const match = await bcrypt.compare(password, foundUser.password)

        //If no match reject the login and return an unauthorized message
        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        //Create access token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username, //puts user name and roll into the access token
                    "role": foundUser.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET, //pass in environment variable with access token secret
            { expiresIn: '15m' } //set expirey time
        )

        //Create refresh token
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: 'None', //cross-site cookie - needed if API is hosted on a different server to front end
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match refresh token
        })

        // Send accessToken containing username and roles 
        res.json({ accessToken })

}


//Refresh token
//GET /auth/refresh
const refresh = (req,res) => {

        //Expecting cookie with the request
        const cookies = req.cookies

        //If cookie named jwt doesnt exist (ie sent in the request) then send unauthorized
        if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

        //if successful put refresh token cookie into a variable
        const refreshToken = cookies.jwt

        //use jwt dependancy to verify the token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Forbidden' })

                //Look inside decoded refresh token to see if we have a user
                const foundUser = await User.findOne({ username: decoded.username }).exec()
                //If not found return unauthorized
                if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": foundUser.username,
                            "role": foundUser.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )

                res.json({ accessToken })
            }
        )
}

//logout
//POST /auth/logout
const logout = (req,res) => {

        //Check for refresh cookie in the  request
        const cookies = req.cookies
        //If there is no cookie the return that request was successful but there was no content 
        if (!cookies?.jwt) return res.sendStatus(204) //No content
        //if cookie found clear the cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        res.json({ message: 'Cookie cleared' })
}

module.exports = {login,refresh,logout}