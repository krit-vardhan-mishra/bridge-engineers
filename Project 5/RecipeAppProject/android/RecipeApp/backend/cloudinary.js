const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log('❌ No file path provided to Cloudinary');
      return null;
    }
    
    console.log('☁️ Starting Cloudinary upload for file:', localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    console.log('✅ Cloudinary upload successful!');
    console.log('🔗 Image URL:', response.url);
    console.log('📏 Image size:', response.bytes, 'bytes');
    
    // Clean up local file
    fs.unlinkSync(localFilePath);
    console.log('🗑️ Local file cleaned up');
    
    return response;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error.message);
    console.error('🔍 Full error:', error);
    
    // Clean up local file even on error
    try {
      fs.unlinkSync(localFilePath);
      console.log('🗑️ Local file cleaned up after error');
    } catch (cleanupError) {
      console.error('⚠️ Failed to cleanup local file:', cleanupError.message);
    }
    
    return null;
  }
};

module.exports = { uploadOnCloudinary };
