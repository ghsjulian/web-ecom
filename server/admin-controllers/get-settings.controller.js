const siteModel = require("../models/site.model")


const getSettings = async(req,res)=>{
    try {
        const settings = await siteModel.getSettings()
        res.status(200).json(settings )
    } catch (err) {
        console.error('Error:', err);
        return res.status(505).json({
            error : true,
            message : err.message|| "Unexpected server error"
        })
    }
}

module.exports = getSettings