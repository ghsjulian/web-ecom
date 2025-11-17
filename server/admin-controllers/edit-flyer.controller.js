const flyerModel = require("../models/flyer.model");
const {
    uploadBase64PDF,
    DeleteFile
} = require("../configs/cloudinary.config");
const {pdfUploader,deletePDF} = require("../configs/uploader");

const editFlyer = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, flyer } = req.body;
        const host = process.env.NODE_ENV === "production" ? "https://echoda.onrender.com" : process.env.HOST;
        let fileData = null;
        let oldFlyer = await flyerModel.findById(id);
        if (flyer && id.trim() !== flyer.trim()) {
            const result = await pdfUploader(flyer);
            fileData = {
                url: `${host}/uploads/${result?.fileName}`,
                public_id: result?.fileName
            };
            await deletePDF(oldFlyer?.flyer?.public_id);
        } else {
            fileData = oldFlyer?.flyer;
        }
        const data = {
            flyer: fileData,
            title
        };

        await flyerModel.findByIdAndUpdate(id, data);
        const updatedFlyer = await flyerModel
            .find()
            .limit(10)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "✅ Flyer Updated successfully",
            updatedFlyer
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Flyer updating failed"}`
        });
    }
};

module.exports = editFlyer;
