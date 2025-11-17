const blogModel = require("../models/blog.model");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const isBase64Image = require("../functions/isbase64-string");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const createBlog = async (req, res) => {
    try {
        const {blogTitle,
        blogImage,
        blogContent} = req.body

        let imageData = null;

        // ✅ Only upload if image is base64
        if (blogImage && isBase64Image(blogImage)) {
            const result = await Uploader(blogImage, getString());
            imageData = {
                url: result?.secure_url,
                public_id: result?.public_id
            };
        } 
        const data = {
            blogImage: imageData,
            blogTitle,
            blogContent
        };
        
        const newBlog = await new blogModel(data)
        await newBlog.save()
        return res.status(200).json({
            success: true,
            message: "✅ Blog created successfully",
            newBlog
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Blog creation failed"}`
        });
    }
};

module.exports = createBlog;
