const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

//From /users route
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router
