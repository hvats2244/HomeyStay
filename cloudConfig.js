const cloudinary = require('cloudinary').v2;//npm i cloudinary isko install kiya h
const { CloudinaryStorage } = require('multer-storage-cloudinary');//npm i multer-storage-cloudinary isko bhi install kiya h .

//backend sa cloudinary ko connect krna k liya ham ya krta h .
cloudinary.config({

    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET

});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      allowedFormats:["png","jpg","jpeg"], // supports promises as well
    
    },
  });

module.exports={
    cloudinary,
    storage
};
