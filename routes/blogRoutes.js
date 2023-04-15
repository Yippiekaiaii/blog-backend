const express = require('express')
const router = express.Router()
const blogsController = require('../controllers/blogsController')
const verifyJWT = require('../middleware/verifyJWT')

//From /blogs route
router.route('/')
    .get(blogsController.getAllBlogs)
    .post(verifyJWT, blogsController.createNewBlog)
    .patch(verifyJWT,blogsController.updateBlog)
    .delete(verifyJWT,blogsController.deleteBlog)


module.exports = router