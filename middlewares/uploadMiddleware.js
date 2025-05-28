import multer from "multer";

// Multer Storage (Memory storage for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter for video uploads
const fileFilter = (req, file, cb) => {
  console.log("Received file:", file.originalname, file.mimetype); // Debugging line

  const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg" ,"ideo/mp4", "video/avi", "video/mov", "video/mkv"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

// Multer upload configuration
const filUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
});

export default filUpload;
