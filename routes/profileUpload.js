import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import pool from "../db.js";
import { verifyToken } from "../authMiddleware.js";
import streamifier from "streamifier";

const router = express.Router();

// Multer setup (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", verifyToken, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Wrap Cloudinary upload_stream in a Promise
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Wait for Cloudinary upload
    const uploadResult = await streamUpload(req.file.buffer);

    // Save Cloudinary URL to DB
    await pool.query("UPDATE users SET profile_pic = $1 WHERE id = $2", [
      uploadResult.secure_url,
      req.user.id,
    ]);

    res.json({
      message: "Profile uploaded successfully",
      profilePicUrl: uploadResult.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
