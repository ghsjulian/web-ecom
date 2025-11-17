const siteModel = require("../models/site.model");
const isBase64Image = require("../functions/isbase64-string");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const saveSettings = async (req, res) => {
    try {
        const site = await siteModel.getSettings();

        const {
            bannerImage,
            aboutImage,
            bannerText,
            bannerHeading,
            aboutDescription
        } = req.body;

        // ✅ Initialize data object
        const data = {
            bannerImage: site?.aboutPage?.bannerImage || "",
            aboutImage: site?.aboutPage?.aboutImage || "",
            bannerText,
            bannerHeading,
            aboutDescription
        };

        // ✅ If bannerImage is base64, upload to Cloudinary
        if (bannerImage && isBase64Image(bannerImage)) {
            // Delete old banner if exists
            if (site.bannerImage?.public_id) {
                await DeleteFile(site?.aboutPage?.bannerImage?.public_id);
            }

            const uploadRes = await Uploader(bannerImage, getString());
            data.bannerImage = {
                url: uploadRes?.secure_url,
                public_id: uploadRes?.public_id
            };
        }
        // ✅ If aboutImage is base64, upload to Cloudinary
        if (aboutImage && isBase64Image(aboutImage)) {
            // Delete old about image if exists
            if (site?.aboutPage?.aboutImage?.public_id) {
                await DeleteFile(site?.aboutPage?.aboutImage?.public_id);
            }
            const uploadRes = await Uploader(aboutImage, getString());
            data.aboutImage = {
                url: uploadRes?.secure_url,
                public_id: uploadRes?.public_id
            };
        }

        // ✅ Merge and save
        // Object.assign(site, data);
        site.aboutPage = {
            ...site.aboutPage,
            ...data
        };
        await site.save();

        // ✅ Fetch updated version
        const updatedSite = await siteModel.getSettings();

        res.json({
            success: true,
            message: "✅ Site settings updated successfully!",
            site: updatedSite
        });
    } catch (err) {
        console.error("Error saving site settings:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to update site settings",
            error: err.message
        });
    }
};

module.exports = saveSettings;
