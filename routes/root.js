const express = require('express')
const router = express.Router()
const path = require('path')

//If the root of the url is hit then return a basic splash page

router.get('^/$|/index(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname,'..', 'views', 'index.html'))
})

module.exports = router;