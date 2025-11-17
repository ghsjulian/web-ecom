const blogModel = require("../models/blog.model");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const isBase64Image = require("../functions/isbase64-string");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params; 
        const blog = await blogModel.findById(id)
        if (blog && blog?.blogImage) {
            await DeleteFile(blog?.blogImage?.public_id);
            await blogModel.findByIdAndDelete(id)
            const updatedBlog = await blogModel.find().limit(10).sort({createdAt:-1});
            return res.status(200).json({
                success: true,
                message: `✅ blog deleted successfully`,
                updatedBlog
            });
        }
    } catch (err) {
        console.error("Error deleting blog :", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Failed to delete blog"}`
        });
    }
};

module.exports = deleteBlog;
