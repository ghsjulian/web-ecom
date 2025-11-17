const flyerModel = require("../models/flyer.model");

const downloadFlyer = async (req, res) => {
    try {
        const { id } = req.params;
        const flyer = await flyerModel.findById(id);
        return res.status(200).json({
            success: true,
            message: "flyer found",
            link: flyer?.flyer?.url
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(505).json({
            success: false,
            message: err.message || "Unexpected error"
        });
    }
};

module.exports = downloadFlyer;
