const { env } = require("#configs/constants.config");
const { cloud } = env;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: cloud.apiName,
    api_key: cloud.apiKey,
    api_secret: cloud.apiSecret,
    secure: true,
});

module.exports = cloudinary;
