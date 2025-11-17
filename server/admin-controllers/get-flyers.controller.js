const flyerModel = require("../models/flyer.model")

const getFlyers = async(req,res)=>{
    try {
        const flyers = await flyerModel.find().select("-flyer").limit(10).sort({createdAt : -1})
        return res.status(200).json({
            success:true,
            message : "flyers found",
            flyers
        })
    } catch (err) {
        console.error('Error:', err);
        return res.status(505).json({
            success : false,
            message : err.message || "Unexpected error"
        })
    }
}

module.exports = getFlyers