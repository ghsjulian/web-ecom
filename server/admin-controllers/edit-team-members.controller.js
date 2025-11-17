const siteModel = require("../models/site.model");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const isBase64Image = require("../functions/isbase64-string");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const editTeamMembers = async (req, res) => {
    try {
        const site = await siteModel.getSettings();
        const { name } = req.params; // ✅ member name from param
        const { memberImage, memberName, memberAbout } = req.body;

        if (!site.teamMembers || site.teamMembers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "⚠️ No team members found"
            });
        }

        // ✅ Find member index (case-insensitive)
        const memberIndex = site.teamMembers.findIndex(
            m => m.memberName.toLowerCase().trim() === name.toLowerCase().trim()
        );

        if (memberIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `⚠️ Team member '${name}' not found`
            });
        }

        const member = site.teamMembers[memberIndex];
        let updatedImage = member.memberImage;

        // ✅ If new base64 image provided → replace old one
        if (memberImage && isBase64Image(memberImage)) {
            if (member.memberImage?.public_id) {
                await DeleteFile(member.memberImage.public_id);
            }

            const uploadResult = await Uploader(memberImage, getString());
            updatedImage = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        // ✅ Update member details
        site.teamMembers[memberIndex] = {
            ...member,
            memberName: memberName ?? member.memberName,
            memberAbout: memberAbout ?? member.memberAbout,
            memberImage: updatedImage
        };

        await site.save();
        const updatedSite = await siteModel.getSettings();

        return res.status(200).json({
            success: true,
            message: `✅ ${name}' updated successfully`,
            updatedSite
        });
    } catch (err) {
        console.error("Error updating team member:", err);
        return res.status(500).json({
            success: false,
            message: `⚠️ ${err.message || "Failed to update team member"}`
        });
    }
};

module.exports = editTeamMembers;
