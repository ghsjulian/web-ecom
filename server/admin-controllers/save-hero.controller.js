const siteModel = require("../models/site.model");
const isBase64Image = require("../functions/isbase64-string");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const saveHero = async (req, res) => {
    try {
        const site = await siteModel.getSettings();

        const { heroImage, heroHeading, heroSubHeading, heroDescription } =
            req.body;

        // ✅ Initialize data object
        const data = {
            heroImage: site?.hero?.heroImage || "",
            heroHeading,
            heroSubHeading,
            heroDescription
        };

        // ✅ If bannerImage is base64, upload to Cloudinary
        if (heroImage && isBase64Image(heroImage)) {
            // Delete old banner if exists
            if (site?.hero?.heroImage?.public_id) {
                await DeleteFile(site?.hero?.heroImage?.public_id);
            }

            const uploadRes = await Uploader(heroImage, getString());
            data.heroImage = {
                url: uploadRes?.secure_url,
                public_id: uploadRes?.public_id
            };
        }
        // ✅ Merge and save
        // Object.assign(site, data);
        site.hero = {
            ...site.hero,
            ...data
        };
        await site.save();

        // ✅ Fetch updated version
        const updatedSite = await siteModel.getSettings();

        res.json({
            success: true,
            message: "✅ Site  Hero updated successfully!",
            site: updatedSite
        });
    } catch (err) {
        console.error("Error saving hero settings:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to update site settings",
            error: err.message
        });
    }
};

module.exports = saveHero;
