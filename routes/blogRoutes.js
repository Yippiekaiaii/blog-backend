const express = require('express')
const router = express.Router()
const blogsController = require('../controllers/blogsController')

router.route('/')
    .get()
    .post(blogsController.createNewBlog)
    .patch()
    .delete()


module.exports = router