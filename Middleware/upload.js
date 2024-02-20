const multer = require('multer');

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
