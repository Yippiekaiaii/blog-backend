const User = require('../models/userModel')
const bcrypt = require('bcrypt')

//Create User
//POST
        const createUser = async (req,res) =>{
            const {username,password,role} = req.body

            //Confirm Data
            if(!username||!password) {
                return res.status(400).json({message:'All fields are required'})
            }

            //Check for a duplicate username
            const duplicate = await User.findOne({username}).collation({locale:'en', strength:2}).lean().exec() //.collation with strength value of 2 makes it case insensative eg Dave will be see the same as dave
            if (duplicate){
                return res.status(409).json({message:'Duplicate username'})
            }

            //Hash the password
            const hashedPassword = await bcrypt.hash(password,10) //10 salt rounds

            //Create and store new user
            const userObject = {username,"password":hashedPassword, role}
            const user = await User.create(userObject)

            if (user) {
                res.status(201).json({message:`New User ${username} has been created`})
            } else {
                res.status(400).json({message:'Invalid user data'})
            }
        }
        

//Get Users
//GET 
        const getAllUsers = async (req,res)=>{
            const users = await User.find().select('-password').lean() // -password ommits the password field from the results for security
            if (!users?.length){
                return res.status(400).json({message:'No users found'})
            }
            res.json(users)
        }

//Update User
//PATCH

        const updateUser = async (req,res) => {
            const {id,username,password,role,active} = req.body

            //confirm data
            if (!id || !username || !role || !active) {
                return res.status(400).json({message:'All fields are required'})                
            }

            const user = await User.findById(id).exec() 

            //Check user already exists
            if (!user) {
                return res.status(400).json({message:'User note found'})
            }

            //Check for duplicate username
            const duplicate = await User.findOne({username}).collation({locale:'en', strength: 2}).lean().exec() //.collation with strength value of 2 makes it case insensative eg Dave will be see the same as dave
            if (duplicate && duplicate?._id.toString() !==id){
                return res.status(409).json({message:'Duplicate Username'})
            }

            //Update record
            user.username = username
            user.role = role
            user.active = active

            //If new password
            if (password) {
                //hash password
                user.password = await bcrypt.hash(password,10)
            }

            const updateUser = await user.save()
            res.json({message: `${updateUser.username} has been updated`})

        }

//Delete User
//DELETE
        const deleteUser = async (req,res) => {
            const {id} = req.body

            //Confirm request data
            if (!id) {
                return res.status(400).json({message:'User ID required'})
            }

            //Check if user exists
            const user = await User.findOne({id}).exec()
            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }

            //Delete user
            const deletedUser = await user.deleteOne()
            const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`
            res.json(reply)

        }



module.exports = {createUser,getAllUsers,updateUser,deleteUser}