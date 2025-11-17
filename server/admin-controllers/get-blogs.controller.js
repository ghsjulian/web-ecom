const blogModel = require("../models/blog.model")

const getBlogs = async(req,res)=>{
    try {
        const blogs = await blogModel.find().limit(10).sort({createdAt : -1})
        return res.status(200).json({
            success:true,
            message : "blog found",
            blogs
        })
    } catch (err) {
        console.error('Error:', err);
        return res.status(505).json({
            success : false,
            message : err.message || "Unexpected error"
        })
    }
}

module.exports = getBlogs