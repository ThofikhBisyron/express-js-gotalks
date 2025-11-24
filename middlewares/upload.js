const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploader = (whereFolder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = `uploads/${whereFolder}`;
      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);

      const safeBase = base
      .replace(/[^a-zA-Z0-9]/g, "-") 
      .toLowerCase();

      const uniqueName = `${Date.now()}-${safeBase}${ext}`;
      cb(null, uniqueName);
      },
  });

  return multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      if (![".jpg", ".jpeg", ".png", ".heic"].includes(ext.toLowerCase())) {
        return cb(new Error("Only image files are allowed"));
      }
      cb(null, true);
    }, 
  });
};

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {

    return res.status(400).json({ error: err.message });
  } else if (err) {

    return res.status(400).json({ error: err.message });
  }
  next();
};


module.exports = {createUploader, multerErrorHandler};
