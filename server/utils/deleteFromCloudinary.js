const { cloudinary } = require("../utils/cloudinary");

const deleteFromCloudinary = async (picId) => {
    await cloudinary.uploader.destroy(picId);
}

module.exports = deleteFromCloudinary;