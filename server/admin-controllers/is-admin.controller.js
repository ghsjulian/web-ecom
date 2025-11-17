const userModel = require("../models/user.model")

const isAdmincontroller = async(req,res)=>{
    try {
        const {_id} = req.user
        const admin = await userModel.findById(_id)
        if(admin && admin?.role === "ADMIN"){
            return res.status(200).json({
                success : true,
                message : "Admin verification successfully"
            })
        }
    } catch (err) {
        console.error('Error:', err);
        return res.status(505).json({
                success : false,
                message : err.message || "Admin verification failed"
            })
    }
}

module.exports = isAdmincontroller