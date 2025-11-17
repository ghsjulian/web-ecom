const blogModel = require("../models/blog.model");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const isBase64Image = require("../functions/isbase64-string");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const editBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { blogTitle, blogImage, blogContent } = req.body;

        let imageData = null;
        let oldblog = await blogModel.findById(id);
        // ✅ Only upload if image is base64
        if (blogImage && isBase64Image(blogImage)) {
            const result = await Uploader(blogImage, getString());
            imageData = {
                url: result?.secure_url,
                public_id: result?.public_id
            };
            await DeleteFile(oldblog?.blogImage?.public_id)
        } else {
            imageData = oldblog?.blogImage;
        }
        const data = {
            blogImage: imageData,
            blogTitle,
            blogContent
        };

        const newBlog = await blogModel.findByIdAndUpdate(id, data);
        return res.status(200).json({
            success: true,
            message: "✅ Blog Updated successfully",
            newBlog
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Blog updating failed"}`
        });
    }
};

module.exports = editBlog;
