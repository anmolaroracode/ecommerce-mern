const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup (store file in memory instead of saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No File Provided" });

    // Function to handle streaming upload
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        // Convert file buffer to stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Upload the file
    const result = await streamUpload(req.file.buffer);

    // Respond with the Cloudinary URL
    res.json({ imageUrl: result.secure_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
