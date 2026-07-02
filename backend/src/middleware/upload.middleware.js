const multer = require('multer');
const { storage, slipStorage } = require('../config/cloudinary');

const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).array('images', 8);

const uploadSlip = multer({
  storage: slipStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('slip');

module.exports = {
  uploadProductImages,
  uploadSlip
};
