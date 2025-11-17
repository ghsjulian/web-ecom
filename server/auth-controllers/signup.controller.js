const userModel = require("../models/user.model");
const { createHash } = require("../functions/password-hashing");
const { createJWT, setCookie } = require("../functions/jwt-token-generator");
const sendMail = require("../configs/mailer.config");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const signupController = async (req, res) => {
    const publicID = getString();
    try {
        const { name, email, password, profile, isProfile } = req.body;
        let avatar = null;

        if (!name && !email && !password)
            throw new Error("All fields are required");
        const existUser = await userModel.findOne({
            email: email.trim()
        });
        if (existUser) throw new Error("User Already Registered");
        const hash = await createHash(password.trim());
        if (isProfile) {
            const uploadResult = await Uploader(profile, publicID);
            avatar = uploadResult?.secure_url;
        }
        const newUser = new userModel({
            name,
            email,
            password: hash,
            role: "ADMIN",
            avatar: isProfile ? avatar : ""
        });
        const token = await createJWT({ _id: newUser._id, name, email });
        setCookie(res, token);
        await newUser.save();
        // let otp = Math.floor(Math.random() * (900000 - 100000)) + 100000;
        // This is commented because i'm in offline
        // And offline can't send emails
        // await sendMail(name, email, otp);
        const user = await userModel.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            token,
            user,
            message: "User Created Successfully"
        });
    } catch (error) {
        await DeleteFile(publicID);
        return res.status(403).json({
            success: false,
            message: error.message || "Server Error - 403"
        });
    }
};

module.exports = signupController;
