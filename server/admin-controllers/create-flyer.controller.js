const flyerModel = require("../models/flyer.model");
const {
    uploadBase64PDF,
    DeleteFile,
    deletePDF
} = require("../configs/cloudinary.config");
const {pdfUploader} = require("../configs/uploader");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const createFlyer = async (req, res) => {
    try {
        const host = process.env.NODE_ENV === "production" ? "https://echoda.onrender.com" : process.env.HOST;
        const { flyer, title } = req.body;
        let fileData = null;
        if (flyer && title) {
            const result = await pdfUploader(flyer);
            fileData = {
                url: `${host}/uploads/${result?.fileName}`,
                public_id: result?.fileName
            };
        } else {
            throw new Error("No file provided");
        }
        const data = {
            flyer: fileData,
            title
        };
        const newFlyer = await new flyerModel(data);
        await newFlyer.save();
        const updatedFlyer = await flyerModel
            .find()
            .limit(10)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "✅ Flyer created successfully",
            updatedFlyer
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Flyer creation failed"}`
        });
    }
};

module.exports = createFlyer;
