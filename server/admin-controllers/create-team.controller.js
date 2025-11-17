const siteModel = require("../models/site.model");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const isBase64Image = require("../functions/isbase64-string");

const getString = () => {
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  return "ghs---" + randomNumber.toString();
};

const createTeam = async (req, res) => {
  try {
    const site = await siteModel.getSettings();
    const { memberImage, memberName, memberAbout } = req.body;

    let imageData = null;

    // ✅ Only upload if image is base64
    if (memberImage && isBase64Image(memberImage)) {
      const result = await Uploader(memberImage, getString());
      imageData = {
        url: result?.secure_url,
        public_id: result?.public_id,
      };
    } else if (typeof memberImage === "string" && memberImage.startsWith("http")) {
      // If user provided an existing URL
      imageData = {
        url: memberImage,
        public_id: null,
      };
    }

    // ✅ New team member data
    const data = {
      memberImage: imageData,
      memberName,
      memberAbout,
    };

    // ✅ Ensure teamMembers array exists
    site.teamMembers = site.teamMembers || [];

    // ✅ Add new member
    site.teamMembers = [...site.teamMembers, data];

    await site.save();

    const updatedSite = await siteModel.getSettings();

    return res.status(200).json({
      success: true,
      message: "✅ Team member created successfully",
      updatedSite,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: `⚠️ ${err.message || "Team member creation failed"}`,
    });
  }
};

module.exports = createTeam;
