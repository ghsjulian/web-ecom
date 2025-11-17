const siteModel = require("../models/site.model");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const isBase64Image = require("../functions/isbase64-string");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const deleteTeamMembers = async (req, res) => {
    try {
        const site = await siteModel.getSettings();
        const { name } = req.params; // ✅ member name from param

        if (!site.teamMembers || site.teamMembers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "⚠️ No team members found"
            });
        }

        // ✅ Find member index (case-insensitive)
        const filteredMember = site.teamMembers.filter(
            m => m.memberName.toLowerCase().trim() !== name.toLowerCase().trim()
        );
        const deletedMember = site.teamMembers.filter(
            m => m.memberName.toLowerCase().trim() === name.toLowerCase().trim()
        );

        // ✅ If new base64 image provided → replace old one
        if (deletedMember[0] && deletedMember[0].memberImage) {
            await DeleteFile(deletedMember[0].memberImage.public_id);
            site.teamMembers = filteredMember?.length>0 ? filteredMember : []
            await site.save();
            const updatedSite = await siteModel.getSettings();
            return res.status(200).json({
                success: true,
                message: `✅ ${name}' deleted successfully`,
                updatedSite
            });
        }
    } catch (err) {
        console.error("Error deleting team member:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Failed to delete team member"}`
        });
    }
};

module.exports = deleteTeamMembers;
