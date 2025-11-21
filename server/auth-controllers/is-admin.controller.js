const isAdminController = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Admin Access Granted",
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Admin Access Denied",
    });
  }
};

module.exports = isAdminController;
