const multer = require('multer');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

// Image file filter
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
    return cb(new Error('You can only upload images'), false);
  }
  cb(null, true);
};

// Multer upload configuration
const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = upload;
