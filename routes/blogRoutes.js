const express = require('express')
const router = express.Router()
const blogsController = require('../controllers/blogsController')

//From /blogs route
router.route('/')
    .get(blogsController.getAllBlogs)
    .post(blogsController.createNewBlog)
    .patch(blogsController.updateBlog)
    .delete(blogsController.deleteBlog)


module.exports = router