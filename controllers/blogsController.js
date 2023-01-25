const Blog = require('../models/blogsModel')


//Create new blog
//POST
const createNewBlog = async (req,res) => {
    const {user, title, body, link, image} = req.body //get entered fields from entry form

    //Confirm all the required fields exist - if not return error
    if (!user || !title || !body){
        return res.status(400).json({message:'All fields are required'})
    }

    //Create and store new blog in DB
    const blog = await Blog.create({user,title,body,link,image})

    if (blog){
        res.status(201).json({message:`New blog ${title} created`})
    } else {
        res.status(400).json({message:'Invalid blog data received'})
    }

}


module.exports = {createNewBlog}