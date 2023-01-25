const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
{
    user:{
        //type: mongoose.Schema.Types.ObjectId, //data type is a mongoose objectID
        type: String,
        required: true,
        ref: 'User' //set which schema the id comes from
    },
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    hide:{
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
},
    {
        timestamps:true
    }

)


module.exports = mongoose.model('Blog', blogSchema)