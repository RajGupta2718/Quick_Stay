// Import necessary libraries
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary with your account details
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

//define storage cloudinary account pr yeh folder chaiye
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'quickStay_dev',
      allowerdFormats: ["png","jpg","jpeg"],
    },
});

module.exports={
    cloudinary,
    storage
}