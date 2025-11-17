const userModel = require("../models/user.model");
const { decodeJWT } = require("../functions/jwt-token-generator");

const isAdmin = async (req, res, next) => {
    try {
        const token = req?.cookies?.echodaadmin || null;
        if (token === null) throw new Error('No token provided');
        const decoded = await decodeJWT(token);
        if (!decoded || decoded === null) throw new Error('Unauthorized - invalid user token');
        // check if user exists in DB or has admin role (optional)
        const user = await userModel.findById(decoded._id);
        if (!user) throw new Error('User not found');
        // ensure only admins pass:
        if (user.role !== 'ADMIN') throw new Error('Access denied - not an admin');
        req.user = user;
        next(); 
    } catch (err) {
        console.error('Error:', err);
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = isAdmin;
