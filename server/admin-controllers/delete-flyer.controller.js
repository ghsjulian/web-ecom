const flyerModel = require("../models/flyer.model");
const {
    uploadBase64PDF,
    DeleteFile} = require("../configs/cloudinary.config");
const {deletePDF} = require("../configs/uploader");


const deleteFlyer = async (req, res) => {
    try {
        const { id } = req.params;
        let oldFlyer = await flyerModel.findById(id);
        if (oldFlyer && oldFlyer?._id) {
            await deletePDF(oldFlyer?.flyer?.public_id);
            await flyerModel.findByIdAndDelete(id) 
            const updatedFlyer = await flyerModel
            .find()
            .limit(10)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "✅ Flyer Deleted successfully",
            updatedFlyer
        });
        } else {
throw new Error('No flyer found');
      }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Flyer deleting failed"}`
        });
    }
};

module.exports = deleteFlyer;
