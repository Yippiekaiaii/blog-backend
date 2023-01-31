
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

//Get all blogs
//GET /blogs

    const getAllBlogs = async (req,res) => {
        const blogs = await Blog.find().lean() //lean will make the return result a JS object rather than a mongoose document class

        //Check if at least one blog was returned
        if (!blogs?.length){
            return res.status(400).json({message:'No notes found'})
        }

        res.json(blogs)
    }

//Update blog
//PATCH /blogs

    const updateBlog = async (req,res) => {
        const { id, user, title, body, link, image, hide} = req.body //get blog details from the update form
        
        //Confirm Data
        if (!id || !user || !title || !body || typeof hide !== 'boolean') {
            return res.status(400).json({message: 'All fields are required'})
        }

        //Confirm the blog exists in the db
        const blog = await Blog.findById(id).exec()
        if (!blog){
            return res.status(400).json({message: 'Blog not found'})
        }

        //Update back to mongoDB
        blog.user = user
        blog.title = title
        blog.body = body
        blog.link = link
        blog.image = image
        blog.hide = hide

        const updatedBlog = await blog.save()

        res.json(`${updatedBlog.title} has been updated`)

    }

//Delete Blog
//DELETE /blogs

        const deleteBlog = async(req,res) => {
            const {id} = req.body

            //Confirm record exists
            const blog = await Blog.findById(id).exec()
            if (!blog) {
                return res.status(400).json({message: 'Blog not found'})
            }

            const result = await blog.deleteOne()

            const reply = `Blog ${result.title} with ID ${result._id} deleted`

            res.json(reply)
        }


module.exports = {createNewBlog, getAllBlogs, updateBlog, deleteBlog}